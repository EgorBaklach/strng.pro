import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";

import Mobiler from "./Reducers/Mobiler.jsx";
import Loader from "./Reducers/Loader.jsx";
import Imager from "./Reducers/Imager.jsx";

import api from "./api.jsx";

const store = {
    reducer: {
        Mobiler: Mobiler.reducer,
        Loader: Loader.reducer,
        Imager: Imager.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        thunk: {
            extraArgument: {
                api
            }
        }
    })
};

export default ({children}) => <Provider store={configureStore(store)}>{children}</Provider>;