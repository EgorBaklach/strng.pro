import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import {JustifiedGrid} from "@egjs/react-grid";
import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";

import Delayer from "../Plugins/Delayer.jsx";
import Renderer from "../Plugins/Renderer.jsx";

import Layout from "../Components/Layout.jsx";
import Slider from "../Components/Slider.jsx";
import Main from "../Components/Main.jsx";
import Tags from "../Components/Tags.jsx";

import {clean, close, insert} from "../Reducers/Imager.jsx";
import Wrapper from "../Components/Wrapper";

const LigthboxComponent = ({list, index, dispatch}) => list.length ? <Lightbox plugins={[Zoom]} render={{buttonZoom: () => null}} open={index >= 0} slides={list} close={() => dispatch(close())} index={index}/> : null

const LightboxConnected = connect(state => state.Imager)(LigthboxComponent)

const GridGallery = (props) =>
{
    const ref = useRef(null), onRender = new Delayer(() => ref.current?._containerRef.current.classList.add('complite'), 150);

    return <JustifiedGrid
        className="justified-gallery"
        useResizeObserver={true}
        gap={10}
        ref={ref}
        columnRange={[2,3]}
        isCroppedSize={true}
        onRenderComplete={event => onRender.call(event)}>
        {props.children}
    </JustifiedGrid>;
}

export default connect(state => state.Mobiler)(({mobile, Context, dispatch}) =>
{
    const Content = Context.content.default, ref = useRef(null);

    const onLoaded = new Delayer(() => {document.body.classList.add('images-ready'); !mobile && ref.current?.classList.remove('loading-after'); Renderer.onScrollize.call(); return true}, 250)

    const Picture = ({iteration, id}) =>
    {
        useEffect(() => {dispatch(insert({src: Context.pictures[id]}))}, []);

        return <div className={"box image" + (mobile ? " js-gallery-image" : "")} data-index={iteration}><img src={Context.pictures[id]} alt={Context.name + ' - ' + iteration} onLoad={() => onLoaded.call()}/></div>;
    };

    const ShowDetail = ({className}) =>
    {
        const [visibility, setVisibility] = useState([false, 'Читать']), click = () => setVisibility(visibility[0] ? [false, 'Читать'] : [true, 'Скрыть']);

        useEffect(() => visibility[0] ? document.body.classList.add('detail-show') : document.body.classList.remove('detail-show'), [visibility, mobile]);

        return <button onClick={click} className={className}>{visibility[1]}</button>;
    }

    const TagsContrainer = ({check, className}) => check && <Tags article={Context} ref={useRef(null)} key="tags" className={className}><li>{"© strng.pro " + new Date().getFullYear()}</li></Tags>;

    useEffect(() => {document.body.classList.add('article-page', 'gallery'); !mobile && ref.current?.classList.add('loading-after'); return () => dispatch(clean()) && dispatch(close())}, [mobile, Context.url]);

    return <Layout articles={Context.articles}>
        <Main role="main" className="wrapper" ref={ref}>
            <ShowDetail className="detail-btn"/><Link to="/" className="mobile-home-icon"></Link>
            <Wrapper component="div" className="detail">
                <div className="breadcrumbs" ref={useRef(null)} key="breadcrumbs">
                    <ul>
                        <li><Link to="/" title="Главная">Главная</Link></li>
                        <li><Link to="/gallery/" title="Фотографии">Фотографии</Link></li>
                        <li className="current"><span>{Context.name}</span></li>
                    </ul>
                </div>
                <h1 className="page-title">{Context.name}</h1>
                <Content/>
                <TagsContrainer check={!mobile} className="article-tags"/>
            </Wrapper>
            <Slider component={GridGallery} url={Context.url} key={'album-' + Context.id} onLoaded={() => onLoaded.call()}>
                {Object.keys(Context.pictures).map((id, iteration) => <Picture iteration={iteration} id={id} key={id}/>)}
            </Slider>
            <TagsContrainer check={mobile} className="article-tags tags-bottom"/>
        </Main>
        <LightboxConnected type="lightbox"/>
    </Layout>;
})