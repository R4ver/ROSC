import type { FC } from "react";

interface IButtonProps {
    text?: string;
    children: JSX.Element;
}
const Button: FC<IButtonProps> = ( { text, children } ) => 
    <button>{text ? text : children}</button>;
export default Button;