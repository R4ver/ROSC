import AppLogo from "./components/icons/AppLogo";
import { NavLink } from "react-router-dom";
import { useModuleStore } from "./store";
import { FC, useEffect } from "react";

const NavBar = () => {
    const { state } = useModuleStore();

    return (
        <div className="app-nav-bar flex flex-col items-start place-content-between text-white">
            <div className="w-6 flex-shrink">
                <AppLogo />
            </div>  

            <nav className="flex flex-col items-stretch place-content-start pt-10 w-full flex-grow">
                <NavLink 
                    to="/" 
                    draggable="false"
                    className={( { isActive } ) => `px-4 py-5 text-xl rounded-xl w-full ${isActive && "bg-brand"}`}
                >Home</NavLink>
                {Object.keys( state ).map( i => (
                    <NavLink 
                        key={state[i]?.id} 
                        to={`/${state[i]?.id}`} 
                        draggable="false"
                        className={( { isActive } ) => `px-4 py-5 text-xl rounded-xl w-full ${isActive && "bg-brand"}`}
                    >
                        {state[i]?.title}
                    </NavLink>
                ) )}
            </nav> 

            <div className="flex-shrink pb-4">
                <span className="text-blackHighlight">v1.0.0</span>
            </div>
        </div>
    );
};
export default NavBar;