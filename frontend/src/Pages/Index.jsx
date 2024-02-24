import {Link} from "react-router-dom";

import Layout from "../Components/Layout.jsx";
import Wrapper from "../Components/Wrapper.jsx";
import HorizontalWheel from "../Components/HorizontalWheel.jsx";

const MainGridBox = ({iterator, article}) =>
{
    let boxClass = ''

    if(iterator%14 === 0 || iterator%14 === 9) boxClass = ' grid-box-large'
    if(iterator%14 === 2 || iterator%14 === 7) boxClass = ' grid-box-wide'
    if(iterator%14 === 4 || iterator%14 === 13) boxClass = ' grid-box-tall'

    return <div className={'main-grid-box' + boxClass}>
        <Link to={"/blog/" + article.slug + '/'} className="grid-box-picture" onDragStart={() => false}><img src={article.pictures[1]} alt={article.name}/></Link>
        <div className="grid-bow-wrapper">
            <div className="grid-box-date">{article.date}</div>
            <div className="grid-box-title">{article.name}</div>
            <div className="grid-box-social">
                <ul>
                    <li className="box-social-likes">{article.cnt_likes}</li>
                    <li className="box-social-views">{article.cnt_views}</li>
                    <li className="box-social-comments">{article.cnt_comments}</li>
                </ul>
            </div>
        </div>
    </div>
}

export default ({Context}) =>
{
    return <Layout articles={Context.articles}>
        <Wrapper component="main" role="main" className="wrapper">
            <Link to="/" className="mobile-home-icon"></Link>
            <HorizontalWheel className="main-grid">
                {Object.keys(Context.articles).slice(0, 11).map((id, iterator) => <MainGridBox iterator={iterator} article={Context.articles[id]} key={id}/>)}
                {Object.keys(Context.articles).slice(0, 11).map((id, iterator) => <MainGridBox iterator={iterator} article={Context.articles[id]} key={id}/>)}
                <div className="main-grid-box grid-box-copyrights">
                    <div className="grid-bow-wrapper">
                        <div className="grid-box-date">© strng.pro {new Date().getFullYear()}</div>
                    </div>
                </div>
            </HorizontalWheel>
        </Wrapper>
    </Layout>;
}