import {Fragment, jsx} from "react/jsx-runtime";
import remarkDirective from "remark-directive";
import AnimatedScroll from 'animated-scroll';
import {visit} from "unist-util-visit";
import {evaluate} from "@mdx-js/mdx";
import $ from "jquery";

import Delayer from "./Delayer.jsx"

import {update} from "../Reducers/Mobiler.jsx";
import {clean, open} from "../Reducers/Imager.jsx";
import {check, load, reset} from "../Reducers/Loader.jsx";

export default new class
{
    constructor()
    {
        this.onScroll = new Delayer(this.scroll.bind(this), 150);
        this.onAction = new Delayer(this.action.bind(this), 100);
        this.onResize = new Delayer(this.resize.bind(this), 50);
        this.onRender = new Delayer(this.render.bind(this), 50);

        this.plugins = {
            'is-enum': symbol => ({hName: 'div', hProperties: {className: 'is-enum', 'data-symbol': symbol}}),
            'is-deeper': () => ({hName: 'span', hProperties: {className: 'is-deeper'}}),
            'is-higher': () => ({hName: 'span', hProperties: {className: 'is-higher'}}),
            'span': () => ({hName: 'span', hProperties: {}}),
        };

        this.vw = !import.meta.env.SSR ? window.innerWidth * 0.01 : 0;
        this.vh = !import.meta.env.SSR ? window.innerHeight * 0.01 : 0;

        this.setChildrens = v => v;
        this.childrens = null;
        this.dispatch = null;

        this.scrollers = {};
        this.context = {};
        this.first = [];
        this.last = [];

        this.lb = null;
        this.rb = null;

        this.async = false;
        this.init = false;
    }

    scroll()
    {
        document.body.classList.add('scroll-init'); Object.entries(this.scrollers).map(([k, ref]) => (() => true)(ref._ps.update()) && ref._container.classList.add('scroll-active')); return false;
    }

    destroy()
    {
        document.body.removeAttribute('class');

        this.onRender.finish = false;
        this.init = false;

        this.width = 0;
        this.pages = 0;
        this.page = 0;

        this.container = null;
        this.as = null;

        this.scrollers = {};
        this.context = {};

        this.dispatch(clean());
        this.dispatch(reset());
    }

    build(context)
    {
        if(this.scrollers.main?._container.scrollTop) this.scrollers.main._container.scrollTop = 0; this.context = context; return () => this.destroy();
    }

    /////////////////
    // ON EVALUATE //
    /////////////////

    remarkPlugin(node)
    {
        if(node.type === 'textDirective' || node.type === 'leafDirective' || node.type === 'containerDirective')
        {
            const [className, ...attr] = node.name.split('_'); node.data = this.plugins.hasOwnProperty(className) ? this.plugins[className](...attr) : {hName: 'div', hProperties: {className: className}};
        }
    }

    async evaluate(content, jsx, jsxs)
    {
        return await evaluate(content, {jsx, jsxs, Fragment, development: false, remarkPlugins: [remarkDirective, () => tree => visit(tree, this.remarkPlugin.bind(this))]});
    }

    //////////////
    // ON START //
    //////////////

    resize()
    {
        this.vw = window.innerWidth * 0.01; this.vh = window.innerHeight * 0.01; this.dispatch(update());

        this.context?.props?.action === 'columnize' && window.innerWidth >= 768 && setTimeout(() => this.onAction.finish && this.columnize(), 100);

        document.documentElement.style.setProperty('--vw', this.vw + 'px');
        document.documentElement.style.setProperty('--vh', this.vh + 'px');
    }

    start(dispatch)
    {
        this.dispatch = dispatch; document.querySelector("root").removeAttribute('data-ssr'); window.addEventListener('resize', () => this.onResize.call());

        $(document).on('click', '.js-gallery-image', e => dispatch(open(e.currentTarget.getAttribute('data-index'))) && false);

        document.fonts.onloadingdone = e => e.fontfaces.map(font => dispatch(load(font.family)) && dispatch(check()));

        document.documentElement.style.setProperty('--vw', this.vw + 'px');
        document.documentElement.style.setProperty('--vh', this.vh + 'px');
    }

    /////////////////////
    // WHEEL AND SWIPE //
    /////////////////////

    continue()
    {
        this.container.scrollLeft > 0 ? this.lb.ref.current.classList.add('active') : this.lb.ref.current.classList.remove('active')

        this.page >= this.pages && this.container.scrollLeft >= this.width ? this.rb.ref.current.classList.remove('active') : this.rb.ref.current.classList.add('active')

        this.async = false;
    }

    wheel(distance)
    {
        this.page = Math.max(0, Math.floor((distance + (this.vw * 11.125))/ (this.vw * 58.5))); this.continue();
    }

    turn(event, check)
    {
        if(this.async || this.pages < 0) return; this.async = true; check ? this.page++ : this.container.scrollLeft <= Math.max(0, this.vw * (58.5 * this.page - 11.125)) && this.page--;

        this.as?.left(Math.max(0, this.vw * (58.5 * this.page - 11.125))).then(() => this.continue());
    }

    ////////////
    // RENDER //
    ////////////

    columnize()
    {
        if(window.innerWidth < 768) return true; let different = 0, list = [[]], innerHeight = window.innerHeight - window.innerWidth * 0.03; this.width = this.page = this.pages = 0;

        document.body.classList.remove('columnizer-active');

        for(const child of this.childrens)
        {
            if(!child.ref?.current) continue; const {y, bottom} = child.ref.current.getBoundingClientRect();

            if((bottom + different) >= innerHeight * (this.pages + 1))
            {
                if(list[++this.pages] === undefined) list[this.pages] = []; different = innerHeight * this.pages - y;
            }

            list[this.pages].push(child);
        }

        this.setChildrens([...list.map((children, index) => jsx('div', {children, className: 'column', page: index + 1 + ' стр.'})), this.pages > 0 && this.lb, this.pages > 0 && this.rb].filter(v => v));

        document.body.classList.add('columnizer-active'); document.body.classList.remove('loading-after');

        this.lb.ref.current?.classList.remove('active'); this.rb.ref.current?.classList.add('active'); this.width = Math.max(0, Math.floor(this.vw * (58.5 * this.pages-- - 20)));

        if(this.scrollers?.main)
        {
            this.as = new AnimatedScroll(this.container = this.scrollers.main._container); this.container.scrollLeft = 0;
        }

        this.init = true; return this.after();
    }

    sliderInit()
    {
        document.body.classList.add('images-ready'); document.body.classList.remove('loading-after'); return this.after();
    }

    after()
    {
        this.onScroll.call(); return true;
    }

    action(state)
    {
        return !Object.entries(state.list).filter(([k, v]) => !v).length ? this[state.action ?? 'after']() : false;
    }

    render(childrens, setChildrens)
    {
        this.childrens = [...this.first, ...childrens, ...this.last]; this.setChildrens = setChildrens;

        if(this.first.length || this.last.length) setChildrens(this.childrens); this.dispatch(check()); return true;
    }
}