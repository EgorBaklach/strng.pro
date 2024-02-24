import {Link, NavLink} from "react-router-dom"
import {createElement, Fragment} from "react"
import {connect} from "react-redux";

import Scrollbar from "./Scrollbar";

const ScrollbarConnect = connect(state => state.Mobiler)(({mobile, children, component}) => createElement(!mobile ? Scrollbar : component, {component}, children));

export default ({children, articles}) =>
    <Fragment>
        <aside key="complementary" role="complementary" className="header">
            <ScrollbarConnect component="header" type="header">
                <section className="header-fields">
                    <Link to="/" className="logo"></Link>
                    <nav className="menu" role="navigation">
                        <ul>
                            <li>
                                <NavLink end to="/gallery/">Фотографии</NavLink>
                                <ul>
                                    {
                                        Object.keys(articles).filter((id) => articles[id].props?.is_gallery).slice(0, 7).map((id, i) =>
                                            <li key={id} className={i > 3 ? 'mobile-visible' : ''}><NavLink to={'/blog/' + articles[id].slug + '/'}>{articles[id].name}</NavLink></li>)
                                    }
                                </ul>
                            </li>
                            <li>
                                <NavLink end to="/blog/">Блог</NavLink>
                                <ul>
                                    {
                                        Object.keys(articles).filter((id) => !articles[id].props?.is_gallery).slice(0, 7).map((id, i) =>
                                            <li key={id} className={i > 3 ? 'mobile-visible' : ''}><NavLink to={'/blog/' + articles[id].slug + '/'}>{articles[id].name}</NavLink></li>)
                                    }
                                </ul>
                            </li>
                            <li>
                                <NavLink end to="/stock/">Склад</NavLink>
                            </li>
                            <li>
                                <NavLink end to="/about/">О проекте</NavLink>
                            </li>
                        </ul>
                    </nav>
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