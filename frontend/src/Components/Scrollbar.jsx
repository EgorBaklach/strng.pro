import {createElement, forwardRef, useEffect, useRef} from "react"
import PerfectScrollbar from "react-perfect-scrollbar";
import useResize from "../Hooks/useResize.jsx";

const CustomPerfectScrollbar = (props) =>
{
    const ref = useRef(null)

    useEffect(() =>
    {
        setTimeout(() => ref.current._ps.update(), 150); ((list) => !list.contains('scroll-active') && list.add('scroll-active'))(ref.current._container.classList)
    }, [])

    return <PerfectScrollbar {...props} ref={ref}/>
}

export default forwardRef((props, ref) =>
{
    const [width] = useResize(); return width < 768 ? createElement(props.component, {...props, ref}) : <CustomPerfectScrollbar {...props}/>
})