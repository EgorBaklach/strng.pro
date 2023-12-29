import ReactDOMServer from 'react-dom/server'
import {createStaticHandler, createStaticRouter, StaticRouterProvider} from "react-router-dom/server.js"
import routes from "./routes.jsx";
import {configureStore} from "@reduxjs/toolkit";
import pictures from "./Reducers/Pictures.jsx";
import {Provider} from "react-redux";

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
        html: ReactDOMServer.renderToString(<Provider store={configureStore({reducer: {pictures}})}><StaticRouterProvider router={router} context={context} hydrate={false} /></Provider>),
        statusCode: context.loaderData[0].status
    };
}