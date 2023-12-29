import {useEffect, useRef} from "react"
import Scrollbar from "./Scrollbar"

export default (props) =>
{
    const ref = useRef(null), scroll = (top) => top > 0 ? document.body.classList.add('is-scroll') : document.body.classList.remove('is-scroll')

    useEffect(() => scroll(ref.current !== null ? ref.current.scrollTop : 0), []);

    return <Scrollbar {...props} onScroll={(event) => ref.current !== null && scroll(event.currentTarget.scrollTop)} ref={ref} />
}