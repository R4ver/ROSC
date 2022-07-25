import { useContext, createContext, useReducer, Dispatch } from "react";
import { ModuleReducer, TActionPayload, TModules } from "./reducers";

const moduleContext = createContext<{
    state: TModules,
    dispatch: Dispatch<any>
}>( {
    state: {},
    dispatch: () => null
} );
const ModuleProvider = moduleContext.Provider; 
const appContext = createContext( {} );

type Props = {
    children: JSX.Element
}

export const ModuleStoreProvider = ( { children }: Props ) => {
    const [state, dispatch] = useReducer( ModuleReducer, {} );

    return <ModuleProvider value={{ state, dispatch }}>
        {children}
    </ModuleProvider>;
};

export const useModuleStore = () => useContext( moduleContext );