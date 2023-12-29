import {createSlice} from "@reduxjs/toolkit"

export const Pictures = createSlice({
    name: 'Pictures',
    initialState: {
        list: [],
        index: -1
    },
    reducers: {
        insert: (state, action) =>
        {
            state.list.push(action.payload)
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
            state.list = []
        }
    },
})

export const { insert, open, close, clean } = Pictures.actions

export default Pictures.reducer