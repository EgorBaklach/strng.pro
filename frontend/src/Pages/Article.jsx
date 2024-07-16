import {createElement, forwardRef, Fragment, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light-async.js";
import YouTube from "react-youtube";
import {connect} from "react-redux";
import {JustifiedGrid} from "@egjs/react-grid";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import Layout from "../Components/Layout.jsx";
import Tags from "../Components/Tags.jsx";
import Wrapper from "../Components/Wrapper.jsx";
import Main from "../Components/Main.jsx";
import UserForm from "../Components/UserForm.jsx";
import Message from "../Components/Message.jsx";

import Delayer from "../Plugins/Delayer.jsx";
import Renderer from "../Plugins/Renderer.jsx";

import Imager from "../Reducers/Imager.jsx";
import Loader from "../Reducers/Loader.jsx";

import Stream from "../Actions/Stream.jsx";
import Social from "../Actions/Social.jsx";
import Dialog from "../Actions/Dialog.jsx";

const Sticker = connect(state => state.Mobiler, null, null, {forwardRef: true})(forwardRef(({mobile, width, title, src, dispatch, index}, ref) =>
{
    const img = <img src={src} alt={title} style={{width}} onLoad={() => dispatch(Loader.actions.load(src)) && dispatch(Loader.actions.check())}/>;

    useEffect(() => {dispatch(Loader.actions.add(src)) && dispatch(Imager.actions.add(src))}, []);

    return <Fragment>{createElement(mobile ? 'div' : 'a', !mobile ? {className: 'js-gallery-image', 'data-index': index, href: src, ref} : null, img)}<br/>{title}</Fragment>;
}))

const Smallsup = ({color, children}) => <span style={{color}} className="small-sup">{children}</span>;

const code = ({className, ...props}) =>
{
    const match = /language-(\w+)/.exec(className || '');

    return match ? <SyntaxHighlighter language={match[1]} useInlineStyles={false} PreTag="div" {...props} ref={useRef(null)}/> : <code className={className} {...props} ref={useRef(null)}/>
}

const Video = (props) => <YouTube {...props} ref={useRef(null)}/>

const GridGalleryItem = connect(state => state.Mobiler)(({src, title, index, dispatch}) =>
{
    useEffect(() => {dispatch(Loader.actions.add(src)) && dispatch(Imager.actions.add(src))}, []);

    return <a href={src} className="image js-gallery-image" data-index={index}>
        <img src={src + '?stamp=' + Math.floor(Date.now()/1000)} alt={title + ' - ' + ++index} onLoad={() => dispatch(Loader.actions.load(src)) && dispatch(Loader.actions.check())}/>
    </a>
})

const GridGalleryComponent = connect(state => state.Mobiler)(({mobile, pictures, title, images}) =>
{
    const ref = useRef(null), onRender = new Delayer(() => {Renderer.onScroll.call(); (list => {list?.add('complite'); list?.remove('loading-after')})(ref.current?._containerRef.current.classList)}, 150);

    return <JustifiedGrid
        className="justified-gallery loading-after"
        useResizeObserver={true}
        gap={10}
        ref={ref}
        columnRange={mobile ? [2,3] : [3,5]}
        isCroppedSize={true}
        onRenderComplete={event => onRender.call(event)}>
        {images.map((id, index) => <GridGalleryItem key={pictures[id]} index={index} src={pictures[id]} title={title}  type="GridGallery"/>)}
    </JustifiedGrid>
})

const LightboxComponent = connect(state => state.Imager)(({list, index, dispatch}) =>
{
    const pictures = Object.values(list); return pictures.length ? <Lightbox plugins={[Zoom]} render={{buttonZoom: () => null}} open={index >= 0} slides={pictures} close={() => dispatch(Imager.actions.close())} index={index}/> : null;
})

export default connect(state => state.Mobiler, {dispatch: action => dispatch => dispatch(action), ...Stream, ...Dialog})(({Context, comments, counters, mobile, dispatch, subscribe, onEdit, onDelete}) =>
{
    const Content = Context.content.default; useEffect(() => {subscribe('visits' + Context.id, props => Social.update('visits', Context.id, Context.cnt_visits, 1, ...props))}, [Context.url]);

    useEffect(() => {Object.keys(counters).length && Renderer.rerender(counters)}, [counters]);

    useEffect(() =>
    {
        dispatch(Loader.actions.action(Context.props?.action)); dispatch(Loader.actions.list([{'Roboto Slab': false}, true])); Renderer.onScroll.call();

        document.body.classList.add(...['article-page', !mobile && (Context.props?.action === 'columnize' ? 'loading-after' : 'chat-active')].filter(v => v));
    }, [mobile, Context.url]);

    Renderer.first = [
        <Link to="/" className="mobile-home-icon" key="home-icon"></Link>,
        <div className="breadcrumbs" ref={useRef(null)} key="breadcrumbs">
            <ul>
                <li><Link to="/" title="Главная">Главная</Link></li>
                <li><Link to="/blog/" title="Блог">Блог</Link></li>
                <li className="current"><span>{Context.name}</span></li>
            </ul>
        </div>,
        <h1 className="page-title" ref={useRef(null)} key="page-title">{Context.name}</h1>,
        !Context.props?.hide_picture ? <div className="article-page-picture" ref={useRef(null)} key="article-page-picture"><img src={Context.pictures[1]} alt={Context.name}/></div> : null
    ];

    Renderer.last = [
        <Tags article={Context} ref={useRef(null)} key="tags" className="article-tags"><li>{"© strng.pro " + new Date().getFullYear()}</li></Tags>
    ];

    if(!import.meta.env.SSR)
    {
        const CommentsContainer = [
            <h2 ref={useRef(null)} role="breakline" className="comments-title" key="comments-title">Комментарии</h2>,
            ...Object.entries(comments).map(([id, message]) => <div key={id} className="message js-message" data-id={message.id}>
                {message?.date_break && <div className="message-break"><span>{message.date_break}</span></div>}
                <Message message={message} onEdit={() => {Renderer.scrollers?.article?._container.scrollTo(999999, 999999); onEdit(message)}} onDelete={() => onDelete([message.id, Context.id, Context.cnt_comments])}/>
            </div>),
            <div className="user-form" ref={useRef(null)} key="user-form"><UserForm instance="comments" aid={Context.id} count={Context.cnt_comments}/></div>
        ];

        !mobile ? Renderer.last = Renderer.last.concat(CommentsContainer) : Renderer.last.push(<div className="comments">{CommentsContainer.map(v => v)}</div>);
    }

    Renderer.lb = <button ref={useRef(null)} className="arrow left" onClick={() => Renderer.turn(false)}></button>;
    Renderer.rb = <button ref={useRef(null)} className="arrow right active" onClick={() => Renderer.turn(true)}></button>;

    const GridGallery = props => <GridGalleryComponent pictures={Context.pictures} title={Context.name} {...props}/>;

    return <Layout articles={Context.articles}>
        <Wrapper component="main" reverse={Main} role="article" className="wrapper">
            <div className={"container" + (Context.props?.action === 'columnize' ? " horizontal" : "")}>
                <div className="chat-icon" onClick={() => document.body.classList.toggle('chat-active')}></div>
                {import.meta.env.SSR ? Renderer.first.map(v => v) : null}
                <Content components={{code, Video, Sticker, Smallsup, GridGallery}}/>
                {import.meta.env.SSR ? Renderer.last.map(v => v) : null}
            </div>
        </Wrapper>
        <LightboxComponent type="lightbox"/>
    </Layout>;
});