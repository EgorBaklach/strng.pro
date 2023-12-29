import Delayer from "./Delayer"
import {jsx} from "react/jsx-runtime";

export default new class
{
    constructor()
    {
        this.delay = new Delayer(this.handle.bind(this), 50); this.first = []; this.last = []; this.children = [];
    }

    handle([children, setChildren, width])
    {
        if(this.delay.finish === false) return setChildren(this.children = [...this.first, ...children, ...this.last]);

        document.body.classList.remove('columnizer-active'); if(width >= 768) this.columnize(setChildren); return null;
    }

    columnize(setChildren)
    {
        let step = 0, different = 0, list = [[]];

        this.children.every((child) =>
        {
            if(!child.ref?.current) return true; const {y, bottom} = child.ref.current.getBoundingClientRect();

            if((bottom + different + 30) > (window.innerHeight*(step+1)))
            {
                step++; if(list[step] === undefined) list[step] = []; different += window.innerHeight*step - y;
            }

            list[step].push(child); return true;
        });

        setChildren(list.map((children, index) => jsx('div', {children, className: 'column', page: index + 1 + ' стр.'})));

        document.body.classList.add('columnizer-active')
    }

    reStart()
    {
        this.delay.finish = false; return true
    }
}