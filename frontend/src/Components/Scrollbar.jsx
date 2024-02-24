import {useEffect, useRef} from "react"
import PerfectScrollbar from "react-perfect-scrollbar";
import {useOutletContext} from "react-router-dom";

import Renderer from "../Plugins/Renderer.jsx";

export default (props) =>
{
    const Context = useOutletContext(), ref = useRef(null); useEffect(() => {Renderer.scrollers[ref.current.props.component] = ref.current}, [Context.url]); return <PerfectScrollbar {...props} ref={ref}/>
}