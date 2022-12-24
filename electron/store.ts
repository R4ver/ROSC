import { BrowserWindow } from "electron";

let state: Record<string, any> = {};

class AppState {
    window: BrowserWindow;

    constructor( window: BrowserWindow ) {
        this.window = window;
    }

    async Init() {
        return new Promise( ( res ) => {
            this.window.webContents
                .executeJavaScript( "({...localStorage})", true )
                .then( localStorage => {

                    const data: Record<string, any> = {};


                    Object.keys( localStorage ).forEach( e => {
                        if ( !e.match( /.+\.settings/ ) || localStorage[e] === "{}" ) return;
                        const newName = e.replace( ".settings", "" );

                        data[newName] = JSON.parse( localStorage[e] );
                    } ); 

                    state = data;
                    res( true );
                } );
        } );
    }

    static GetItem( key: string ) {
        console.log( "Getting item: ", typeof state[key] );
        return state[key];
    }
}

export default AppState;