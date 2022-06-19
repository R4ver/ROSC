var isModule = ( id ) => /rosc\.module\.(.+)/g.exec( id );

export default function MessageHandler( state, { type, payload }, ws, callback ) {
    let event = { event: null, data: null };

    switch ( type ) {
    case "identifier":
        var id = payload.id;
        var isFrontend = id === "rosc.frontend";

        if ( isModule( id ) ) {
            state = {
                ...state,
                modules: {
                    ...state.modules,
                    [payload.id]: {
                        ...[payload.id],
                        ws
                    }
                }
            };
        }

        if ( isFrontend ) {
            state = {
                ...state,
                frontend: ws
            };
            event = { event: "frontend", data: null };
        }
        break;

    case "update":
        if ( state.frontend == null ) return;
        state.frontend.send( SendUpdate( payload ) );
        break;

    default:
        console.log( "Message not handled by type: ", { state, type, ...payload } );
        break;
    }

    callback( state, event );
}

const SendUpdate = ( payload ) => JSON.stringify( {
    type: "update",
    payload: payload
} );