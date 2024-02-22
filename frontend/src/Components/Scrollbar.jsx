import {createElement, forwardRef, useEffect, useRef} from "react"
import PerfectScrollbar from "react-perfect-scrollbar";
import {useOutletContext} from "react-router-dom";

import useResize from "../Hooks/useResize.jsx";
import Renderer from "../Plugins/Renderer.jsx";
import Delayer from "../Plugins/Delayer";

const CustomPerfectScrollbar = (props) =>
{
    const Context = useOutletContext(), [width] = useResize(), ref = useRef(null), delay = new Delayer(ref => Renderer.scrollers[ref.props.component] = ref, 50);

    useEffect(() => delay.call(ref.current), [width >= 768, Context.url]); return <PerfectScrollbar {...props} ref={ref}/>
}

export default forwardRef((props, ref) =>
{
    const [width] = useResize(); return width >= 768 ? <CustomPerfectScrollbar {...props}/> : createElement(props.component, {...props, ref})
})