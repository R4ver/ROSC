import type { TModule } from "./store/reducers";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import AppBar from "./AppBar";
import NavBar from "./NavBar";
import Page from "./components/page";
import { SocketStoreProvider } from "./store";

import { useModuleStore } from "./store";
import { INIT_MODULES } from "./store/actions/modules";

function App() {
    const { state, dispatch } = useModuleStore();

    useEffect( () => {
        let ignore = false;
        window.Main.getModuleConfigs();

        const dispatchData = ( data: Record<string, any> ) => {
            if ( ignore ) return;
            dispatch( INIT_MODULES( data ) );

            SpawnActiveModules( data );
        };
        window.Main.once( "module-configs", dispatchData ); 

        return () => {
            ignore = true;
            window.Main.removeListener( "module-configs", dispatchData );
        };
    }, [] );

    const Home = () => <h1>Hello world</h1>;

    return (
        <div className="app-grid h-screen bg-black select-none">
            
            {window.Main && (
                <AppBar />
            )}

            <>
                <NavBar />
                <div className="app-content">
                    <SocketStoreProvider>
                        <Routes>
                            <Route path="*" element={<Navigate to="/" replace={true} />} />
                            <Route path="/" index element={<Home />} />
                            {Object.keys( state ).map( ( item: string ) => {
                                const module = state[item] as TModule;
                                return <Route key={module.id} path={module.id} element={<Page module={module} />} />;
                            } ) }
                        </Routes>
                    </SocketStoreProvider>
                </div>
            </>
        </div>
    );
}
                    
export default App;

const SpawnActiveModules = ( data: Record<string, any> ) => {
    const activeModules = JSON.parse( localStorage.getItem( "active-modules" ) || "{}" );
    const filtered = Object.values( data ).map( ( config: any ) => {
        const isActive = !!Object.keys( activeModules ).find( e => config.id === e && activeModules[e] );
                
        return isActive ? config : null;
    } ).filter( e => e );

    window.Main.spawnModule( filtered );
};