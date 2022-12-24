import type { FC } from "react";
import { useState, useEffect } from "react";
import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";

type TuseFetchUIProps = {
    id: string,
    modulePath: string
}

const useFetchUI = ( { id, modulePath }: TuseFetchUIProps ) => {
    const [UI, setUI] = useState<FC | null>( null );

    
    useEffect( () => {
        window.Main.getModuleUI( id );
        
        const handleData = async ( ui: string ) => {
            const { default: Content } =  await evaluate( ui , { ...provider, ...runtime, } as any );

            setUI( () => Content );
        };
        window.Main.once( "module-ui", handleData );

        return () => {
            window.Main.removeListener( "module-ui", handleData );
        };
    }, [modulePath] );

    return UI;
};

export default useFetchUI;
