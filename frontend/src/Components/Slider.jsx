import {createElement, Fragment, useEffect, useRef} from "react";
import {connect} from "react-redux";
import Slider from "react-slick";

import Delayer from "../Plugins/Delayer.jsx";
import Renderer from "../Plugins/Renderer.jsx";

const SampleArrow = ({className, style, onClick}) => <button className={className} style={style} onClick={onClick}/>

const Gallery = ({children, url}) =>
{
    const ref = useRef(null),
        onWheel = new Delayer(delta => delta > 0 ? ref.current.slickPrev() : ref.current.slickNext(), 50),
        eventDispatch = (slider) =>
        {
            slider.addEventListener("wheel", event => onWheel.call(Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))));

            return slider.removeEventListener("wheel", event => onWheel.call(Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))));
        };

    useEffect(() => eventDispatch(ref.current.innerSlider.list.parentNode), [url]);

    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        prevArrow: <SampleArrow/>,
        nextArrow: <SampleArrow/>
    };

    return <Slider {...settings} swipeEvent={() => Renderer.async = true} className="slider" ref={ref}>{children}</Slider>
}

export default connect(state => state.Mobiler)(props => !props.mobile ? <Gallery {...props}/> : createElement(props.component ?? Fragment, props.component ? props : null, props.children))