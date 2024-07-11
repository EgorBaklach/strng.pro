import {createElement, memo} from "react";
import {connect} from "react-redux";

import Stream from "../Actions/Stream.jsx";
import Social from "../Actions/Social.jsx";

const elSocials = {
    likes: connect(null, Stream)(({id, active, className, children, loaded, subscribe}) => {
        return createElement('li', {
            className: className + active,
            ...(loaded && {onClick: e => {e.preventDefault(); subscribe('likes' + id, props => Social.update('likes', id, children, active.length ? -1 : 1, ...props))}})
        }, children);
    }),
    default: memo(({className, children}) => <li className={className}>{children}</li>, (p, n) => p.children === n.children)
};

export default connect(state => state.Socier)(memo(({id, social, loaded, socials, likes}) => {
    return <div className="social">
        <ul>{Object.entries(social).map(([k, v]) => createElement(elSocials[k] ?? elSocials.default, {
            id,
            loaded,
            key: id + '-' + k,
            className: k,
            active: likes[id] ? ' active' : ''
        }, (socials[id]?.[k] ?? v) * 1))}</ul>
    </div>
}, (p, n) => p.loaded === n.loaded && p.socials[p.id]?.likes === n.socials[n.id]?.likes && p.socials[p.id]?.visits === n.socials[n.id]?.visits && p.socials[p.id]?.comments === n.socials[n.id]?.comments));