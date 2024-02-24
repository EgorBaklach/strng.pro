import {createElement, useEffect, useRef} from "react"
import {connect} from "react-redux";

import Scrollbar from "./Scrollbar"

export default connect(state => state.Mobiler)(({mobile, className, component, children, role}) =>
{
    const ref = useRef(null), scroll = (top) => top > 0 ? document.body.classList.add('is-scroll') : document.body.classList.remove('is-scroll'); useEffect(() => scroll(ref.current?.scrollTop || 0), []);

    return createElement(!mobile ? Scrollbar : component, {component, className, role, ...(mobile ? {onScroll: event => scroll(event.currentTarget.scrollTop), ref} : {})}, children);
});