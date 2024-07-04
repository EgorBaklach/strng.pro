import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import {JustifiedGrid} from "@egjs/react-grid";
import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";

import Delayer from "../Plugins/Delayer.jsx";
import Renderer from "../Plugins/Renderer.jsx";

import Wrapper from "../Components/Wrapper.jsx";
import Layout from "../Components/Layout.jsx";
import Slider from "../Components/Slider.jsx";
import Main from "../Components/Main.jsx";
import Tags from "../Components/Tags.jsx";

import Imager from "../Reducers/Imager.jsx";
import Loader from "../Reducers/Loader.jsx";

import Stream from "../Actions/Stream.jsx";
import Social from "../Actions/Social.jsx";

const LightboxComponent = connect(state => state.Imager)(({list, index, dispatch}) =>
{
    const pictures = Object.values(list); return pictures.length ? <Lightbox plugins={[Zoom]} render={{buttonZoom: () => null}} open={index >= 0} slides={pictures} close={() => dispatch(Imager.actions.close())} index={index}/> : null
});

const GridGallery = ({children}) =>
{
    const ref = useRef(null), onRender = new Delayer(() =>
    {
        const classList = ref.current._containerRef.current.classList; classList.add('complite'); classList.remove('loading-after'); Renderer.onScroll.call();
    }, 150);

    return <JustifiedGrid
        className="justified-gallery loading-after"
        useResizeObserver={true}
        gap={10}
        ref={ref}
        columnRange={[2,3]}
        isCroppedSize={true}
        onRenderComplete={event => ref.current?._containerRef && onRender.call(event)}>
        {children}
    </JustifiedGrid>;
}

export default connect(state => state.Mobiler, {dispatch: action => dispatch => dispatch(action), ...Stream})(({mobile, Context, dispatch, subscribe}) =>
{
    const Content = Context.content.default; useEffect(() => {subscribe('visits' + Context.id, props => Social.update('visits', Context.id, Context.cnt_visits, 1, ...props))}, [Context.url]);

    const Picture = ({iteration, id}) =>
    {
        useEffect(() => {dispatch(Loader.actions.add(Context.pictures[id])) && dispatch(Imager.actions.add(Context.pictures[id]))}, []);

        return <div className={"box image" + (mobile ? " js-gallery-image" : "")} data-index={iteration}>
            <img src={Context.pictures[id] + '?stamp=' + Math.floor(Date.now()/1000)} alt={Context.name + ' - ' + iteration} onLoad={() => dispatch(Loader.actions.load(Context.pictures[id])) && dispatch(Loader.actions.check())}/>
        </div>;
    };

    const ShowDetail = ({className}) =>
    {
        const [visibility, setVisibility] = useState([false, 'Читать']), click = () => setVisibility(visibility[0] ? [false, 'Читать'] : [true, 'Скрыть']);

        useEffect(() => visibility[0] ? document.body.classList.add('detail-show') : document.body.classList.remove('detail-show'), [visibility, mobile]);

        return <button onClick={click} className={className}>{visibility[1]}</button>;
    }

    const TagsContrainer = ({check, className}) => check && <Tags article={Context} ref={useRef(null)} key="tags" className={className}><li>{"© strng.pro " + new Date().getFullYear()}</li></Tags>;

    useEffect(() =>
    {
        dispatch(Loader.actions.action('sliderInit')); document.body.classList.add(...['article-page', 'gallery', !mobile && 'loading-after'].filter(v => v));

        return () => dispatch(Imager.actions.clean()) && dispatch(Imager.actions.close())
    }, [mobile, Context.url]);

    return <Layout articles={Context.articles}>
        <Main role="main" className="wrapper" ref={useRef(null)}>
            <ShowDetail className="detail-btn"/>
            <Link to="/" className="mobile-home-icon"></Link>
            <div className="chat-icon" onClick={() => document.body.classList.toggle('chat-active')}></div>
            <Wrapper component="div" className="detail" role="album">
                <div className="breadcrumbs" ref={useRef(null)} key="breadcrumbs">
                    <ul>
                        <li><Link to="/" title="Главная">Главная</Link></li>
                        <li><Link to="/gallery/" title="Фотографии">Фотографии</Link></li>
                        <li className="current"></li>
                    </ul>
                </div>
                <h1 className="page-title">{Context.name}</h1>
                <Content/>
                <TagsContrainer check={!mobile} className="article-tags"/>
            </Wrapper>
            <Slider component={GridGallery} url={Context.url} key={'album-' + Context.id}>
                {Object.keys(Context.pictures).map((id, iteration) => <Picture iteration={iteration} id={id} key={id}/>)}
            </Slider>
            <TagsContrainer check={mobile} className="article-tags tags-bottom"/>
        </Main>
        <LightboxComponent type="lightbox"/>
    </Layout>;
})