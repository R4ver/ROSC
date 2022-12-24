import type { FC } from "react";

interface IBoxProps {
    children: JSX.Element;
}

const Box: FC<IBoxProps> = ( { children } ) => (
    <div className="rounded-xl shadow-md bg-blackDarker p-5 w-full">
        {children}
    </div>
);
export default Box;