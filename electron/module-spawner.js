import { resolve } from "path";
import { stat } from "fs/promises";
import { spawn } from "child_process";
import isDev from "electron-is-dev";

const supportedExtensions = [
    "exe",
    "node"
];

const canSpawn = ( moduleType ) => {
    if ( !moduleType || !supportedExtensions.find( e => e !== moduleType ) ) {
        console.log( "Module type not supported: ", moduleType );
        return false;
    }

    return true;
};

export default async function SpawnModule( { modulePath, moduleType } ) {

    if ( !canSpawn( moduleType ) ) return;

    let child;

    console.log( { moduleType, modulePath } );

    switch ( moduleType ) {
        case "exe":
            child = spawn( resolve( __dirname, `${modulePath}/module.exe` ) );
            break;

        case "node":
            child = spawn(
                "node",
                [`${resolve( __dirname, `${modulePath}/module.js` )}`]
            );
            break;

        default:
            break;
    }

    if ( child && child.stdout ) {
        child.stdout.setEncoding( "utf8" );
        child.stdout.on( "data", function ( data ) {
            //Here is where the output goes

            console.log( "stdout: " + data );

            data = data.toString();
        } );

        child.stderr.setEncoding( "utf8" );
        child.stderr.on( "data", function ( data ) {
            //Here is where the error output goes

            console.log( "stderr: " + data );

            data = data.toString();
        } );

        child.on( "close", function ( code ) {
            //Here you can get the exit code of the script

            console.log( "closing code: " + code );
        } );
    }

    return child;
}

//dotnet publish -r win-x64 /p:PublishSingleFile=true /p:IncludeNativeLibrariesForSelfExtract=true --output \"../release/${1}\";