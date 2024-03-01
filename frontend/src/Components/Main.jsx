import {forwardRef, useEffect, useRef} from "react";

export default forwardRef((props, ref) =>
{
    const currentRef = ref ?? useRef(null), scroll = (top) => top > 0 ? document.body.classList.add('is-scroll') : document.body.classList.remove('is-scroll'); useEffect(() => scroll(currentRef.current?.scrollTop || 0), []);

    return <main {...props} ref={currentRef} onScroll={e => scroll(e.currentTarget.scrollTop)}/>
});