import Delayer from "./Delayer"
import {jsx} from "react/jsx-runtime";
import AnimatedScroll from 'animated-scroll';

export default new class
{
    constructor()
    {
        this.onScrollize = new Delayer(() => Object.entries(this.scrollers).map(([k, ref]) => (() => true)(ref._ps.update()) && ref._container.classList.add('scroll-active')) && false, 150);
        this.onColumnize = new Delayer(this.columnize.bind(this), 50);

        this.scrollers = {};
        this.children = [];
        this.first = [];
        this.last = [];

        this.lb = null;
        this.rb = null;

        this.async = false;
    }

    build()
    {
        document.body.classList.remove('columnizer-active', 'is-scroll'); this.vw = window.innerWidth * 0.01; this.onScrollize.call();

        this.onColumnize.finish = this.init = false; this.container = this.as = null; this.pages = this.sum_dem = 0; this.scrollers = {};
    }

    listen()
    {
        this.container.scrollLeft > 0 ? this.lb.ref.current.classList.add('active') : this.lb.ref.current.classList.remove('active')

        this.page >= this.pages && this.container.scrollLeft >= this.width ? this.rb.ref.current.classList.remove('active') : this.rb.ref.current.classList.add('active')

        this.async = false;
    }

    scroll(distance)
    {
        this.page = Math.max(0, Math.floor((distance + (this.vw * 11.125))/ (this.vw * 58.5))); this.listen();
    }

    turn(event, check)
    {
        if(this.async || this.pages < 0) return; this.async = true; check ? this.page++ : this.container.scrollLeft <= Math.max(0, this.vw * (58.5 * this.page - 11.125)) && this.page--;

        this.as.left(Math.max(0, this.vw * (58.5 * this.page - 11.125))).then(() => this.listen());
    }

    columnize([children, setChildren, width, height])
    {
        if(this.onColumnize.finish === false) return setChildren(this.children = [...this.first, ...children, ...this.last]);

        if(width >= 768 && this.sum_dem !== width + height)
        {
            let different = 0, list = [[]]; this.sum_dem = width + height; this.width = this.page = this.pages = 0; document.body.classList.remove('columnizer-active');

            this.children.every((child) =>
            {
                if(!child.ref?.current) return true; const {y, bottom} = child.ref.current.getBoundingClientRect();

                if((bottom + different + window.innerWidth * 0.01 * 3) > window.innerHeight * (this.pages + 1))
                {
                    if(list[++this.pages] === undefined) list[this.pages] = []; different = window.innerHeight * this.pages - y;
                }

                list[this.pages].push(child); return true;
            });

            setChildren([...list.map((children, index) => jsx('div', {children, className: 'column', page: index + 1 + ' стр.'})), this.pages > 0 && this.lb, this.pages > 0 && this.rb].filter(v => v));

            document.body.classList.add('columnizer-active');
        }

        if(this.onColumnize.finish !== undefined)
        {
            this.lb.ref.current?.classList.remove('active'); this.rb.ref.current?.classList.add('active');

            this.vw = window.innerWidth * 0.01; this.width = Math.max(0, Math.floor(this.vw * (58.5 * this.pages-- - 20)));

            this.container = this.scrollers.main._container; this.as = new AnimatedScroll(this.container); this.container.scrollLeft = 0;

            this.onScrollize.call(); this.init = true;
        }

        return null;
    }
}