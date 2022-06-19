import AppLogo from "./components/icons/AppLogo";

const NavBar = () => (
    <div className="flex flex-col items-center place-content-between w-[90px]">
        <div className="w-6 flex-shrink">
            <AppLogo />
        </div>  

        <nav className="flex flex-col items-center place-content-center flex-grow">
            {[1,2,3,4].map( i => (
                <a key={i} href="#">
                    [B]
                </a>
            ) )}
        </nav> 

        <div className="flex-shrink pb-4">
            <span className="text-blackHighlight">v1.0.0</span>
        </div>
    </div>
);
export default NavBar;