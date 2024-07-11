import {createSlice} from "@reduxjs/toolkit";

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
        }
    },
});