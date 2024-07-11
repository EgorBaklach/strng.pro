import {createElement, useEffect, useRef} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {useOutletContext} from "react-router-dom";
import {connect} from "react-redux";

import Renderer from "../Plugins/Renderer.jsx";
import Delayer from "../Plugins/Delayer.jsx";

const ScrollBar = props =>
{
    const ref = useRef(null), context = useOutletContext(), delay = new Delayer(wrapper => Renderer.wheel(wrapper.scrollLeft), 150);

    useEffect(() => {
        props.role === 'article' && ref.current._container.addEventListener('ps-scroll-x', e => Renderer.init && !Renderer.async && delay.call(e.target)); Renderer.scrollers[props.role] = ref.current;
    }, [context?.url ?? props.role]);

    return <PerfectScrollbar {...props} options={{useBothWheelAxes: true}} ref={ref}/>
}

export default connect(state => state.Mobiler)(({mobile, className, component, reverse, children, role}) => createElement(!mobile ? ScrollBar : reverse ?? component, {className, role, ...(!mobile ? {component} : {})}, children));