import {connect} from "react-redux";
import {createElement, memo} from "react";
import Actions from "../Actions/Article";

const elSocials = {
    likes: connect(null, Actions)(({id, active, className, children, socket, uid}) => <li className={className + active} onClick={() => socket('likes', uid, id, children, active.length ? -1 : 1)}>{children}</li>),
    default: ({className, children}) => <li className={className}>{children}</li>
};

export default connect(state => state.Socier)(memo(({id, social, socials, like, uid, likes}) =>
    <div className="social">
        <ul>{Object.entries(social).map(([k, v]) => createElement(elSocials[k] ?? elSocials.default, {
            id,
            uid,
            key: id + '-' + k,
            className: k,
            active: likes[uid]?.[id] ?? like ? ' active' : ''
        }, (socials[id]?.[k] ?? v)*1))}</ul>
    </div>, (p, n) => p.socials[p.id]?.likes === n.socials[n.id]?.likes && p.socials[p.id]?.views === n.socials[n.id]?.views && p.socials[p.id]?.comments === n.socials[n.id]?.comments));