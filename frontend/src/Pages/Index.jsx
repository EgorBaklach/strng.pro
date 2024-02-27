import {Link} from "react-router-dom";
import {useEffect} from "react";

import Layout from "../Components/Layout.jsx";
import Wrapper from "../Components/Wrapper.jsx";
import HorizontalWheel from "../Components/HorizontalWheel.jsx";

const MainGridBox = ({iterator, article}) =>
{
    let boxClass = ''

    if(iterator%14 === 0 || iterator%14 === 9) boxClass = ' large'
    if(iterator%14 === 2 || iterator%14 === 7) boxClass = ' wide'
    if(iterator%14 === 4 || iterator%14 === 13) boxClass = ' tall'

    return <div className={'box' + boxClass}>
        <Link to={"/blog/" + article.slug + '/'} className="picture" onDragStart={e => e.preventDefault()}><img src={article.pictures[1]} alt={article.name}/></Link>
        <div className="wrapper">
            <div className="date">{article.date}</div>
            <div className="title">{article.name}</div>
            <div className="social">
                <ul>
                    <li className="likes">{article.cnt_likes}</li>
                    <li className="views">{article.cnt_views}</li>
                    <li className="comments">{article.cnt_comments}</li>
                </ul>
            </div>
        </div>
    </div>
}

export default ({Context}) =>
{
    useEffect(() => document.body.classList.add('index'), []);

    return <Layout articles={Context.articles}>
        <Wrapper component="main" role="main" className="wrapper">
            <Link to="/" className="mobile-home-icon"></Link>
            <HorizontalWheel className="main-grid">
                {Object.keys(Context.articles).slice(0, 11).map((id, iterator) => <MainGridBox iterator={iterator} article={Context.articles[id]} key={id}/>)}
                <div className="box copyrights">
                    <div className="wrapper">
                        <div className="date">© strng.pro {new Date().getFullYear()}</div>
                    </div>
                </div>
            </HorizontalWheel>
        </Wrapper>
    </Layout>;
}