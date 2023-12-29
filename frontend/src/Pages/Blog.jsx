import {Link} from "react-router-dom"
import {useEffect} from "react"
import Tags from "../Components/Tags"
import Wrapper from "../Components/Wrapper"
import Layout from "../Components/Layout";

const ArticleItem = ({article}) =>
{
    return <div className="article-item">
        <h2 className="article-item-name"><Link to={'/blog/' + article.slug + '/'}>{article.name}</Link></h2>
        <div className="article-item-preview">{article.announce}</div>
        <Tags article={article}>
            <Link to={'/blog/' + article.slug + '/'} className="article-item-link article-item-detail">Подробнее...</Link>
        </Tags>
    </div>
}

export default ({Context}) =>
{
    useEffect(() => {document.body.classList.add('article-page')}, [])

    return <Layout articles={Context.articles}>
        <Wrapper component="main" role="main" className="wrapper">
            <div className="article-wrapper">
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
}