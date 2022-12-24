import { createReducer } from "./index";

const newMessage = ( state: any, { payload }: {payload: any} ) => ( {
    ...state,
    [payload.payload.id]: { ...payload.payload }
} );

const socketMessagesReducer = createReducer( {}, {
    NEW_MESSAGE: newMessage,
} );

export default socketMessagesReducer;