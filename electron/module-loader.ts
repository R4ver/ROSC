import { app } from "electron";
import { join } from "path";
import {  readdirSync, stat, readFileSync, existsSync } from "fs-extra";

class ModuleRepository {

    loadedModules: [];

    constructor() {
        this.loadedModules = [];
    }


    get modulePaths() {
        const appPath = app.getAppPath();
        const userDataPath = app.getPath( "userData" );

        const paths = [
            join( userDataPath, "./modules" ),
        ];

        if ( process.env.NODE_ENV === "development" ) {
            paths.push( join( appPath, "./modules" ) );
        }

        return paths;
    }

    async loadModuleConfigs() {
        let configs: any = {};
        const paths = this.modulePaths.filter( e => existsSync( e ) !== false );

        console.log( paths );

        for ( const path of paths ) {
            console.log( path );
            const plugins = readdirSync( path );

            for ( const plugin of plugins ) {
                const config = await this.getModuleConfig( plugin, path );
                configs = {
                    ...configs,
                    [config.id]: config
                };
            }
        }

        console.log( configs );

        return configs;
    }

    async getModuleConfig( plugin: any, path: any ) {
        const modulePath = join( path, plugin );
        const modulePathPackageJson = join( modulePath, "package.json" );

        const modulePathExists = await stat( modulePath );
        const moduleConfigExists = await stat( modulePathPackageJson );

        if ( !modulePathExists ) {
            console.warn( `Module directory ${modulePath} does not exist` );
            return;
        }

        if ( !moduleConfigExists ) {
            console.warn( `Module package json ${modulePathPackageJson} does not exist` );
            return;
        }

        let moduleConfig = JSON.parse( readFileSync( modulePathPackageJson ).toString() );
        moduleConfig = {
            modulePath,
            ...moduleConfig
        };
    
        return moduleConfig;
    }
}

export default ModuleRepository;