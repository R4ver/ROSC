import React, { useEffect, useState } from "react";
import AppBar from "./AppBar";

function App() {
    console.log( window.ipcRenderer );
    
    const [isSent, setSent] = useState( false );
    const [fromMain, setFromMain] = useState<string | null>( null );

    const sendMessageToElectron = () => {
        if ( window.Main ) {
            window.Main.sendMessage( "Hello I'm from React World" );
        } else {
            setFromMain( "You are in a Browser, so no Electron functions are available" );
        }
        setSent( true );
    };
    
    useEffect( () => { 
        if ( isSent && window.Main )
            window.Main.on( "message", ( message: string ) => {
                setFromMain( message );
            } );
    }, [fromMain, isSent] );
    
    return (
        <div className="flex flex-col h-screen rounded-md bg-slate-700">
            
            {window.Main && (
                <div className="flex-none">
                    <AppBar />
                </div>
            )}

            <div className="flex flex-col space-y-4 items-center ">
                <div className="flex space-x-3">
                    <h1 className="text-xl text-gray-50">💝 Welcome 💝, now send a message to the Main 📩📩</h1>
                    <button
                        onClick={sendMessageToElectron}
                        className=" bg-green-400 rounded px-4 py-0 focus:outline-none hover:bg-green-300"
                    >
                Send
                    </button>
                </div>
                {isSent && (
                    <div>
                        <h4 className=" text-green-500">Message sent!!</h4>
                    </div>
                )}
                {fromMain && (
                    <div>
                        {" "}
                        <h4 className=" text-yellow-200">{fromMain}</h4>
                    </div>
                )}
            </div>
        </div>
    );
}
                    
export default App;
                    