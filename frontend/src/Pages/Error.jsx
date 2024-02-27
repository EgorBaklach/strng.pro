import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {useEffect} from "react";

import Layout from "../Components/Layout";
import Wrapper from "../Components/Wrapper.jsx";

export default connect(state => state.Mobiler)(({mobile, Context}) =>
{
    const Content = Context.content.default; useEffect(() => document.body.classList.add('article-page'), [mobile, Context.url])

    return <Layout articles={Context.articles}>
        <Wrapper component="main" role="main" className="wrapper">
            <div className="container">
                <Link to="/" className="mobile-home-icon"></Link>
                <div className="breadcrumbs">
                    <ul>
                        <li><Link to="/" title="Главная">Главная</Link></li>
                        <li className="current"><span>404</span></li>
                    </ul>
                </div>
                <h1 className="page-title">404 NOT FOUND</h1>
                <Content/>
            </div>
        </Wrapper>
    </Layout>;
})