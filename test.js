import { execFile } from "child_process";
import { join } from "path";
import net from "net";

function isJsonString( str ) {
    try {
        JSON.parse( str );
    } catch ( e ) {
        return false;
    }
    return true;
}

const server = net.createServer( ( socket ) => {
    socket.on( "data", ( data ) => {
        data = data.toString();
        if ( isJsonString( data ) ) {
            data = JSON.parse( data );
        }
        
        console.log( data );
    } );
} ).on( "error", ( err ) => {
    console.log( "ERROR: " );
    console.error( err );
} );

server.on( "connection", connection => {
    console.log( "User connected" );
} );

// Open server on port 9898
server.listen( 1337, () => {
    console.log( "opened server on", server.address().port );
} );

// SocketServer.on( "data", data => {
//     console.log( data );
// } );

// SocketServer.start( ( port ) => {
//     console.log( `Started socket server on port ${port}!` );
// } );

// const child = execFile( join( __dirname, "./modules/R4versThumbParams/bin/release/win-x64/R4versThumbParams.exe" ), {
//     detached: true
// } );