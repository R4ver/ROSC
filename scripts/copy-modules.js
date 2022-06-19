import { readdir, ensureDirSync, copySync } from "fs-extra";
import path from "path";

const srcDir = path.resolve( __dirname, "../modules/release" );
const destDir = path.resolve( __dirname, "../dist/win-unpacked/modules" );

const getDirectories = async source =>
    ( await readdir( source, { withFileTypes: true } ) )
        .filter( dirent => dirent.isDirectory() )
        .map( dirent => dirent.name );


( async () => {
    try {
        ensureDirSync( destDir );

        const folders = await getDirectories( srcDir );
        
        folders.forEach( folder => {
            copySync( `${srcDir}/${folder}`, `${destDir}/${folder}`, {
                overwrite: true
            }, ( err ) => {
                if ( err ) {
                    console.error( err );
                }
            } );
            console.log( "\x1b[32m", `Successfully copied: ${folder}` );
            console.log( "\x1b[0m" );
        } );

    } catch ( error ) {
        console.error( error );
    }
} )();