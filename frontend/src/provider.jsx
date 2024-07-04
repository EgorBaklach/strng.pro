import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";

import Mobiler from "./Reducers/Mobiler.jsx";
import Chater from "./Reducers/Chater.jsx";
import Loader from "./Reducers/Loader.jsx";
import Imager from "./Reducers/Imager.jsx";
import Socier from "./Reducers/Socier.jsx";
import User from "./Reducers/User.jsx";

import stream from "./Services/Stream.jsx";
import api from "./Services/Api.jsx";

const store = {
    reducer: {
        Mobiler: Mobiler.reducer,
        Chater: Chater.reducer,
        Loader: Loader.reducer,
        Imager: Imager.reducer,
        Socier: Socier.reducer,
        User: User.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        thunk: {
            extraArgument: {
                stream,
                api
            }
        }
    })
};

export default ({children}) => <Provider store={configureStore(store)}>{children}</Provider>;