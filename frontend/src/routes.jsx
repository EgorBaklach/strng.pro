import {useLoaderData, Outlet, useOutletContext} from "react-router-dom";
import {createElement, Fragment, memo, useEffect, useRef, useState} from "react";
import {jsx, jsxs} from "react/jsx-runtime";
import {connect} from "react-redux";

import Renderer from "./Plugins/Renderer.jsx";

import Index from './Pages/Index.jsx';
import Blog from "./Pages/Blog.jsx";
import Article from "./Pages/Article.jsx";
import Gallery from "./Pages/Gallery.jsx";
import Album from "./Pages/Album.jsx";
import Tag from "./Pages/Tag.jsx";

import CAPanel from "./Components/CAPanel.jsx";
import Chat from "./Components/Chat.jsx";
import Stub from "./Components/Stub.jsx";

import Comments from "./Reducers/Comments.jsx";

import Stream from "./Actions/Stream.jsx";
import Api from "./Actions/Api.jsx";

const _jsx = (type, props, key) => jsx(type, {...props, ref: ['symbol', 'function'].includes(typeof type) ? null : useRef(null)}, key);

const _jsxs = (type, props, key) =>
{
    const [children, setChildren] = useState(props.children); useEffect(() => {Renderer.onRender.call(children, setChildren)}, []);

    return jsxs(type, {...props, children, ref: ['symbol', 'function'].includes(typeof type) ? null : useRef(null)}, key);
}

const catcher = url => render({
    status: 503,
    content: "Вероятно пропал интернет. Ничего страшного! Немного подождите, затем [обновите страницу](" + url + ")\n\r© strng.pro " + new Date().getFullYear(),
    page_title: '503 SERVER ERROR',
    articles: Renderer.context?.articles ?? {},
    uid: Renderer.context?.uid ?? null,
    url
});

const init = headers => ({headers: {...Object.fromEntries(headers), 'Content-Type': 'application/json'}});

const render = async json => json.content ? {...json, content: await Renderer.evaluate(json.content, _jsx, _jsxs)} : json;

const StubComponent = ({Context, ...props}) => <Stub {...props} Context={Context} chain={Context?.chain || Context.status} title={Context.page_title}/>;

const Handler = Component => connect(state => state.Mobiler)(({mobile}) =>
{
    const Context = useOutletContext(); Renderer.onAction.finish = false; Renderer.first = []; Renderer.last = [];

    useEffect(() => Renderer.build(Context), [mobile, Context.url]); return createElement(Context.status > 400 ? StubComponent : Component(Context), {Context})
});

const ArticleComponent = connect(state => state.Comments)(memo(({Context, aid, comments, counters, dispatch}) =>
{
    useEffect(() => {Context.id !== aid && dispatch(Comments.actions.init([Context.id, Context.comments]))}, [Context.id]);

    return (Context.id === aid || import.meta.env.SSR) && <Article Context={Context} comments={comments} counters={counters}/>;
}));

export default [
    {
        path: "/",
        loader: ({request: {url, headers}}) => fetch((url => url.origin + url.pathname + 'index.json' + url.search)(new URL(url)), init(headers))
            .then(resolve => resolve.json().then(json => render({...json, url}))).catch(() => catcher(url)),
        shouldRevalidate: (url) => url.currentUrl.pathname !== url.nextUrl.pathname,
        Component: connect(null, {dispatch: action => dispatch => dispatch(action), ...Api, ...Stream})(props =>
        {
            useEffect(() => Renderer.start(props), []);

            return <Fragment><Outlet context={useLoaderData()}/>{!import.meta.env.SSR && <Fragment><section className="chat"><Chat/></section><CAPanel cookies={Renderer.cookies}/></Fragment>}</Fragment>
        }),
        children: [
            {index: true, Component: Handler(() => Index)},
            {path: 'blog/', Component: Handler(() => Blog)},
            {path: 'blog/:slug', Component: Handler(Context => Context.props?.is_gallery ? Album : ArticleComponent)},
            {path: 'tag/:slug', Component: Handler(() => Tag)},
            {path: 'gallery/', Component: Handler(() => Gallery)},
            {path: '*', Component: Handler(() => StubComponent)}
        ]
    }
]