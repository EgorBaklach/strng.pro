import {Link} from "react-router-dom"
import {connect} from "react-redux";
import {useEffect} from "react"

import Tags from "../Components/Tags"
import Wrapper from "../Components/Wrapper"
import Layout from "../Components/Layout";

const ArticleItem = ({article}) =>
{
    return <div className="article-item box">
        <h2 className="name"><Link to={'/blog/' + article.slug + '/'}>{article.name}</Link></h2>
        <Link to={'/blog/' + article.slug + '/'} className="picture">
            <img src={article.pictures[1]} alt={article.name}/>
            <div className="social">
                <ul>
                    <li className="likes">{article.cnt_likes}</li>
                    <li className="views">{article.cnt_views}</li>
                    <li className="comments">{article.cnt_comments}</li>
                </ul>
            </div>
        </Link>
        <div className="preview">{article.announce}</div>
        <Tags article={article}>
            <Link to={'/blog/' + article.slug + '/'} className="link detail">Подробнее...</Link>
        </Tags>
    </div>
}

export default connect(state => state.Mobiler)(({mobile, Context}) =>
{
    useEffect(() => document.body.classList.add('article-page'), [mobile])

    return <Layout articles={Context.articles}>
        <Wrapper component="main" role="main" className="wrapper">
            <div className="container">
                <Link to="/" className="mobile-home-icon"></Link>
                <div className="breadcrumbs">
                    <ul>
                        <li><Link to="/" title="Главная">Главная</Link></li>
                        <li className="current"><span>Блог</span></li>
                    </ul>
                </div>
                <h1 className="page-title">Блог</h1>
                {Object.keys(Context.articles).map((id) => <ArticleItem key={id} article={Context.articles[id]}/>)}
                <div className="article-item last">© strng.pro {new Date().getFullYear()}</div>
            </div>
        </Wrapper>
    </Layout>
})