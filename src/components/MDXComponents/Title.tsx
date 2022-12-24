import type { FC } from "react";

interface ITitleProps {
    text?: string;
    position: "left" | "center" | "right";
    children: JSX.Element;
}

export const Title: FC<ITitleProps> = ( { text, position = "center", children } ) => {
    const name = `--module-title-position-${Date.now()}`;
    const style = {
        [name]: `${ position }`,
        textAlign: `var(${ name }`
    } as unknown as React.CSSProperties;
    return <h1 
        className={"text-2xl text-white font-normal"}
        style={style}
    >{text ? text : children}</h1>;
};

export const SubTitle: FC<ITitleProps> = ( { text, position = "center", children } ) => (
    <h2 className={`text-xl text-white text-${position} font-normal`}>{text ? text : children}</h2>
);