import {configureStore} from "@reduxjs/toolkit";
import pictures from "./Reducers/Pictures.jsx";
import {Provider} from "react-redux";

export default ({children}) => <Provider store={configureStore({reducer: {pictures}})}>{children}</Provider>;