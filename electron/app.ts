// Native
import path from "path";
// import fs from "fs-extra";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";

import ROSC from "./ROSC";

import ModuleRepository from "./module-loader";

const height = 600;
const width = 800;

let window: BrowserWindow;

function createWindow() {
    // Create the browser window.
    window = new BrowserWindow( {
        width,
        height,
        //  change to false to use AppBar
        frame: false,
        transparent: true,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: path.join( __dirname, "preload.js" )
        }
    } );

    const port = process.env.PORT || 3000;
    const url = isDev ? `http://localhost:${port}` : path.join( __dirname, "../src/out/index.html" );

    // and load the index.html of the app.
    if ( isDev ) {
        window?.loadURL( url );
    } else {
        window?.loadFile( url );
    }
    // Open the DevTools.
    // window.webContents.openDevTools();

    // For AppBar
    ipcMain.on( "minimize", () => {
    // eslint-disable-next-line no-unused-expressions
        window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
    } );
    ipcMain.on( "maximize", () => {
    // eslint-disable-next-line no-unused-expressions
        window.isMaximized() ? window.unmaximize() : window.maximize();
    } );

    ipcMain.on( "close", () => {
        window.close();
    } );
}

app.whenReady().then( async () => {
    
    const rosc = new ROSC();

    const modules = new ModuleRepository();

    rosc.on( "frontend", async () => {
        const configs = await modules.loadModuleConfigs();
        rosc.sendConfigs( configs );
    } );

    createWindow();


    app.on( "activate", () => {
        if ( BrowserWindow.getAllWindows().length === 0 ) createWindow();
    } );
} );

app.on( "window-all-closed", () => {
    if ( process.platform !== "darwin" ) app.quit();
} );

ipcMain.on( "message", ( event: IpcMainEvent, message: any ) => {
    console.log( message );
    setTimeout( () => event.sender.send( "message", "hi from electron" ), 500 );
} );