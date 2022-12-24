import moduleReducer from "./modules";
import socketMessagesReducer from "./socketMessages";

type TProps = {
    [key: string]: any
}

export type TModule = {
    id: string,
    version: string,
    name: string,
    title: string,
    description: string,
    icons: string,
    props: TProps,
    modulePath: string,
}

export type TModules = {
    [key: string]: TModule
}

type TReducerDict = {
    [key: string]: any
} | any

export type TActionPayload = object | string | number | boolean

export type TAction = {
    type: string,
    payload: TModule
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      }
};

type THandlerFunction = ( state: any, action: TAction ) => any;

type THandlers = {
    [key: string]: THandlerFunction
}

export const ModuleReducer = combineReducers( moduleReducer );
export const SocketMessagesReducer = combineReducers( socketMessagesReducer );

/**
 * 
 * Helper functions
 * 
 */
export function combineReducers( reducerDict: TReducerDict ) {
    const _initialState: any = getInitialState( reducerDict );
    return function ( state = _initialState, action: TAction ) {
        if ( typeof reducerDict === "function" ) {
            return reducerDict( state, action );
        }

        return Object.keys( reducerDict ).reduce( ( acc, curr: string ) => {
            const slice = reducerDict[curr]( state[curr], action );
            return {
                ...acc,
                [curr]: slice
            };
        }, state );
    };
}

export function createReducer( initialState: object, handlers: THandlers ) {
    return function reducer( state = initialState, action: TAction ) {
        const handlerType = action.type in handlers ? handlers[action.type] : undefined;
        return handlerType !== undefined ? handlerType( state, action ) : state;
    };
}

function getInitialState( reducerDict: TReducerDict ) {
    return Object.keys( reducerDict ).reduce( ( acc, curr ) => {
        const slice = reducerDict[curr]( undefined, {
            type: undefined
        } );
        return {
            ...acc,
            [curr]: slice
        };
    }, {} );
}