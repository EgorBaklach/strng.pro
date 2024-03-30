import {createStaticHandler, createStaticRouter, StaticRouterProvider} from "react-router-dom/server.js";
import ReactDOMServer from 'react-dom/server';

import ReduxProvider from "./provider.jsx";
import routes from "./routes.jsx";

export const render = async request =>
{
    const { query, dataRoutes } = createStaticHandler(routes), context = await query(request), router = createStaticRouter(dataRoutes, context);

    return {
        html: ReactDOMServer.renderToString(<ReduxProvider><StaticRouterProvider router={router} context={context} hydrate={false} /></ReduxProvider>),
        statusCode: context.loaderData[0].status
    };
}