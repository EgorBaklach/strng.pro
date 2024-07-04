import {createElement, useEffect, useRef} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {useOutletContext} from "react-router-dom";
import {connect} from "react-redux";

import Renderer from "../Plugins/Renderer.jsx";

const ScrollBar = props =>
{
    const ref = useRef(null), context = useOutletContext(); useEffect(() => {Renderer.scrollers[props.role] = ref.current}, [context?.url ?? props.role]); return <PerfectScrollbar {...props} ref={ref}/>
}

export default connect(state => state.Mobiler)(({mobile, className, component, reverse, children, role}) => createElement(!mobile ? ScrollBar : reverse ?? component, {className, role, ...(!mobile ? {component} : {})}, children));