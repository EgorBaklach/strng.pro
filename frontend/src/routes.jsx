import {createElement, useEffect, useRef, useState} from "react";
import {Fragment, jsx, jsxs} from "react/jsx-runtime";
import {evaluate} from "@mdx-js/mdx";
import {useLoaderData, Outlet, useOutletContext} from "react-router-dom";

import Renderer from "./Plugins/Renderer.js";
import useResize from "./Hooks/useResize.jsx";

import Index from './Pages/Index.jsx';
import Error from './Pages/Error.jsx';
import Blog from "./Pages/Blog.jsx";
import Article from "./Pages/Article.jsx";

const _jsx = function (type, props, key)
{
    const ref = useRef(null); return jsx(type, {...props, ref: ['symbol', 'function'].includes(typeof type) ? null : ref}, key)
}

const _jsxs = function (type, props, key)
{
    const ref = useRef(null), [children, setChildren] = useState(props.children), [width] = useResize();

    useEffect(() => { if(this.props?.horizontal) Renderer.delay.call([children, setChildren, width]) }, [width, Renderer.delay.finish])

    return jsxs(type, {...props, children, ref: ['symbol', 'function'].includes(typeof type) ? null : ref}, key)
}

const handler = async (json, url) => ({...json, content: await evaluate(json.content, {jsx: _jsx, Fragment, jsxs: _jsxs.bind(json), development: false}), url})

const NotFoundHandler = (Component) => () =>
{
    const Context = useOutletContext(), [width] = useResize(); useEffect(() => () => document.body.removeAttribute('class'), [Context.url])

    useEffect(() => () => Context.props?.horizontal ? Renderer.reStart() : null, [width < 768, Context.url])

    return createElement(Context.status > 400 ? Error : Component, {Context})
};

export default [
    {
        path: "/",
        loader: ({request}) => fetch(request.url + 'index.json', {headers: {"Content-Type": "application/json"}}).then(resolve => resolve.json().then(json => handler(json, request.url))),
        shouldRevalidate: (url) => url.currentUrl.pathname !== url.nextUrl.pathname,
        Component: () =>
        {
            const Context = useLoaderData(); useEffect(() => document.querySelector("root").removeAttribute('data-ssr'), []); return <Outlet context={Context}/>;
        },
        children: [
            {index: true, Component: NotFoundHandler(Index)},
            {path: 'blog/', Component: NotFoundHandler(Blog)},
            {path: 'blog/:slug', Component: NotFoundHandler(Article)},
            {path: '*', Component: NotFoundHandler(Error)}
        ]
    }
]