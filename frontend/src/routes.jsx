import {useLoaderData, Outlet, useOutletContext} from "react-router-dom";
import {createElement, useEffect, useRef, useState} from "react";
import {Fragment, jsx, jsxs} from "react/jsx-runtime";
import {connect, useDispatch} from "react-redux";
import {evaluate} from "@mdx-js/mdx";

import Renderer from "./Plugins/Renderer.jsx";

import Index from './Pages/Index.jsx';
import Blog from "./Pages/Blog.jsx";
import Article from "./Pages/Article.jsx";
import Error from './Pages/Error.jsx';
import Gallery from "./Pages/Gallery.jsx";

const useResize = () => [Renderer.dimensions, Renderer.setDimensions] = useState(import.meta.env.SSR ? 0 : window.innerWidth + window.innerHeight);

const _jsx = function (type, props, key)
{
    const ref = useRef(null); return jsx(type, {...props, ref: ['symbol', 'function'].includes(typeof type) ? null : ref}, key)
}

const _jsxs = function (type, props, key)
{
    const ref = useRef(null), [children, setChildren] = useState(props.children), [dimensions] = useResize();

    useEffect(() => {this.props?.horizontal ? Renderer.onColumnize.call(children, setChildren) : null}, [dimensions, Renderer.onColumnize.finish])

    return jsxs(type, {...props, children, ref: ['symbol', 'function'].includes(typeof type) ? null : ref}, key)
}

const handler = async (json, url) => ({...json, ...(json?.content ? {content: await evaluate(json.content, {jsx: _jsx, Fragment, jsxs: _jsxs.bind(json), development: false})} : {}), url})

const ComponentConnected = (Component) => connect(state => state.Mobiler)(({mobile}) =>
{
    const Context = useOutletContext(); useEffect(() => Renderer.build(), [mobile, Context.url]); return createElement(Context.status > 400 ? Error : Component(Context), {Context})
});

export default [
    {
        path: "/",
        loader: ({request}) => fetch(request.url + 'index.json', {headers: {"Content-Type": "application/json"}}).then(resolve => resolve.json().then(json => handler(json, request.url))),
        shouldRevalidate: (url) => url.currentUrl.pathname !== url.nextUrl.pathname,
        Component: () =>
        {
            const Context = useLoaderData(), dispatch = useDispatch(); useEffect(() => Renderer.start(dispatch), []); return <Outlet context={Context}/>
        },
        children: [
            {index: true, Component: ComponentConnected(() => Index)},
            {path: 'blog/', Component: ComponentConnected(() => Blog)},
            {path: 'blog/:slug', Component: ComponentConnected(Context => Context.props?.is_gallery ? Error : Article)},
            {path: 'gallery/', Component: ComponentConnected(() => Gallery)},
            {path: '*', Component: ComponentConnected(() => Error)}
        ]
    }
]