import WebSocket from "ws";

const ws = new WebSocket( "ws://localhost:8080" );

ws.on( "open", function open() {
    const identifier = {
        type: "identifier",
        payload: {
            id: "rosc.module.testmodule"
        }
    };
    console.log( "Connection Open" );
    ws.send( JSON.stringify( identifier ) );
} );

ws.on( "message", function message( data ) {
    console.log( "received: %s", data );
} );

ws.on( "error", ( err ) => {
    console.log( err.message );
} );

fetch( "https://api.github.com/users/R4ver" )
    .then( response => response.json() ) //Converting the response to a JSON object
    .then( data => {
        ws.send( SendUpdate( {
            username: data.login
        } ) );
    } )
    .catch( error => console.error( error ) );

const SendUpdate = ( payload ) => JSON.stringify( {
    type: "update",
    payload: {
        id: "rosc.module.testmodule",
        props: {
            ...payload
        }
    }
} );