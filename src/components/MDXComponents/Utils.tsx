import type { FC } from "react";

interface ITextColorProps {
    color: string;
    children: JSX.Element;
}

export const TextColor: FC<ITextColorProps> = ( { color, children } ) => {
    const VarName = "--module-text-color";
    const style = { [VarName]: `${color}`, "color": `var(${VarName})` } as React.CSSProperties;
    return <span style={style}>{children}</span>;
};