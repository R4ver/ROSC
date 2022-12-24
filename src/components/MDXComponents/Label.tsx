import type { FC } from "react";

interface ILabelProps {
    htmlFor: string;
    text?: string;
    children: JSX.Element;
}
const Label: FC<ILabelProps> = ( { htmlFor, text, children } ) => (
    <label 
        htmlFor={htmlFor}
        className="inline-flex p-2"
    >{text ? text : children}</label>
);
export default Label;