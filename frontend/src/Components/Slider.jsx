import {connect} from "react-redux";
import {createElement, Fragment, useEffect, useRef} from "react";
import Slider from "react-slick";
import Delayer from "../Plugins/Delayer.jsx";

const SampleArrow = ({className, style, onClick}) => <button className={className} style={style} onClick={onClick}/>

const Gallery = ({children, setSkip}) =>
{
    const ref = useRef(null),
        onReInit = new Delayer(() => document.body.classList.add('slider-init'), 100),
        onWheel = new Delayer(delta => delta > 0 ? ref.current.slickPrev() : ref.current.slickNext(), 50),
        eventDispatch = (slider) =>
        {
            slider.addEventListener("wheel", event => onWheel.call(Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))));

            return slider.removeEventListener("wheel", event => onWheel.call(Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))));
        };

    useEffect(() => eventDispatch(ref.current.innerSlider.list.parentNode), []);

    const settings = {
        className: "slider variable-width",
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        swipeToSlide: true,
        prevArrow: <SampleArrow/>,
        nextArrow: <SampleArrow/>
    };

    return <Slider {...settings} swipeEvent={() => setSkip(true)} onReInit={() => onReInit.call()} ref={ref}>{children}</Slider>
}

export default connect(state => state.Mobiler)(props => !props.mobile ? <Gallery {...props}/> : createElement(props.component ?? Fragment, props, props.children))