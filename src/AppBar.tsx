import React, { useState } from "react";

import Icon from "./assets/icons/Icon-Electron.png";

function AppBar() {
    const [isMaximize, setMaximize] = useState( false );

    const handleToggle = () => {
        if ( isMaximize ) {
            setMaximize( false );
        } else {
            setMaximize( true );
        }
        window.Main.Maximize();
    };

    return (
        <>
            <div className="py-0.5 flex justify-end draggable bg-white text-textColor rounded-t-md">
                <div className="inline-flex -mt-1">
                    <button onClick={window.Main.Minimize} className="undraggable md:px-4 lg:px-3 pt-1 hover:bg-gray-300">
                        &#8211;
                    </button>
                    <button onClick={handleToggle} className="undraggable px-6 lg:px-5 pt-1 hover:bg-gray-300">
                        {isMaximize ? "\u2752" : "⃞"}
                    </button>
                    <button onClick={window.Main.Close} className="undraggable rounded-tr-md px-4 pt-1 hover:bg-red hover:text-white">
                        &#10005;
                    </button>
                </div>
            </div>
        </>
    );
}

export default AppBar;