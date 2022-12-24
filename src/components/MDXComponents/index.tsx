import type { SendMessage } from "react-use-websocket";
import type { FC } from "react";
import { useContext, createContext } from "react";
import { TModule } from "../../store/reducers";

import Button from "./Button";
import Box from "./Box";
import CheckBox from "./CheckBox";
import Header from "./Header";
import Label from "./Label";
import Range from "./Range";
import SelectBox from "./SelectBox";
import TextBox from "./TextBox";
import { Title, SubTitle } from "./Title";
import { TextColor } from "./Utils";


interface IModuleContext {
    module: TModule;
    sendMessage: SendMessage;
    children: JSX.Element;
}

interface IContext {
    module: TModule;
    saveSetting: ( moduleId: string, event: any ) => Record<string, any>
}

const moduleContext = createContext<IContext | Record<string, any>>( {} );
const ModuleContextProvider = moduleContext.Provider;

export const ModuleContext: FC<IModuleContext> = ( { module, sendMessage, children } ) => {
    const saveSetting = ( moduleId: string, event: any ) => {
        if ( !event ) return;

        const currentSettings = { ...JSON.parse( localStorage.getItem( `${moduleId}.settings` ) || "{}" ) };

        const settingId = event.target.id;
        const settingValue = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        const newSettings = { 
            ...currentSettings,
            [settingId]: !Number.isNaN( settingValue ) ? Number( settingValue ) : settingValue 
        };

        console.log( newSettings, localStorage.getItem( `${moduleId}.settings` ) );

        localStorage.setItem( `${moduleId}.settings`, JSON.stringify( newSettings ) );

        sendMessage( JSON.stringify( {
            type: "setting_saved",
            payload: {
                id: module.id,
                setting: {
                    id: settingId, 
                    value: newSettings[settingId]
                }
            }
        } ) );

        return newSettings;
    };
    
    return (
        <ModuleContextProvider value={{ module, saveSetting }}>
            {children}
        </ModuleContextProvider>
    );
}; 

export const useModule = () => useContext( moduleContext );

export default {
    Button,
    Box,
    CheckBox,
    Header,
    Label,
    Range,
    SelectBox,
    TextBox,
    Title,
    SubTitle,
    TextColor
};