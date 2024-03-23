import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {Fragment, useEffect} from "react";

import Renderer from "../Plugins/Renderer.jsx";

import Layout from "../Components/Layout.jsx";
import Wrapper from "../Components/Wrapper.jsx";
import Main from "../Components/Main.jsx";

export default connect(state => state.Mobiler)(({mobile, Context, chain, title}) =>
{
    const Content = Context.content?.default || (() => <Fragment/>);

    useEffect(() => {document.body.classList.add(...['article-page', !mobile && 'chat-active'].filter(v => v)); Renderer.onScroll.call()}, [mobile, Context.url])

    return <Layout articles={Context.articles}>
        <Wrapper component="main" reverse={Main} role="main" className="wrapper">
            <div className="container">
                <Link to="/" className="mobile-home-icon"></Link>
                <div className="breadcrumbs">
                    <ul>
                        <li><Link to="/" title="Главная">Главная</Link></li>
                        <li className="current"><span>{chain}</span></li>
                    </ul>
                </div>
                <h1 className="page-title">{title}</h1>
                <div className="chat-icon" onClick={() => document.body.classList.toggle('chat-active')}></div>
                <Content/>
            </div>
        </Wrapper>
    </Layout>;
})