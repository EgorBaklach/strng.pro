import {Link, NavLink} from "react-router-dom";
import {createElement, Fragment} from "react";
import {connect} from "react-redux";

import Scrollbar from "./Scrollbar.jsx";

const ScrollbarConnect = connect(state => state.Mobiler)(({mobile, children, component}) => createElement(!mobile ? Scrollbar : component, {component}, children));

const NavItem = ({article, i, limit}) => <li className={i >= limit ? 'mobile-visible' : ''}><NavLink to={'/blog/' + article.slug + '/'}>{article.name}</NavLink></li>

const Navigation = ({articles, children}) => <nav className="menu" role="navigation">{articles && children}</nav>;

export default ({children, articles}) =>
    <Fragment>
        <aside key="complementary" role="complementary" className="header">
            <ScrollbarConnect component="header" type="header">
                <section className="header-fields">
                    <Link to="/" className="logo"></Link>
                    <Navigation articles={articles}>
                        <ul>
                            <li>
                                <Link to="/gallery/">Фотографии</Link>
                                <ul>
                                    {Object.keys(articles ?? {}).filter((id) => articles[id].props?.is_gallery).slice(0, 7).map((id, i) => <NavItem article={articles[id]} key={id} i={i} limit="3"/>)}
                                </ul>
                            </li>
                            <li>
                                <Link to="/blog/">Блог</Link>
                                <ul>
                                    {Object.keys(articles ?? {}).filter((id) => !articles[id].props?.is_gallery).slice(0, 7).map((id, i) => <NavItem article={articles[id]} key={id} i={i} limit="4"/>)}
                                </ul>
                            </li>
                            <li>
                                <Link to="/about/">О проекте</Link>
                                <ul>
                                    <li><NavLink to="/about/stock/">Склад</NavLink></li>
                                </ul>
                            </li>
                        </ul>
                    </Navigation>
                    <div className="social">
                        <ul>
                            <li className="pegi"></li>
                            <li className="vk"><a href="//vk.com/strong_elephant" target="_blank"></a></li>
                            <li className="inst"><a href="//instagram.com/exp.achtung/" target="_blank"></a></li>
                            <li className="yt"><a href="//www.youtube.com/channel/UCgmByMVXw18Ahjr1wwSOKPw" target="_blank"></a></li>
                        </ul>
                    </div>
                </section>
            </ScrollbarConnect>
            <div className="header-mobile-hamburger" onClick={() => document.body.classList.toggle('header-mobile-open')}><span/></div>
        </aside>
        {children}
    </Fragment>