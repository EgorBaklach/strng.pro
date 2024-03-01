import {Fragment, useEffect, useRef} from "react";
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

import {clean, close, insert} from "../Reducers/Imager.jsx";

const code = ({className, ...props}) =>
{
    const match = /language-(\w+)/.exec(className || '');

    return match ? <SyntaxHighlighter language={match[1]} useInlineStyles={false} PreTag="div" {...props} ref={useRef(null)}/> : <code className={className} {...props} ref={useRef(null)}/>
}

const Video = (props) => <YouTube {...props} ref={useRef(null)}/>

const GridGalleryItem = function({src, title, iteration, insert})
{
    useEffect(() => {insert({src})}, []); return <div className="image js-gallery-image" data-index={iteration}><img src={src} alt={title + ' - ' + iteration} /></div>
}

const GridGallertItemConnected = connect(null, {insert: slide => dispatch => dispatch(insert(slide))})(GridGalleryItem)

const GridGallery = ({mobile, pictures, title, images, clean}) =>
{
    const ref = useRef(null), onRender = new Delayer(() => (() => true)(Renderer.onScrollize.call()) && ref.current?._containerRef.current.classList.add('complite'), 150);

    useEffect(() => clean, [])

    return <JustifiedGrid
        className="justified-gallery"
        useResizeObserver={true}
        gap={10}
        ref={ref}
        columnRange={mobile ? [2,3] : [3,5]}
        isCroppedSize={true}
        onRenderComplete={event => onRender.call(event)}>
        {images.map((id, iteration) => <GridGallertItemConnected key={pictures[id]} iteration={iteration} src={pictures[id]} title={title} />)}
    </JustifiedGrid>
}

const GridGalleryConnected = connect(state => state.Mobiler, {clean: () => dispatch => dispatch(clean())})(GridGallery)

const LigthboxComponent = ({list, index, close}) => list.length ? <Lightbox plugins={[Zoom]} render={{buttonZoom: () => null}} open={index >= 0} slides={list} close={close} index={index}/> : null

const LightboxConnected = connect(state => state.Imager, {close: () => dispatch => dispatch(close())})(LigthboxComponent)

export default connect(state => state.Mobiler)(({mobile, Context}) =>
{
    const Content = Context.content.default, pic = useRef(null); useEffect(() => document.body.classList.add('article-page'), [mobile, Context.url]);

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
            <HorizontalWheel className={"container" + (Context.props?.horizontal ? " horizontal" : "")}>
                {import.meta.env.SSR || !Context.props?.horizontal ? Renderer.first.map(value => value) : null}
                <Content components={{code, Video, GridGallery: (props) => <GridGalleryConnected pictures={Context.pictures} title={Context.name} {...props}/>}}/>
                {import.meta.env.SSR || !Context.props?.horizontal ? Renderer.last.map(value => value) : null}
            </HorizontalWheel>
        </Wrapper>
        <LightboxConnected type="lightbox"/>
    </Layout>;
})