import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";

import Mobiler from "./Reducers/Mobiler.jsx";
import Loader from "./Reducers/Loader.jsx";
import Imager from "./Reducers/Imager.jsx";

export default ({children}) => <Provider store={configureStore({reducer: {Imager, Mobiler, Loader}})}>{children}</Provider>;