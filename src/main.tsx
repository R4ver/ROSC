import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { ModuleStoreProvider } from "./store";
import App from "./App";

const container = document.getElementById( "root" );
const root = ReactDOM.createRoot( container as HTMLElement );

root.render(
    <React.StrictMode>
        <ModuleStoreProvider>
            <App />
        </ModuleStoreProvider>
    </React.StrictMode>
);


