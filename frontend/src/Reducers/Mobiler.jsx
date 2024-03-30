import {createSlice} from "@reduxjs/toolkit";

export default createSlice({
    name: 'Mobile',
    initialState: {
        mobile: import.meta.env.SSR || window.innerWidth < 768
    },
    reducers: {
        update: (state) =>
        {
            state.mobile = window.innerWidth < 768
        }
    },
});