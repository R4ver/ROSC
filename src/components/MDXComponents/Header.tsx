import type { FC } from "react";

interface IHeaderProps {
    children: JSX.Element;
}

const Header: FC<IHeaderProps> = ( { children } ) => (
    <header className="flex flex-col justify-center content-center">
        {children}
    </header>
);
export default Header;