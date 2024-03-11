import {useLoaderData, Outlet, useOutletContext} from "react-router-dom";
import {createElement, useEffect, useRef, useState} from "react";
import {jsx, jsxs} from "react/jsx-runtime";
import {connect} from "react-redux";

import Renderer from "./Plugins/Renderer.jsx";

import Index from './Pages/Index.jsx';
import Blog from "./Pages/Blog.jsx";
import Article from "./Pages/Article.jsx";
import Gallery from "./Pages/Gallery.jsx";
import Album from "./Pages/Album.jsx";
import Tag from "./Pages/Tag.jsx";

import Stub from "./Components/Stub.jsx";

const _jsx = (type, props, key) => jsx(type, {...props, ref: ['symbol', 'function'].includes(typeof type) ? null : useRef(null)}, key);

const _jsxs = context => (type, props, key) =>
{
    const [children, setChildren] = useState(props.children); useEffect(() => {Renderer.onRender.call(children, setChildren, context)}, []);

    return jsxs(type, {...props, children, ref: ['symbol', 'function'].includes(typeof type) ? null : useRef(null)}, key);
}

const render = async json => json.content ? {...json, content: await Renderer.evaluate(json.content, _jsx, _jsxs(json))} : json;

const Error = (props) => <Stub {...props} chain="404" title="404 NOT FOUND"/>;

const ComponentConnected = (Component) => connect(state => state.Mobiler)(({mobile}) =>
{
    const Context = useOutletContext(); Renderer.onAction.finish = false; Renderer.first = []; Renderer.last = [];

    useEffect(() => Renderer.build(), [mobile, Context.url]); return createElement(Context.status > 400 ? Error : Component(Context), {Context})
});

export default [
    {
        path: "/",
        loader: ({request}) => fetch(request.url + 'index.json', {headers: {"Content-Type": "application/json"}}).then(resolve => resolve.json().then(json => render({...json, url: request.url}))),
        shouldRevalidate: (url) => url.currentUrl.pathname !== url.nextUrl.pathname,
        Component: connect()(({dispatch}) =>
        {
            useEffect(() => Renderer.start(dispatch), []); return <Outlet context={useLoaderData()}/>
        }),
        children: [
            {index: true, Component: ComponentConnected(() => Index)},
            {path: 'blog/', Component: ComponentConnected(() => Blog)},
            {path: 'blog/:slug', Component: ComponentConnected(Context => Context.props?.is_gallery ? Album : Article)},
            {path: 'tag/:slug', Component: ComponentConnected(() => Tag)},
            {path: 'gallery/', Component: ComponentConnected(() => Gallery)},
            {path: 'about/', Component: ComponentConnected(() => (props) => <Stub {...props} chain="О проекте" title="О проекте"/>)},
            {path: 'about/stock/', Component: ComponentConnected(() => (props) => <Stub {...props} chain="Склад" title="Ссылки на полезные статьи"/>)},
            {path: '*', Component: ComponentConnected(() => Error)}
        ]
    }
]