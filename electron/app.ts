// Native
import path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, protocol } from "electron";
import isDev from "electron-is-dev";
import { readFile } from "fs-extra";

import AppState from "./store";
import ROSC from "./ROSC";
import ModuleRepository from "./module-loader";
import SpawnModule from "./module-spawner";

const height = 600;
const width = 1000;

let window: BrowserWindow;
let Store: AppState;

function createWindow() {
    // Create the browser window.
    window = new BrowserWindow( {
        width,
        height,
        //  change to false to use AppBar
        frame: false,
        hasShadow: true,
        transparent: false,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: path.join( __dirname, "preload.js" )
        }
    } );
    Store = new AppState( window );

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

    protocol.registerFileProtocol( "ui", ( _, callback ) => {
        callback( { path: app.getPath( "userData" ) + "./modules/thirdparty.testmodule/module.ui.mdx" } );
    } );

    new ROSC();

    createWindow();

    await Store.Init();

    if ( isDev ) {
        installExtension( REACT_DEVELOPER_TOOLS )
            .then( ( name: string ) => console.log( `Added Extension:  ${name}` ) )
            .catch( ( err: string ) => console.log( "An error occurred: ", err ) );
    }

    app.on( "activate", () => {
        if ( BrowserWindow.getAllWindows().length === 0 ) createWindow();
    } );
} );

app.on( "window-all-closed", () => {
    if ( process.platform !== "darwin" ) app.quit();
} );

ipcMain.on( "module-configs", async ( event: IpcMainEvent ) => {
    const modules = new ModuleRepository();
    const configs = await modules.loadModuleConfigs();
    event.sender.send( "module-configs", configs );
} );

ipcMain.on( "get-module-ui", async( event: IpcMainEvent, id: string ) => {
    const envPath = isDev ? app.getAppPath() : app.getPath( "userData" );
    const filePath = path.join( envPath, `/modules/${id}/module.ui.mdx` );
    const content = await readFile( filePath, "utf8" );
    
    event.sender.send( "module-ui", content );
} );

ipcMain.on( "message", async ( event: IpcMainEvent, message: any ) => {
    console.log( "Message received from UI: ", message );
    event.sender.send( "message", "hello!" );
} );

const spawnedModules: Record<string, any>[] = [];

ipcMain.on( "spawn-module", async ( _: IpcMainEvent, module: Record<string, any>[] | Record<string, any> ) => {
    
    if ( Array.isArray( module ) ) {
        module.forEach( async e => {
            if ( spawnedModules.find( m => m.id === e.id ) ) return;

            const { modulePath, moduleType, id } = e;

            spawnedModules.push( {
                id,
                process: await SpawnModule( { modulePath, moduleType } )
            } );
        } );
        return;
    }

    const { modulePath, moduleType, id } = module;

    spawnedModules.push( {
        id,
        process: await SpawnModule( { modulePath, moduleType } )
    } );
} );

ipcMain.on( "kill-module", ( _: IpcMainEvent, id: string ) => {
    const index = spawnedModules.findIndex( m => m.id === id );
    if ( index === -1 ) return;
    
    spawnedModules[index]?.process.kill();
    spawnedModules.splice( index, 1 );
} );