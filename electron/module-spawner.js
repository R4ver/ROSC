import { resolve } from "path";
import { spawn } from "child_process";

export default function SpawnModule( module, isExecuteable = false, customPath = null ) {
    let child;

    console.log( { module, isExecuteable, customPath } );

    switch ( isExecuteable ) {
    case true:
        child = spawn( resolve( __dirname, `../modules/release/${module}.exe` ) );
        break;

    default:
        console.log( resolve( __dirname, `${customPath ? customPath : `../modules/release/${module}.js`}` ) );
        child = spawn( "node", ["-r", "esm", `${resolve( __dirname, `${customPath ? customPath : `../modules/release/${module}.js`}` )}`] );
        break;
    }

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

    return child;
}