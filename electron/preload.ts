import { ipcRenderer, contextBridge } from "electron";

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
    /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sayHello`
   */
    sendMessage: ( message: string ) => {
        ipcRenderer.send( "message", message );
    },
    /**
    Here function for AppBar
   */
    Minimize: () => {
        ipcRenderer.send( "minimize" );
    },
    Maximize: () => {
        ipcRenderer.send( "maximize" );
    },
    Close: () => {
        ipcRenderer.send( "close" );
    },
    /**
   * Provide an easier way to listen to events
   */
    on: ( channel: string, callback: ( data: any ) => void ) => {
        ipcRenderer.on( channel, ( _, data ) => callback( data ) );
    },
    once: ( channel: string, callback: ( data: any ) => void ) => {
        ipcRenderer.once( channel, ( _, data ) => callback( data ) );
    },
    removeListener: ( channel: string, callback: any ) => {
        ipcRenderer.removeListener( channel, callback );
    },
    getModuleConfigs: () => {
        ipcRenderer.send( "module-configs" );
    },
    getModuleUI: ( id: string ) => {
        ipcRenderer.send( "get-module-ui", id );
    },
    spawnModule: ( data: Record<string, any>[] | Record<string, any> ) => ipcRenderer.send( "spawn-module", data ),
    killModule: ( id: string ) => ipcRenderer.send( "kill-module", id )
};
contextBridge.exposeInMainWorld( "Main", api );