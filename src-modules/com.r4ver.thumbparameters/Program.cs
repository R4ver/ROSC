using Valve.VR;
using BOLL7708;
using static BOLL7708.EasyOpenVRSingleton;
using SharpOSC;
using ROSC.WS;

namespace ROSC.module
{
    public class ThumbParameters {
        public string id = "rosc.module.thumbparameters";
        public int leftThumb {get; set;} = 0;
        public int rightThumb {get; set;} = 0;
        public bool isIndex {get; set;} = false;
        public bool connectedToOVR {get; set;} = false;
    }
    public class ThumbParametersModule
    {

        private static ThumbParameters thumbParams = new ThumbParameters();
        private static WebSocketHelper WS = new WebSocketHelper();
        private static Thread? ThumbParamsThread;
        private static bool OVRInstance = false;
        private static bool _isRunning = false;
        private static string? currentController = null;
        private static bool IsKnuckles = false;
        private static bool _processKilled = false;
        public static bool IsRunning
        {
            get { return _isRunning; }
            set
            {
                _isRunning = value;
            }
        }
        private bool requestedExit = true;
        private static UDPSender oscSender = new UDPSender("127.0.0.1", 9000);

        static EasyOpenVRSingleton OVR = EasyOpenVRSingleton.Instance;

        public class IInput
        {
            public string Name { get; set; } = "";
            public string Path { get; set; } = "";
            public int ThumbPosition { get; set; } = 0;
            public bool IsRight { get; set; }
            public bool IsTouched { get; set; } = false;
        }

        static List<IInput> InputList = new List<IInput>()
        {
            new IInput { Name = "X", Path = "/actions/default/in/leftXTouch", ThumbPosition= 1, IsRight = false, IsTouched = false},
            new IInput { Name = "Y", Path = "/actions/default/in/leftYTouch", ThumbPosition= 2, IsRight = false, IsTouched = false},
            new IInput { Name = "Track1", Path = "/actions/default/in/lefttrackpadtouch", ThumbPosition = 3, IsRight = false },
            new IInput { Name = "T1", Path = "/actions/default/in/leftThumbstickTouch", ThumbPosition = 4, IsRight = false},
            new IInput { Name = "TR1", Path = "/actions/default/in/leftThumbrestTouch", ThumbPosition = 5, IsRight = false },


            new IInput { Name = "A", Path = "/actions/default/in/rightATouch", ThumbPosition= 1, IsRight = true, IsTouched = false},
            new IInput { Name = "B", Path = "/actions/default/in/rightBTouch", ThumbPosition= 2, IsRight = true, IsTouched = false},
            new IInput { Name = "Track2", Path = "/actions/default/in/righttrackpadtouch", ThumbPosition = 3, IsRight = true },
            new IInput { Name = "T2", Path = "/actions/default/in/rightThumbstickTouch", ThumbPosition= 4, IsRight = true},
            new IInput { Name = "TR2", Path = "/actions/default/in/rightThumbrestTouch", ThumbPosition = 5, IsRight = true },
        };

