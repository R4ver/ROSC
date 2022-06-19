import { createReducer } from "./index";

const initModules = ( state: any, { payload }: {payload: any} ) => {
    console.log( state, payload );
    return state;
};

const moduleReducer = createReducer( {}, {
    INIT_MODULES: initModules
} );

export default moduleReducer;