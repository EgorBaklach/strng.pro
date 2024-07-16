import {Link, NavLink} from "react-router-dom";
import {Fragment} from "react";

import Wrapper from "./Wrapper.jsx";

const NavItem = ({article, i, limit}) => <li className={i >= limit ? 'mobile-visible' : ''}><NavLink to={'/blog/' + article.slug + '/'}>{article.name}</NavLink></li>

const Navigation = ({articles, children}) => <nav className="menu" role="navigation">{articles && children}</nav>;

export default ({children, articles}) =>
    <Fragment>
        <aside key="complementary" role="complementary" className="header">
            <Wrapper component="header" role="header">
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
                            <li className="tg"><a href="//t.me/Devexp" target="_blank"></a></li>
                            <li className="yt"><a href="//www.youtube.com/channel/UCgmByMVXw18Ahjr1wwSOKPw" target="_blank"></a></li>
                        </ul>
                    </div>
                </section>
            </Wrapper>
            <div className="header-mobile-hamburger" onClick={() => document.body.classList.toggle('header-mobile-open')}><span/></div>
        </aside>
        {children}
    </Fragment>;