import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";

import Mobiler from "./Reducers/Mobiler.jsx";
import Loader from "./Reducers/Loader.jsx";
import Imager from "./Reducers/Imager.jsx";
import Socier from "./Reducers/Socier.jsx";

import stream from "./Services/Stream.jsx";
import api from "./Services/Api.jsx";

const store = {
    reducer: {
        Mobiler: Mobiler.reducer,
        Loader: Loader.reducer,
        Imager: Imager.reducer,
        Socier: Socier.reducer
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