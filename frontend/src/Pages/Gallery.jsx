import {Link} from "react-router-dom";
import {useEffect, useRef} from "react";
import {connect} from "react-redux";

import Delayer from "../Plugins/Delayer.jsx";
import Renderer from "../Plugins/Renderer.jsx";

import Layout from "../Components/Layout.jsx"
import Slider from "../Components/Slider.jsx";
import Main from "../Components/Main.jsx";

const Album = ({album, onLoaded}) =>
{
    const delay = new Delayer(() => Renderer.async = false, 50);

    const events = {
        onDragStart: e => e.preventDefault(),
        onClick: e => Renderer.async ? e.preventDefault() : true,
        onMouseUp: () => delay.call(),
        onTouchEnd: () => delay.call()
    };

    return <Link to={"/blog/" + album.slug + '/'} className="box large" {...events}>
        <img src={album.pictures[1]} alt={album.name} onLoad={() => onLoaded.call()}/>
        <div className="wrapper">
            <div className="date">{album.date}</div>
            <div className="title">{album.name}</div>
            <div className="social">
                <ul>
                    <li className="likes">{album.cnt_likes}</li>
                    <li className="views">{album.cnt_views}</li>
                    <li className="comments">{album.cnt_comments}</li>
                </ul>
            </div>
        </div>
    </Link>;
}

export default connect(state => state.Mobiler)(({mobile, Context}) =>
{
    const ref = useRef(null), onLoaded = new Delayer(() => {document.body.classList.add('images-ready'); !mobile && ref.current?.classList.remove('loading-after'); return true}, 250);

    useEffect(() => {document.body.classList.add('gallery'); !mobile && ref.current?.classList.add('loading-after')}, [mobile, Context.url]);

    return <Layout articles={Context.articles}>
        <Main role="main" className="wrapper" ref={ref}>
            <Link to="/" className="mobile-home-icon"></Link>
            <h1 className="page-title show-mobile">Фотографии</h1>
            <Slider url={Context.url} key="gallery" onLoaded={() => onLoaded.call()}>
                {Object.keys(Context.gallery).slice(0, 11).map((id) => <Album album={Context.gallery[id]} key={'gallery-' + id} onLoaded={onLoaded}/>)}
            </Slider>
            <div className="box copyrights">
                <div className="wrapper">
                    <div className="date">© strng.pro {new Date().getFullYear()}</div>
                </div>
            </div>
        </Main>
    </Layout>;
})