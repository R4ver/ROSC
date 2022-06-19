import { WebSocketServer } from "ws";
// Handlers
import MessageHandler from "./message-handler";
// import SpawnModule from "./module-spawner";
import { WebSocketClient } from "vite";
import { EventEmitter } from "events";

/**
 * Setup WebSocket server
 */

type TState = {
    frontend: null | WebSocketClient,
    modules: object,
}

type TEvents = "frontend" | "newModule" | "spawnModule" | "killModule";

declare interface SocketServer {
    on( event: TEvents, listener: ( name: string ) => void ): this;
    on( event: string, listener: ( data?: object ) => void ): this;
    emit( event: TEvents, ...args: any[] ): boolean
}

class SocketServer extends EventEmitter {
    wss: WebSocketServer;
    WSConnection: TState;
    port?: number;

    constructor( port = 8080 ) {
        super();

        console.log( port );
        this.port = port;
        this.wss = new WebSocketServer( { port: this.port } );
        this.WSConnection = {
            frontend: null,
            modules: {}
        };
        
        this.#init();
    }

    #init() {
        this.wss.on( "connection", ( ws ) => {
            ws.on( "message", ( data: string ) => {
                const message = this.#FormatMessage( data );
                MessageHandler( this.WSConnection, message, ws, ( newState: TState, { event, data }: {event: TEvents, data: any} ) => {
                    this.WSConnection = {
                        ...newState
                    };

                    if ( event !== null ) {
                        this.emit( event, data );
                    }
                } );
            } );
        } );

        this.wss.on( "listening", () => {
            console.log( "Server is listening!" );

            // spawnActiveModules();
        } );
    }

    sendConfigs( configs: any ) {
        this.WSConnection.frontend?.send( this.#SendConfigs( configs ) );
    }

    #isJsonString( str: string ) {
        try {
            JSON.parse( str );
        } catch ( e ) {
            return false;
        }
        return true;
    }

    #FormatMessage( message: string ) {
        message = message.toString();
        if ( this.#isJsonString( message ) ) {
            return JSON.parse( message );
        }

        return message;
    }

    #SendConfigs( configs: any ) {
        return JSON.stringify( {
            type: "configs",
            payload: configs
        } );
    }
}

export default SocketServer;