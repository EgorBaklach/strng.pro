import {createStaticHandler, createStaticRouter, StaticRouterProvider} from "react-router-dom/server.js";
import ReactDOMServer from 'react-dom/server';

import ReduxProvider from "./provider.jsx";
import routes from "./routes.jsx";

export const render = async request =>
{
    const { query, dataRoutes } = createStaticHandler(routes), context = await query(request), router = createStaticRouter(dataRoutes, context);

    return {
        html: ReactDOMServer.renderToString(<ReduxProvider><StaticRouterProvider router={router} context={context} hydrate={false} /></ReduxProvider>) ?? '',
        statusCode: context.loaderData[0]?.status,
        title: context.loaderData[0]?.page_title ?? '',
        ogTitle: context.loaderData[0]?.og_title ?? '',
        description: context.loaderData[0]?.description ?? '',
        ogDescription: context.loaderData[0]?.og_description ?? '',
        keywords: context.loaderData[0]?.keywords ?? '',
        image: context.loaderData[0]?.image ?? 'https://dev.arg.me/assets/images/main.png'
    };
}