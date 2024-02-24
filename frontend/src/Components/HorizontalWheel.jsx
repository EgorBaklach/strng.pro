import {connect} from "react-redux";

import Renderer from "../Plugins/Renderer.jsx";
import Delayer from "../Plugins/Delayer.jsx";

export default connect(state => state.Mobiler)(({mobile, children, className}) =>
{
    const delay = new Delayer(wrapper => Renderer.scroll(wrapper.scrollLeft), 150), move = (event) =>
    {
        if(mobile) return; const container = event.currentTarget.parentNode, distance = container.scrollLeft;

        if(event.type === 'wheel')
        {
            container.scrollLeft -= (Math.max(-1, Math.min(1, (event.nativeEvent.wheelDelta || -event.nativeEvent.detail))) * 120);

            if(container.scrollLeft === distance) return;
        }

        if(Renderer.init && Renderer.pages >= 0) delay.call(event.currentTarget.parentNode);
    };

    return <div className={className} onWheel={move} onTouchMove={move}>{children}</div>
});