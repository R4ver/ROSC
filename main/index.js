"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
const ws_1 = require("ws");
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
// Handlers
const message_handler_1 = __importDefault(require("./message-handler"));
const module_spawner_1 = __importDefault(require("./module-spawner"));
const height = 600;
const width = 800;
let window;
function createWindow() {
    // Create the browser window.
    window = new electron_1.BrowserWindow({
        width,
        height,
        //  change to false to use AppBar
        frame: false,
        transparent: true,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, "preload.js")
        }
    });
    const port = process.env.PORT || 3000;
    const url = electron_is_dev_1.default ? `http://localhost:${port}` : (0, path_1.join)(__dirname, "../src/out/index.html");
    // and load the index.html of the app.
    if (electron_is_dev_1.default) {
        window?.loadURL(url);
    }
    else {
        window?.loadFile(url);
    }
    // Open the DevTools.
    // window.webContents.openDevTools();
    // For AppBar
    electron_1.ipcMain.on("minimize", () => {
        // eslint-disable-next-line no-unused-expressions
        window.isMinimized() ? window.restore() : window.minimize();
        // or alternatively: win.isVisible() ? win.hide() : win.show()
    });
    electron_1.ipcMain.on("maximize", () => {
        // eslint-disable-next-line no-unused-expressions
        window.isMaximized() ? window.restore() : window.maximize();
    });
    electron_1.ipcMain.on("close", () => {
        window.close();
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.on("message", (event, message) => {
    console.log(message);
    setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});
/**
 * Setup WebSocket server
 */
const wss = new ws_1.WebSocketServer({ port: 8080 });
let state = {
    frontend: null,
    modules: {},
    isListening: false
};
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const message = FormatMessage(data);
        console.log(message);
        (0, message_handler_1.default)(state, message, ws, (newState) => {
            state = {
                ...newState
            };
        });
    });
});
wss.on("listening", () => {
    console.log("Server is listening!");
    state = {
        ...state,
        isListening: true
    };
    spawnActiveModules();
});
const spawnActiveModules = () => {
    (0, module_spawner_1.default)("thumbparameters", true);
    // SpawnModule( null, false, "../testclient.js" );
};
function isJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
function FormatMessage(message) {
    message = message.toString();
    if (isJsonString(message)) {
        return JSON.parse(message);
    }
    return message;
}
