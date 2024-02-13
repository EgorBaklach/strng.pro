import Delayer from "./Delayer"
import {jsx} from "react/jsx-runtime";

export default new class
{
    constructor()
    {
        this.delay = new Delayer(this.columnize.bind(this), 150); this.first = []; this.last = []; this.children = [];
    }

    build()
    {
        document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');

        document.body.classList.remove('columnizer-active', 'is-scroll');

        this.delay.finish = false;
        this.sum_dem = 0;

        return true;
    }

    columnize([children, setChildren, width, height])
    {
        if(this.delay.finish === false) return setChildren(this.children = [...this.first, ...children, ...this.last]);

        if(width >= 768 && this.sum_dem !== width + height)
        {
            let step = 0, different = 0, list = [[]]; document.body.classList.remove('columnizer-active');

            this.children.every((child) =>
            {
                if(!child.ref?.current) return true; const {y, bottom} = child.ref.current.getBoundingClientRect();

                if((bottom + different + 50) > (window.innerHeight*(step+1)))
                {
                    step++; if(list[step] === undefined) list[step] = []; different = window.innerHeight*step - y;
                }

                list[step].push(child); return true;
            });

            setChildren(list.map((children, index) => jsx('div', {children, className: 'column', page: index + 1 + ' стр.'})));

            document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px'); document.body.classList.add('columnizer-active');

            document.querySelector('.wrapper').scrollLeft = 0;
        }

        return null;
    }
}