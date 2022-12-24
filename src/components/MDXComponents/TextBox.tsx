import type { FC, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { useModule } from ".";
import useDebounce from "../../hooks/useDebounce";

interface ITextBoxProps {
    id: string;
    value: string;
}
const TextBox: FC<ITextBoxProps> = ( { value, id } ) => {
    const { module, saveSetting } = useModule();
    const [state, setVal] = useState<{value: string, event: ChangeEvent<Element> | null}>( {
        value: value,
        event: null
    } );
    const debouncedValue = useDebounce( state.value );

    useEffect( () => {
        if ( !state.event || !module ) return;
        saveSetting( module.id, state.event );
    }, [debouncedValue] );

    const handleChange = ( e: any ) =>
        setVal( () => ( {
            value: e.target.value,
            event: e
        } ) );

    return (
        <input 
            id={id} 
            type="text" 
            value={state.value} 
            onChange={handleChange} 
            className="text-black"
        />
    );
};
export default TextBox;