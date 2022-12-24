import type { FC, ChangeEvent } from "react";
import { useState } from "react";
import { useModule } from ".";

interface ICheckBoxProps {
    id: string;
    checked: boolean;
}
const CheckBox: FC<ICheckBoxProps> = ( { id, checked } ) => {
    const { module, saveSetting } = useModule();
    const [isChecked, setIsChecked] = useState( checked );
    
    const handleChange = ( e: ChangeEvent ) => {
        if ( !module ) return;
        setIsChecked( saveSetting( module.id, e )[id] );
    };

    return (
        <label className="inline-flex relative items-center cursor-pointer" htmlFor={id}>
            <input id={id} type="checkbox" onChange={e => handleChange( e )} className="sr-only peer" checked={isChecked} />
            <div 
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
    );
};

export default CheckBox;