        public static void Main(string[] args)
        {

            WS.Init();

            WS.Socket.ReconnectionHappened.Subscribe(info =>
            {
                Console.WriteLine($"Reconnection happened, type: {info.Type}, url: {WS.Socket.Url}");
                if ( info.Type.ToString() == "Initial" ) {
                    WS.SendIdentifier(thumbParams.id);
                    StartListening();
                }
            });

            OVRInstance = OVR.Init();

            if (!OVRInstance)
            {
                Console.WriteLine("Can't connect to Headset");
                return;
            }
            Console.WriteLine("We are connected");

            currentController = GetControllerType();
            Console.WriteLine(currentController);
            IsKnuckles = currentController.Contains("Knuckles");
            Console.WriteLine(IsKnuckles);

            Console.WriteLine(AppDomain.CurrentDomain.BaseDirectory + "action_manifest.json");
            var ioErr = OVR.LoadActionManifest(AppDomain.CurrentDomain.BaseDirectory + "action_manifest.json");
            if (ioErr != EVRInputError.None) Console.WriteLine($"Failed to load Action Manifest: {Enum.GetName(typeof(EVRInputError), ioErr)}");
            else Console.WriteLine("Action Manifest loaded successfully.");

            Console.WriteLine("OpenVR initialized successfully.");

            // Load app manifest, I think this is needed for the application to show up in the input bindings at all
            var appError = OVR.AddApplicationManifest(AppDomain.CurrentDomain.BaseDirectory + "./app.vrmanifest", "r4ver.rosc.thumbparams", false);
            if (appError) Console.WriteLine($"Failed to load Application Manifest: {Enum.GetName(typeof(EVRApplicationError), appError)}");
            else Console.WriteLine("Application manifest loaded successfully.");

            // #4 Get action handles

            Action<InputDigitalActionData_t, InputActionInfo> InputHandler = (data, info) =>
            {
                IInput? thumbData = null;

                if (data.bChanged)
                {
                    thumbData = InputList.Find(item => item.Path == info.path);
                    if (thumbData == null) return;
                    thumbData.IsTouched = data.bState ? true : false;
                }

                if (thumbData == null) return;

                var xBtn = InputList.ElementAt(0);
                var yBtn = InputList.ElementAt(1);
                var doubleXY = xBtn.IsTouched && yBtn.IsTouched;

                var aBtn = InputList.ElementAt(5);
                var bBtn = InputList.ElementAt(6);
                var doubleAB = aBtn.IsTouched && bBtn.IsTouched;

                var thumbInt = 0;

                Func<bool, int> GetThumbInt = (isRight) =>
                {
                    var inputsArray = InputList.FindAll(e => isRight ? (e.IsTouched && e.IsRight) : e.IsTouched && !e.IsRight);
                    var doubleCheck = isRight ? doubleAB : doubleXY;

                    if (doubleCheck)
                    {
                        if ( IsKnuckles )
                        {
                            return 2;
                        }

                        return 3;
                    } else if ( inputsArray.Count == 1 )
                    {
                        return inputsArray[0].ThumbPosition;
                    }

                    return 0;
                };

                thumbParams.leftThumb = GetThumbInt(false);
                thumbParams.rightThumb = GetThumbInt(true);

                WS.SendUpdate(thumbParams);

                var OSCPath = thumbData.IsRight ? "/avatar/parameters/RightThumb" : "/avatar/parameters/LeftThumb";
                thumbInt = thumbData.IsRight ? thumbParams.rightThumb : thumbParams.leftThumb;

                oscSender.Send(new OscMessage(OSCPath, thumbInt));
            };

            for (var i = 0; i < InputList.Count; i++)
            {
                var input = InputList[i];
                OVR.RegisterDigitalAction(input.Path, InputHandler);
                Console.WriteLine($"Action Handle {input.Path}: {InputHandler}");
            }

            // #5 Get action set handle
            Console.WriteLine("Getting action set handle");
            OVR.RegisterActionSet("/actions/default");

            if (ThumbParamsThread == null)
            {
                if (IsRunning) return;
                Console.WriteLine("Starting Thumb Params");
                if ( !OVRInstance )
                {
                    IsRunning = false;
                    Console.WriteLine("No OVR Instance");
                    return;
                }
                IsRunning = true;
                ThumbParamsThread = new Thread(Worker);
                ThumbParamsThread.IsBackground = true;
                ThumbParamsThread.Start();
            }

            Console.ReadLine();
        }

        public static void StartListening()
        {
            WS.Socket.MessageReceived.Subscribe(msg =>
            {
                var message = msg.ToString();
                Console.WriteLine($"Message received: {message}");
            });
        }

        public static string? GetControllerType()
        {
            if (!OVRInstance)
                return null;

            var rightHand = OpenVR.System.GetTrackedDeviceIndexForControllerRole(ETrackedControllerRole.RightHand);
            var sb = new System.Text.StringBuilder((int)64);
            ETrackedPropertyError propError = ETrackedPropertyError.TrackedProp_UnknownProperty;
            OpenVR.System.GetStringTrackedDeviceProperty(rightHand, ETrackedDeviceProperty.Prop_ModelNumber_String, sb, 2000, ref propError);
            return sb.ToString();
        }

        private static void Worker()
        {
            try
            {
                while (IsRunning)
                {
                    DateTime start = DateTime.UtcNow;

                    OVR.UpdateActionStates();

                    DateTime end = DateTime.UtcNow;

                    int sleepDelay = (10 - (int)Math.Max(0L, (long)(end - start).TotalMilliseconds));
                    if (sleepDelay > 0)
                    {
                        Thread.Sleep(sleepDelay);
                    }
                }
            }
            catch
            {
                Console.WriteLine("Failed to restart Thumb Param Update");
            }

        }
    }
}
