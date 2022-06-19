import React, { useEffect, useState } from "react";
import AppBar from "./AppBar";
import NavBar from "./NavBar";
import { MDXProvider } from "@mdx-js/react";

const socket = new WebSocket( "ws://localhost:8080" );

import ModuleUI from "../modules/com.r4ver.testmodule/module.ui.mdx";

type TModule = {
    id: string,
    version: string,
    name: string,
    title: string,
    description: string,
    icons: string,
    props: {
        [key: string]: any
    }
}

type TState = {
    modules: {
        [key: string]: TModule
    }
}


// const state: TState = {
//     modules: {
        
//     }
// };

function MessageHandler( state: TState, { type, payload }: {type: string, payload: any}, callback: ( state: TState, updatedID: string ) => void ) {
    let updatedID;
    switch ( type ) {
    case "configs":
        state = {
            ...state,
            modules: {
                ...state.modules,
                ...payload
            }
        };
        break;
    case "update": {
        state = {
            ...state,
            modules: {
                ...state.modules,
                [payload.id]: { 
                    ...state.modules[payload.id],
                    props: {
                        ...state.modules[payload.id]?.props,
                        ...payload.props
                    }
                }
            }
        };

        console.log( state );
        updatedID = payload.id;
        break;
    }

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
    const [state, setState] = useState<TState>( {
        modules: {
            
        }
    } );

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
                setState( prev => {
                    return {
                        ...prev,
                        ...newState
                    };
                } );
            } );
    
        } );
    }, [state] );
    
    const components = {
        em: ( props: any ) => <i {...props} />,
        Hello: ( props: any ) => <span className="text-brand">Some cool number: 10</span>
    };

    console.log( state );

    return (
        <div className="flex flex-col h-screen rounded-md bg-white">
            
            {window.Main && (
                <div className="flex-none">
                    <AppBar />
                </div>
            )}

            
            <div className="flex h-screen">
                <NavBar />
                <div className="ml-5 prose p-5">
                    {state.modules["rosc.module.testmodule"] && state.modules["rosc.module.testmodule"].props &&
                        <>
                            <h1 className="mb-3 text-2xl">{state.modules["rosc.module.testmodule"].title}<input type="checkbox" className="ml-2"/></h1>
                            <p className="m-0 mb-5">{state.modules["rosc.module.testmodule"].description}</p>
                            <MDXProvider components={components}>
                                <ModuleUI {...state.modules["rosc.module.testmodule"].props}/>
                            </MDXProvider>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
                    
export default App;
                    