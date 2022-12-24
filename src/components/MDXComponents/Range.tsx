import type { FC } from "react";

interface IRangeProps {
    value: number;
}

const Range: FC<IRangeProps> = ( { value } ) => (
    <input type="range" min="0" max="100" defaultValue={value * 100} />
);
export default Range;