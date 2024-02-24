import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";

import Imager from "./Reducers/Imager.jsx";
import Mobiler from "./Reducers/Mobiler.jsx";

export default ({children}) => <Provider store={configureStore({reducer: {Imager, Mobiler}})}>{children}</Provider>;