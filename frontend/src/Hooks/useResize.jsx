import {useEffect, useState} from "react"
import Delayer from "../Plugins/Delayer.jsx";

export default () =>
{
    const [dimensions, setDimensions] = useState([import.meta.env.SSR ? 0 : window.innerWidth, import.meta.env.SSR ? 0 : window.innerHeight]);

    const onFinish = new Delayer(() => (() => true)(setDimensions([window.innerWidth, window.innerHeight])) && callback(), 50);

    const callback = () => document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');

    useEffect(() =>
    {
        callback(); window.addEventListener('resize', () => onFinish.call()); return () => window.removeEventListener('resize', () => onFinish.call())
    }, [])

    return dimensions
}
