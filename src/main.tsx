import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { ModuleStoreProvider } from "./store";
import App from "./App";

const container = document.getElementById( "root" );
const root = ReactDOM.createRoot( container as HTMLElement );

root.render(
    <React.StrictMode>
        <ModuleStoreProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </ModuleStoreProvider>
    </React.StrictMode>
);


