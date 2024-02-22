import {createStaticHandler, createStaticRouter, StaticRouterProvider} from "react-router-dom/server.js";
import ReactDOMServer from 'react-dom/server';

import ReduxProvider from "./provider.jsx";
import routes from "./routes.jsx";

const createFetchRequest = (req) =>
{
    const url = new URL(req.originalUrl || req.url, `${req.protocol}://${req.get("host")}`), controller = new AbortController(), headers = new Headers(), init = {method: req.method, headers, signal: controller.signal}

    req.on("close", () => controller.abort())

    for(const [key, values] of Object.entries(req.headers))
    {
        if(Array.isArray(values)) for (let value of values) headers.append(key, value); else if(values) headers.set(key, values);
    }

    if(req.method !== "GET" && req.method !== "HEAD") init.body = req.body; return new Request(url.href, init);
}

export const render = async (request) =>
{
    const { query, dataRoutes } = createStaticHandler(routes), context = await query(createFetchRequest(request)), router = createStaticRouter(dataRoutes, context);

    return {
        html: ReactDOMServer.renderToString(<ReduxProvider><StaticRouterProvider router={router} context={context} hydrate={false} /></ReduxProvider>),
        statusCode: context.loaderData[0].status
    };
}