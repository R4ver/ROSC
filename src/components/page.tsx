import { FC, useEffect } from "react";
import type { TModule } from "../store/reducers";
import { useState } from "react";
import { useSocketStore } from "../store";
import { MDXProvider } from "@mdx-js/react";
import Checkbox from "./checkbox";
import MDXComponents, { ModuleContext } from "./MDXComponents";
import useFetchUI from "../hooks/useFetchUI";

const Page: FC<{ module: TModule }> = ( { module } ) => {
    const { messages, readyState, sendMessage } = useSocketStore();
    const UI = useFetchUI( module );
    const [isActive, setIsActive] = useState(
        JSON.parse( localStorage.getItem( "active-modules" ) || "{}" )[module.id] ||
            false
    );

    useEffect( () => {
        setIsActive( JSON.parse( localStorage.getItem( "active-modules" ) || "{}" )[module.id] ||
            false );
    }, [module] );

    const toggleModule = () => {
        const M = JSON.stringify( module ); // Pain and despair: "An object could not be cloned"
        const _ = localStorage.getItem( "active-modules" ) || "{}";
        const activeModules = JSON.parse( _ );

        activeModules[module.id] = !activeModules[module.id];

        setIsActive( activeModules[module.id] );
        localStorage.setItem( "active-modules", JSON.stringify( activeModules ) );

        if ( activeModules[module.id] ) {
            window.Main.spawnModule( JSON.parse( M ) );
        } else {
            window.Main.killModule( module.id );
        }
    };

    const initializeModuleSettings = () => {
        const settings = {
            ...module.props.settings,
            ...JSON.parse(
                localStorage.getItem( `${module.id}.settings` ) || "{}"
            ),
        };
        localStorage.setItem( `${module.id}.settings`, JSON.stringify( settings ) );

        return settings;
    };

    const Module: FC = () => {
        if ( UI === null ) return null;
        const Component: FC | null = UI;

        const props = ( messages && messages[module.id]?.props ) || module.props;
        props.settings = initializeModuleSettings();

        return (
            <ModuleContext module={module} sendMessage={sendMessage}>
                <Component {...props} />
            </ModuleContext>
        );
    };

    if ( readyState !== 1 ) return null;

    const Test = () => <h1>Hello world</h1>;

    return (
        <div className="w-full ml-5 prose max-w-full prose-headings:text-white text-white p-5">
            <h1 className="mb-3 text-2xl">
                {module.title}
                <Checkbox
                    id={module.id}
                    onChange={toggleModule}
                    checked={isActive}
                />
            </h1>
            <p className="m-0 mb-5">{module.description}</p>
            <MDXProvider components={MDXComponents}>
                <Module />
            </MDXProvider>
        </div>
    );
};

export default Page;
