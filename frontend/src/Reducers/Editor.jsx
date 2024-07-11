import {createSlice, current} from "@reduxjs/toolkit";

export default createSlice({
    name: 'Editor',
    initialState: {
        edit: {},
    },
    reducers: {
        edit: (state, {payload: [instance, {id, name, text}]}) =>
        {
            state.edit = {...current(state).edit, [instance]: {id : id * 1, name, text}};
        },
        clear: (state, {payload: [instance, id]}) =>
        {
            current(state).edit[instance]?.id === id && delete state.edit[instance];
        }
    },
});