import {createSlice, current} from "@reduxjs/toolkit";

export default createSlice({
    name: 'Imager',
    initialState: {
        list: {},
        index: -1
    },
    reducers: {
        add: (state, action) =>
        {
            if(current(state)?.list[action.payload]) return; state.list[action.payload] = {src: action.payload};
        },
        open: (state, action) =>
        {
            state.index = action.payload
        },
        close: (state) =>
        {
            state.index = -1
        },
        clean: (state) =>
        {
            state.list = {}
        }
    },
});