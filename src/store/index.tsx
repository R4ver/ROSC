import { useState, useContext, createContext, FC } from "react";

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

type TModules = {
    [key: string]: TModule
}

const moduleContext = createContext<TModules>( { } );
const ModuleProvider = moduleContext.Provider; 
const appContext = createContext( {} );

type Props = {
    children: JSX.Element
}

export const StoreProvider = ( { children }: Props ) => {
    // const [state, dispatch] = 

    return children;

    // return <ModuleProvider>
    //     {children}
    // </ModuleProvider>;
};

export const useModuleStore = () => useContext( moduleContext );