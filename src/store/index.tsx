import { useContext, createContext, useReducer, Dispatch, useEffect, useState } from "react";
import { ModuleReducer, SocketMessagesReducer, TActionPayload, TModules } from "./reducers";
import { NEW_MESSAGE } from "./actions/socketMessages";
import type { SendMessage } from "react-use-websocket";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface IModuleContext {
    state: TModules,
    dispatch: Dispatch<any>
}

type TMessage = {
    id: string,
    props: Record<string, any>,
    [key: string]: any
}

interface ISocketContext {
    sendMessage: SendMessage,
    messages: Record<string, TMessage> | null,
    readyState: ReadyState
}

const moduleContext = createContext<IModuleContext>( {
    state: {},
    dispatch: () => null
} );
const ModuleProvider = moduleContext.Provider; 

export const socketContext = createContext<ISocketContext>( {} as ISocketContext );
const SocketProvider = socketContext.Provider;

type Props = {
    children: JSX.Element
}

export const ModuleStoreProvider = ( { children }: Props ) => {
    const [state, dispatch] = useReducer( ModuleReducer, {} );

    return <ModuleProvider value={{ state, dispatch }}>
        {children}
    </ModuleProvider>;
};

const socketURL = "ws://localhost:8080";

export const SocketStoreProvider = ( { children }: Props ) => {
    const { sendMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket( socketURL );
    const [messages, dispatch] = useReducer( SocketMessagesReducer, {} );

    useEffect( () => {
        if ( readyState === 1 ) {
            const identifier = {
                type: "identifier",
                payload: {
                    id: "rosc.frontend"
                }
            };
            sendMessage( JSON.stringify( identifier ) );

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            getWebSocket()!.onmessage = message => {
                const m = FormatMessage( message.data );
                dispatch( NEW_MESSAGE( m ) );
            };
        }

    }, [readyState] );

    return <SocketProvider value={{ sendMessage, messages, readyState }}>
        {children}
    </SocketProvider>;
};

export const useModuleStore = () => useContext( moduleContext );
export const useSocketStore = () => useContext( socketContext );

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
