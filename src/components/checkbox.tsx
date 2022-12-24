import { FC } from "react";

type TProps = {
    onChange: () => void, 
    id: string,
    checked: boolean
}

const CheckBox: FC<TProps> = ( { onChange, id, checked } ) => (
    <label className="inline-flex relative items-center cursor-pointer" htmlFor={id}>
        <input id={id} type="checkbox" value="" onChange={onChange} className="sr-only peer" checked={checked} />
        <div 
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
);

export default CheckBox;