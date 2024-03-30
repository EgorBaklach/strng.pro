import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {useEffect} from "react";

import Renderer from "../Plugins/Renderer.jsx";

import Layout from "../Components/Layout.jsx";
import Wrapper from "../Components/Wrapper.jsx";
import HorizontalWheel from "../Components/HorizontalWheel.jsx";
import Main from "../Components/Main.jsx";
import Social from "../Components/Social.jsx";

const MainGridBox = ({iterator, article, hidden}) =>
{
    let boxClass = ''

    if(iterator%14 === 0 || iterator%14 === 9) boxClass = ' large'
    if(iterator%14 === 2 || iterator%14 === 7) boxClass = ' wide'
    if(iterator%14 === 4 || iterator%14 === 13) boxClass = ' tall'

    if(hidden) boxClass += ' mobile-visible';

    return <div className={'box' + boxClass}>
        <Link to={"/blog/" + article.slug + '/'} className="picture" onDragStart={e => e.preventDefault()}><img src={article.pictures[1]} alt={article.name}/></Link>
        <div className="wrapper">
            <div className="date">{article.date}</div>
            <div className="title">{article.name}</div>
            <Social article={article} key={"social-" + article.id}/>
        </div>
    </div>
}

export default connect(state => state.Mobiler)(({Context, mobile}) =>
{
    useEffect(() => {document.body.classList.add('index'); Renderer.onScroll.call()}, [mobile]);

    const aids = Object.keys(Context.articles), module = aids.length % 7, correctLength = aids.length - (module >= 4 ? module - 4 : module);

    return <Layout articles={Context.articles}>
        <Wrapper component="main" reverse={Main} role="main" className="wrapper">
            <Link to="/" className="mobile-home-icon"></Link>
            <div className="chat-icon" onClick={() => document.body.classList.toggle('chat-active')}></div>
            <HorizontalWheel className="main-grid">
                {aids.map((id, iterator) => <MainGridBox iterator={iterator} article={Context.articles[id]} key={id} hidden={iterator >= correctLength}/>)}
                <div className="box copyrights">
                    <div className="wrapper">
                        <div className="date">© strng.pro {new Date().getFullYear()}</div>
                    </div>
                </div>
            </HorizontalWheel>
        </Wrapper>
    </Layout>;
});