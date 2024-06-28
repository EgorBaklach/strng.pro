import {Link} from "react-router-dom";
import {useEffect, useRef} from "react";
import {connect} from "react-redux";

import Delayer from "../Plugins/Delayer.jsx";
import Renderer from "../Plugins/Renderer.jsx";

import Layout from "../Components/Layout.jsx"
import Slider from "../Components/Slider.jsx";
import Social from "../Components/Social.jsx";
import Main from "../Components/Main.jsx";

import Loader from "../Reducers/Loader.jsx";

const Album = ({item, dispatch}) =>
{
    const delay = new Delayer(() => Renderer.async = false, 50);

    useEffect(() => {dispatch(Loader.actions.add(item.pictures[1]))}, []);

    const events = {
        onDragStart: e => e.preventDefault(),
        onClick: e => Renderer.async ? e.preventDefault() : true,
        onMouseUp: () => delay.call(),
        onTouchEnd: () => delay.call()
    };

    return <Link to={"/blog/" + item.slug + '/'} className="box large" {...events}>
        <img src={item.pictures[1] + '?stamp=' + Math.floor(Date.now()/5000)} alt={item.name} onLoad={() => dispatch(Loader.actions.load(item.pictures[1])) && dispatch(Loader.actions.check())}/>
        <div className="wrapper">
            <div className="date">{item.date}</div>
            <div className="title">{item.name}</div>
            <Social social={{likes: item.cnt_likes, visits: item.cnt_visits, comments: item.cnt_comments}} id={item.id} key={"social-" + item.id}/>
        </div>
    </Link>;
}

export default connect(state => state.Mobiler)(({mobile, Context, dispatch}) =>
{
    useEffect(() => {dispatch(Loader.actions.action('sliderInit')); document.body.classList.add(...['gallery', !mobile && 'loading-after'].filter(v => v))}, [mobile, Context.url]);

    return <Layout articles={Context.articles}>
        <Main role="main" className="wrapper" ref={useRef(null)}>
            <Link to="/" className="mobile-home-icon"></Link>
            <h1 className="page-title show-mobile">Фотографии</h1>
            <div className="chat-icon" onClick={() => document.body.classList.toggle('chat-active')}></div>
            <Slider url={Context.url} key="gallery">
                {Object.keys(Context.gallery).slice(0, 11).map(id => <Album item={Context.gallery[id]} dispatch={dispatch} key={'gallery-' + id}/>)}
            </Slider>
            <div className="box copyrights">
                <div className="wrapper">
                    <div className="date">© strng.pro {new Date().getFullYear()}</div>
                </div>
            </div>
        </Main>
    </Layout>;
})