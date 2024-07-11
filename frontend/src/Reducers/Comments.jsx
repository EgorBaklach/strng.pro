import {createSlice, current} from "@reduxjs/toolkit";

export default createSlice({
    name: 'Comments',
    initialState: {
        aid: false,
        counters: {},
        comments: {}
    },
    reducers: {
        init: (state, {payload: [id, comments]}) =>
        {
            state.aid = id; state.comments = comments ?? {};
        },
        insert: (state, {payload: [id, {aid, ...comment}]}) =>
        {
            const currentState = current(state), count = currentState.counters?.insert ?? 0; if(currentState.aid !== aid) return;

            state.counters = {...currentState.counters, insert: count + 1};

            state.comments = {...currentState.comments, [id]: comment};
        },
        delete: (state, {payload: [id, aid]}) =>
        {
            const currentState = current(state), count = currentState.counters?.delete ?? 0; if(currentState.aid !== aid) return;

            state.counters = {...currentState.counters, delete: count + 1};

            delete state.comments[id];
        },
        edit: (state, {payload: [id, {name, text, aid}]}) =>
        {
            const currentState = current(state), count = currentState.counters?.edit ?? 0; if(currentState.aid !== aid) return;

            state.counters = {...currentState.counters, edit: count + 1};

            state.comments[id]['name'] = name;
            state.comments[id]['text'] = text;
        }
    }
});
