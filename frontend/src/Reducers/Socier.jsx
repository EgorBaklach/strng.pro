import {createSlice, current} from "@reduxjs/toolkit";
import api from '../api.jsx';

export default createSlice({
    name: 'Socier',
    initialState: {
        socials: {},
        likes: {}
    },
    reducers: {
        insert: (state, {payload: [instance, uid, id, count, value]}) =>
        {
            const currentState = current(state); if(instance === 'likes') state.likes[uid] = {...currentState.likes[uid] ?? {}, [id]: value > 0};

            state.socials[id] = {...currentState.socials[id] ?? {}, [instance]: count === 0 && value < 0 ? 0 : count + value}; delete api.async[instance];
        },
    },
});