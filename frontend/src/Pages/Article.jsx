import {createElement, forwardRef, Fragment, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light-async.js";
import YouTube from "react-youtube";
import {connect} from "react-redux";
import {JustifiedGrid} from "@egjs/react-grid";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import HorizontalWheel from "../Components/HorizontalWheel.jsx";
import Layout from "../Components/Layout.jsx";
import Tags from "../Components/Tags.jsx";
import Wrapper from "../Components/Wrapper.jsx";
import Main from "../Components/Main.jsx";

import Delayer from "../Plugins/Delayer.jsx";
import Renderer from "../Plugins/Renderer.jsx";

import {add as addImager, close} from "../Reducers/Imager.jsx";
import {add as addLoader, check, load, action, list} from "../Reducers/Loader.jsx";

const Sticker = connect(state => state.Mobiler, null, null, {forwardRef: true})(forwardRef(({mobile, width, title, src, dispatch, index}, ref) =>
{
    const img = <img src={src + '?stamp=' + Math.floor(Date.now() / 5000)} alt={title} style={{width}} onLoad={() => dispatch(load(src)) && dispatch(check())}/>;

    useEffect(() => {dispatch(addLoader(src)) && dispatch(addImager(src))}, []);

    return <Fragment>{createElement(mobile ? 'div' : 'a', !mobile ? {className: 'js-gallery-image', 'data-index': index, href: src} : null, img)}<br/>{title}</Fragment>;
}))

const code = ({className, ...props}) =>
{
    const match = /language-(\w+)/.exec(className || '');

    return match ? <SyntaxHighlighter language={match[1]} useInlineStyles={false} PreTag="div" {...props} ref={useRef(null)}/> : <code className={className} {...props} ref={useRef(null)}/>
}

const Video = (props) => <YouTube {...props} ref={useRef(null)}/>

const GridGalleryItem = connect(state => state.Mobiler)(({src, title, index, dispatch}) =>
{
    useEffect(() => {dispatch(addLoader(src)) && dispatch(addImager(src))}, []);

    return <a href={src} className="image js-gallery-image" data-index={index}><img src={src} alt={title + ' - ' + ++index} onLoad={() => dispatch(load(src)) && dispatch(check())}/></a>
})

const GridGallery = connect(state => state.Mobiler)(({mobile, pictures, title, images, dispatch}) =>
{
    const ref = useRef(null), onRender = new Delayer(() => {Renderer.onScroll.call(); ref.current?._containerRef.current.classList.add('complite')}, 150);

    return <JustifiedGrid
        className="justified-gallery"
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
    const pictures = Object.values(list); return pictures.length ? <Lightbox plugins={[Zoom]} render={{buttonZoom: () => null}} open={index >= 0} slides={pictures} close={() => dispatch(close())} index={index}/> : null
})

export default connect(state => state.Mobiler)(({mobile, Context, dispatch}) =>
{
    const Content = Context.content.default, pic = useRef(null);

    useEffect(() =>
    {
        dispatch(action(Context.props?.action)); dispatch(list([{'Roboto Slab': false}, 'article', true]));

        document.body.classList.add(...['article-page', Context.props?.action === 'columnize' && !mobile && 'loading-after'].filter(v => v))
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
        !Context.props?.hide_picture ? <div className="article-page-picture" ref={pic} key="article-page-picture"><img src={Context.pictures[1]} alt={Context.name}/></div> : null
    ];

    Renderer.last = [
        <Tags article={Context} ref={useRef(null)} key="tags" className="article-tags"><li>{"© strng.pro " + new Date().getFullYear()}</li></Tags>
    ];

    Renderer.lb = <button ref={useRef(null)} className="arrow left" onClick={event => Renderer.turn(event, false)}></button>;
    Renderer.rb = <button ref={useRef(null)} className="arrow right active" onClick={event => Renderer.turn(event, true)}></button>;

    return <Layout articles={Context.articles}>
        <Wrapper component="main" reverse={Main} role="main" className="wrapper">
            <HorizontalWheel className={"container" + (Context.props?.action === 'columnize' ? " horizontal" : "")}>
                {import.meta.env.SSR ? Renderer.first.map(value => value) : null}
                <Content components={{code, Video, Sticker, GridGallery: (props) => <GridGallery pictures={Context.pictures} title={Context.name} {...props}/>}}/>
                {import.meta.env.SSR ? Renderer.last.map(value => value) : null}
            </HorizontalWheel>
        </Wrapper>
        <LightboxComponent type="lightbox"/>
    </Layout>;
})