import useResize from "../Hooks/useResize"

export default ({children, className}) =>
{
    const [width] = useResize(), onWheel = (event) =>
    {
        if(width < 768) return; const delta = Math.max(-1, Math.min(1, (event.nativeEvent.wheelDelta || -event.nativeEvent.detail)))

        event.currentTarget.parentNode.scrollLeft -= (delta * 120)
    };

    return <div className={className} onWheel={onWheel}>{children}</div>
};