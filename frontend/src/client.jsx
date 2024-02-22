import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import ReduxProvider from "./provider.jsx";
import routes from "./routes.jsx";

createRoot(document.querySelector("root")).render(<ReduxProvider><RouterProvider router={createBrowserRouter(routes)} /></ReduxProvider>);