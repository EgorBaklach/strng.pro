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
        update: (state, {payload: [name, counter]}) =>
        {
            if(name) state.user.name = name; state.user.counter += counter;
        }
    },
});