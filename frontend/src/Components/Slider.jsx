import {connect} from "react-redux";
import {Fragment} from "react";
import Slider from "react-slick";

const Gallery = ({children}) =>
{
    const settings = {
        className: "slider variable-width",
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true
    };

    return <div className="slider-container"><Slider {...settings}>{children}</Slider></div>;
}

export default connect(state => state.Resizer)(({mobile}) => !mobile ? <Gallery {...arguments}/> : <Fragment {...arguments}/>);