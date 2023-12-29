import {useEffect, useState} from "react"
import Delayer from "../Plugins/Delayer.js";

export default () =>
{
    const [dimensions, setDimensions] = useState([import.meta.env.SSR ? 0 : window.outerWidth, import.meta.env.SSR ? 0 : window.outerHeight]);

    const onFinish = new Delayer(() => setDimensions([window.outerWidth, window.outerHeight]), 50);

    useEffect(() =>
    {
        window.addEventListener('resize', () => onFinish.call()); return () => window.removeEventListener('resize', () => onFinish.call())
    }, [])

    return dimensions
}
