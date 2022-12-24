import { app } from "electron";
import { join } from "path";
import {  readdir, stat, readFile } from "fs-extra";
// const supportedExtensions = [
//     "exe",
//     "js"
// ];

class ModuleRepository {

    loadedModules: [];

    constructor() {
        this.loadedModules = [];
    }


    get modulePaths() {
        const appPath = app.getAppPath();
        const userDataPath = app.getPath( "userData" );

        const paths = [];

        if ( process.env.NODE_ENV === "development" ) {
            paths.push( join( appPath, "./modules" ) );
        } else {
            paths.push( join( userDataPath, "./modules" ), );
        }

        return paths;
    }

    async loadModuleConfigs() {
        let configs: any = {};
        const paths = this.modulePaths.filter( async e => {
            try {
                const exists = await stat( e );

                if ( exists ) 
                    return true;
                
            } catch ( error ) {
                return false;
            }
        } );

        for ( const path of paths ) {
            try {
                const plugins = await readdir( path );

                if ( !plugins ) continue;
    
                for ( const plugin of plugins ) {
                    const config = await this.getModuleConfig( plugin, path );
    
                    configs = {
                        ...configs,
                        [config.id]: config
                    };
                }
            } catch ( error ) {
                //
            }

            
        }

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

        let moduleConfig = JSON.parse( await ( await readFile( modulePathPackageJson ) ).toString() );
        const match = modulePath.match( /([^/|\\\\]+$)/ );
        
        if ( !match ) {
            throw new Error( "Couldn't get folder name" );
        }

        const id = match[1];

        moduleConfig = {
            ...moduleConfig,
            modulePath,
            id
        };
    
        return moduleConfig;
    }
}

export default ModuleRepository;