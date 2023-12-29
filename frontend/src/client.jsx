import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import routes from "./routes.jsx";
import {configureStore} from "@reduxjs/toolkit";
import pictures from "./Reducers/Pictures.jsx";
import {Provider} from "react-redux";

createRoot(document.querySelector("root")).render(<Provider store={configureStore({reducer: {pictures}})}><RouterProvider router={createBrowserRouter(routes)} /></Provider>);