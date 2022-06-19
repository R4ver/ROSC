import moduleReducer from "./modules";

type TReducerDict = {
    [key: string]: any
}

type TActionPayload = object | string | number

type THandlerFunction = ( state: any, action: {type: string, payload: TActionPayload} ) => any;

type THandlers = {
    [key: string]: THandlerFunction
}

const rootReducer = combineReducers( {
    modules: moduleReducer,
} );

export default rootReducer;

/**
 * 
 * Helper functions
 * 
 */
export function combineReducers( reducerDict: TReducerDict ) {
    const _initialState: any = getInitialState( reducerDict );
    return function ( state = _initialState, action: TActionPayload ) {
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
    return function reducer( state = initialState, action: {type: string, payload: TActionPayload} ) {
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