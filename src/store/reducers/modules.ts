import { createReducer } from "./index";

const initModules = ( state: any, { payload }: {payload: any} ) => ( {
    ...state,
    ...payload
} );

const updateModule = ( state: any, { payload }: {payload: any} ) => ( {
    ...state,
    [payload.id]: {
        ...state[payload.id],
        props: { ...payload.props }
    }
} );

const moduleReducer = createReducer( {}, {
    INIT_MODULES: initModules,
    UPDATE_MODULE: updateModule
} );

export default moduleReducer;