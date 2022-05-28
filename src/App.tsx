import React, { useEffect, useState } from "react";
import AppBar from "./AppBar";
import NavBar from "./NavBar";

const socket = new WebSocket( "ws://localhost:8080" );

type TState = {
    modules: {
        [key: string]: object
    }
}


let state: TState = {
    modules: {
        
    }
};

function MessageHandler( state: TState, { type, payload }: {type: string, payload: any}, callback: ( state: TState, updatedID: string ) => void ) {
    let updatedID;
    switch ( type ) {
    case "update":
        state = {
            ...state,
            modules: {
                ...state.modules,
                [payload.id]: {
                    ...payload
                }
            }
        };
        updatedID = payload.id;
        break;

    default:
        console.log( "Message not handled by type: ", { state, type, ...payload } );
        break;
    }

    callback( state, updatedID );
}

function isJsonString( str: string ) {
    try {
        JSON.parse( str );
    } catch ( e ) {
        return false;
    }
    return true;
}

function FormatMessage( message: string ) {
    message = message.toString();
    if ( isJsonString( message ) ) {
        return JSON.parse( message );
    }

    return message;
}

function App() {
    const [isSent, setSent] = useState( false );
    const [fromMain, setFromMain] = useState<string | null>( null );
    const [fromThumbs, setFromThumbs] = useState<string | object | null>( null );

    const sendMessageToElectron = () => {
        if ( window.Main ) {
            window.Main.sendMessage( "Hello I'm from React World" );
        } else {
            setFromMain( "You are in a Browser, so no Electron functions are available" );
        }
        setSent( true );
    };
    
    useEffect( () => { 
        if ( isSent && window.Main ) {
            window.Main.on( "message", ( message: string ) => {
                setFromMain( message );
            } );
        }
    }, [fromMain, isSent] );

    useEffect( () => {
        // Connection opened
        socket.addEventListener( "open", function () {
            const identifier = {
                type: "identifier",
                payload: {
                    id: "rosc.frontend"
                }
            };
            console.log( "Connection Open" );
            socket.send( JSON.stringify( identifier ) );
        } );

        // Listen for messages
        socket.addEventListener( "message", function ( event ) {
            const message = FormatMessage( event.data );
            MessageHandler( state, message, ( newState, updatedID ) => {
                state = {
                    ...newState
                };

                console.log( state );
            } );
    
        } );
    }, [] );
    
    return (
        <div className="flex flex-col h-screen rounded-md bg-white">
            
            {window.Main && (
                <div className="flex-none">
                    <AppBar />
                </div>
            )}

            
            <div className="flex h-screen">
                <NavBar />
               
            </div>
        </div>
    );
}
                    
export default App;
                    