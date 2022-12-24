import AppState from "./store";

export default function MessageHandler( state, { type, payload }, ws, callback ) {
    let event = { event: null, data: null };

    switch ( type ) {
        case "identifier":
            var id = payload.id;
            var isFrontend = id === "rosc.frontend";

            if ( isFrontend ) {
                state = {
                    ...state,
                    frontend: ws
                };
                event = { event: "frontend", data: null };

            } else {
                state = {
                    ...state,
                    modules: {
                        ...state.modules,
                        [payload.id]: ws
                    }
                };

                ws.send( SendSettings( AppState.GetItem( payload.id ) ) );
            }


            break;

        case "update":
            if ( state.frontend == null ) return;
            state.frontend.send( SendUpdate( payload ) );
            break;

        case "setting_saved":
            state.modules[payload.id].send( SendSettingsUpdate( payload.setting ) );
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

const SendSettingsUpdate = ( payload ) => JSON.stringify( {
    type: "setting_saved",
    payload
} );

const SendSettings = ( payload ) => JSON.stringify( {
    type: "settings",
    payload
} );