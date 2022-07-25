import React, { useEffect, useState } from "react";
import AppBar from "./AppBar";
import NavBar from "./NavBar";
import { MDXProvider } from "@mdx-js/react";

const socket = new WebSocket( "ws://localhost:8080" );

import ModuleUI from "../modules/com.r4ver.testmodule/module.ui.mdx";

import { useModuleStore } from "./store";
import { INIT_MODULES, UPDATE_MODULE } from "./store/actions/modules";

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

function MessageHandler( state: any, { type, payload }: {type: string, payload: any}, dispatch: any ) {
    switch ( type ) {
    case "configs":
        dispatch( INIT_MODULES( payload ) );
        break;
    case "update": {
        dispatch( UPDATE_MODULE( payload ) );
        break;
    }

    default:
        console.log( "Message not handled by type: ", { state, type, ...payload } );
        break;
    }
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
    const { state, dispatch } = useModuleStore();

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
            // MessageHandler( state, message, dispatch );

            switch ( message.type ) {
            case "configs":
                dispatch( INIT_MODULES( message.payload ) );
                break;
            case "update":
                dispatch( UPDATE_MODULE( message.payload ) );
                break;
            default:
                break;
    
            }
        } );
    }, [state] );
    
    const components = {
        em: ( props: any ) => <i {...props} />,
        Hello: ( props: any ) => <span className="text-brand">Some cool number: 10</span>
    };

    console.log( "Current State: ", state );

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
                    {state["rosc.module.testmodule"] && state["rosc.module.testmodule"].props &&
                        <>
                            <h1 className="mb-3 text-2xl">{state["rosc.module.testmodule"].title}<input type="checkbox" className="ml-2"/></h1>
                            <p className="m-0 mb-5">{state["rosc.module.testmodule"].description}</p>
                            <MDXProvider components={components}>
                                <ModuleUI {...state["rosc.module.testmodule"].props}/>
                            </MDXProvider>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
                    
export default App;
                    