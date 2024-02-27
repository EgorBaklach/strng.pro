import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

import Layout from "../Components/Layout"
import Wrapper from "../Components/Wrapper.jsx";
import Slider from "../Components/Slider";
import {connect} from "react-redux";
import Delayer from "../Plugins/Delayer.jsx";

const Album = ({skip, setSkip, album}) =>
{
    const delay = new Delayer(() => setSkip(false), 50);

    const events = {
        onDragStart: e => e.preventDefault(),
        onClick: e => skip ? e.preventDefault() : true,
        onMouseUp: () => delay.call(),
        onTouchEnd: () => delay.call()
    };

    return <Link to={"/blog/" + album.slug + '/'} className="box large" {...events}>
        <img src={album.pictures[1]} alt={album.name}/>
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
    const [skip, setSkip] = useState(false); useEffect(() => document.body.classList.add('gallery'), [mobile, Context.url]);

    return <Layout articles={Context.articles}>
        <Wrapper component="main" role="main" className="wrapper">
            <Link to="/" className="mobile-home-icon"></Link>
            <h1 className="page-title show-mobile">Фотографии</h1>
            <Slider setSkip={setSkip}>{Object.keys(Context.gallery).slice(0, 11).map((id) => <Album album={Context.gallery[id]} key={id} skip={skip} setSkip={setSkip}/>)}</Slider>
            <div className="box copyrights">
                <div className="wrapper">
                    <div className="date">© strng.pro {new Date().getFullYear()}</div>
                </div>
            </div>
        </Wrapper>
    </Layout>;
})