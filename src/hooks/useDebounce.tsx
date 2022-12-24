import { useEffect, useState } from "react";

const useDebounce = ( value: string, delay = 500 ) => {
    const [debounceVal, setDebounceVal] = useState( value );
    
    useEffect( () => {
        const timeoutId = setTimeout( () => {
            setDebounceVal( value );
        }, delay );

        return () => clearTimeout( timeoutId );
    }, [value] );

    return debounceVal;
};

export default useDebounce;