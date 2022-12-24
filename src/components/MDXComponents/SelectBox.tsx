import type { FC, ChangeEvent } from "react";
import { useState } from "react";
import { useModule } from ".";

interface ISelectProps {
    id: string;
    name: string;
    options: string[];
    value: string;
}

const SelectBox: FC<ISelectProps> = ( { id, name, options, value } ) => {
    const { module, saveSetting } = useModule();
    const [currVal, setCurrVal] = useState( value );

    const handleChange = ( e: ChangeEvent ) => {
        if ( !module ) return;
        console.log( e );
        setCurrVal( saveSetting( module.id, e )[id] );
    };

    if ( options && options.length <= 0 ) return null;

    return (
        <select 
            id={id} 
            name={name} 
            value={currVal} 
            onChange={handleChange}
            className="text-black"
        >
            {options && options.map( ( elem, i ) => (
                <option key={elem} value={i}>{elem}</option>
            ) )}
        </select>
    );
};
export default SelectBox;