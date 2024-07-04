import {createSlice, current} from "@reduxjs/toolkit";

export default createSlice({
    name: 'User',
    initialState: {
        loaded: false,
        user: {},
    },
    reducers: {
        init: (state, {payload}) =>
        {
            state.user = payload ?? {}; state.loaded = true;
        },
        counter: (state, {payload}) =>
        {
            state.user.counter += payload;
        },
        edit: (state, {payload: {id, name, text}}) =>
        {
            state.user = {...current(state).user, mid: id, name, text};
        },
        clear: (state, {payload}) =>
        {
            payload * 1 === state.user.mid * 1 && delete state.user.mid && delete state.user.name && delete state.user.text;
        }
    },
});