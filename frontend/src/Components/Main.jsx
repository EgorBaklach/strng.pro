import {forwardRef, useEffect, useRef} from "react";
import {connect} from "react-redux";

export default connect(states => states.Mobiler, null, null, {forwardRef: true})(forwardRef(({mobile, dispatch, ...props}, ref) =>
{
    const currentRef = ref ?? useRef(null), scroll = (top) => top > 0 ? document.body.classList.add('is-scroll') : document.body.classList.remove('is-scroll');

    useEffect(() => scroll(currentRef.current?.scrollTop || 0), [mobile]);

    return <main {...props} ref={currentRef} onScroll={e => scroll(e.currentTarget.scrollTop)}/>
}));