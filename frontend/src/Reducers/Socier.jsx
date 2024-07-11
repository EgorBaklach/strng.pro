import {createSlice, current} from "@reduxjs/toolkit";

export default createSlice({
    name: 'Socier',
    initialState: {
        loaded: false,
        socials: {},
        visits: {},
        likes: {}
    },
    reducers: {
        init: (state, {payload: {visits, likes}}) =>
        {
            state.visits = visits ?? {}; state.likes = likes ?? {}; state.loaded = true;
        },
        insert: (state, {payload: [instance, me, id, count, value]}) =>
        {
            const currentState = current(state); instance !== 'comments' && me ? state[instance][id] = value > 0 : null;

            if(currentState.socials[id]?.[instance] > 0) count = currentState.socials[id][instance];

            state.socials[id] = {...currentState.socials[id] ?? {}, [instance]: count === 0 && value < 0 ? 0 : count + value};
        },
    },
});