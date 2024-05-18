import {Link} from "react-router-dom"
import {connect} from "react-redux";
import {useEffect} from "react"

import Renderer from "../Plugins/Renderer.jsx";

import Wrapper from "../Components/Wrapper.jsx"
import Layout from "../Components/Layout.jsx";
import Main from "../Components/Main.jsx";
import ArticleItem from "../Components/ArticleItem.jsx";

export default connect(state => state.Mobiler)(({mobile, Context}) =>
{
    // TODO Выводи все теги списком с колвом публикаций в виде облака тегов

    useEffect(() => {document.body.classList.add(...['article-page', !mobile && 'chat-active'].filter(v => v)); Renderer.onScroll.call()}, [mobile, Context.tag.slug])

    return <Layout articles={Context.articles}>
        <Wrapper component="main" reverse={Main} role="main" className="wrapper">
            <div className="container">
                <Link to="/" className="mobile-home-icon"></Link>
                <div className="breadcrumbs">
                    <ul>
                        <li><Link to="/" title="Главная">Главная</Link></li>
                        <li><Link to="/blog/" title="Блог">Блог</Link></li>
                        <li className="current"><span>{Context.tag.name}</span></li>
                    </ul>
                </div>
                <h1 className="page-title">{Context.tag.name}</h1>
                <div className="chat-icon" onClick={() => document.body.classList.toggle('chat-active')}></div>
                {Object.keys(Context.tag.articles).map(slug => <ArticleItem key={slug} like={Context.likes[Context.tag.articles[slug].id]} uid={Context.uid} article={Context.tag.articles[slug]}/>)}
                <div className="article-item last">© strng.pro {new Date().getFullYear()}</div>
            </div>
        </Wrapper>
    </Layout>
})