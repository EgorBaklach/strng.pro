import {createSlice, current} from "@reduxjs/toolkit"

import Renderer from "../Plugins/Renderer.jsx";

export const Loader = createSlice({
    name: 'Loader',
    initialState: {
        action: null,
        counter: {},
        list: {}
    },
    reducers: {
        action: (state, {payload}) =>
        {
            state.action = payload;
        },
        list: (state, {payload}) =>
        {
            const [list, check] = payload, currentState = current(state); if(check) for(const value of Object.keys(list)) if(currentState.counter[value]) return; state.list = {...currentState.list, ...list};
        },
        add: (state, {payload}) =>
        {
            if(Renderer.onAction.finish || current(state)?.list[payload]) return; state.list[payload] = false;
        },
        load: (state, {payload}) =>
        {
            if(Renderer.onAction.finish) return; state.list[payload] = state.counter[payload] = true;
        },
        check: state =>
        {
            Renderer.onAction.call(current(state));
        },
        reset: state =>
        {
            state.list = {};
        }
    },
})

export const { action, list, add, load, check, reset } = Loader.actions

export default Loader.reducer