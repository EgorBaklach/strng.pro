import {createSlice, current} from "@reduxjs/toolkit";

export default createSlice({
    name: 'Chater',
    initialState: {
        loaded: false,
        last_id: false,
        messages: {}
    },
    reducers: {
        init: (state, {payload}) =>
        {
            state.messages = payload ?? {}; state.loaded = true;
        },
        insert: (state, {payload: [id, message]}) =>
        {
            state.messages = {[id]: message, ...current(state).messages}; state.last_id = id;
        },
        delete: (state, {payload: [id]}) =>
        {
            delete state.messages[id];
        },
        edit: (state, {payload: [id, {name, text}]}) =>
        {
            state.messages[id]['name'] = name; state.messages[id]['text'] = text;
        }
    }});