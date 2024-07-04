import {Fragment, jsx} from "react/jsx-runtime";
import remarkDirective from "remark-directive";
import AnimatedScroll from 'animated-scroll';
import {visit} from "unist-util-visit";
import {evaluate} from "@mdx-js/mdx";
import {io} from "socket.io-client";
import $ from "jquery";

import Delayer from "./Delayer.jsx"

import Mobiler from "../Reducers/Mobiler.jsx";
import Chater from "../Reducers/Chater.jsx";
import Imager from "../Reducers/Imager.jsx";
import Loader from "../Reducers/Loader.jsx";
import Socier from "../Reducers/Socier.jsx";
import User from "../Reducers/User.jsx";

import Cookies from "./Cookies.jsx";

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
            'is-list': () => ({hName: 'div', hProperties: {className: 'is-list'}}),
            'is-deeper': () => ({hName: 'span', hProperties: {className: 'is-deeper'}}),
            'is-higher': () => ({hName: 'span', hProperties: {className: 'is-higher'}}),
            'span': () => ({hName: 'span', hProperties: {}}),
        };

        this.vw = !import.meta.env.SSR ? window.innerWidth * 0.01 : 0;
        this.vh = !import.meta.env.SSR ? window.innerHeight * 0.01 : 0;

        this.socket = io({transports: ['websocket']});

        this.cookies = new Cookies();

        this.setChildrens = v => v;
        this.chatMessages = null;
        this.childrens = null;
        this.dispatch = null;
        this.stream = null;
        this.api = null;

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
        const promises = Object.entries(this.scrollers).map(values =>
        {
            const ref = values.pop(), classList = ref._container.classList; ref._ps.update(); if(classList.contains('scroll-active')) return true; classList.add('scroll-active'); return true;
        });

        Promise.all(promises).then(() => document.body.classList.add('scroll-init'));

        return false;
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

        this.dispatch(Imager.actions.clean());
        this.dispatch(Loader.actions.reset());
    }

    build(context)
    {
        if(this.scrollers.main?._container.scrollTop) this.scrollers.main._container.scrollTop = 0; this.context = context;

        !this.cookies.values?.uid && this.cookies.set('uid', this.context.uid, 365); return () => this.destroy();
    }

    /////////////////
    // ON EVALUATE //
    /////////////////

    remarkPlugin(node)
    {
        if(node.type === 'textDirective' || node.type === 'leafDirective' || node.type === 'containerDirective')
        {
            const [className, ...attr] = node.name.split('_'); node.data = this.plugins.hasOwnProperty(className) ? this.plugins[className](...attr) : {hName: 'div', hProperties: {className}};
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
        this.vw = window.innerWidth * 0.01; this.vh = window.innerHeight * 0.01; this.dispatch(Mobiler.actions.update());

        this.context?.props?.action === 'columnize' && window.innerWidth >= 768 && setTimeout(() => this.onAction.finish && this.columnize(), 100);

        document.documentElement.style.setProperty('--vw', this.vw + 'px');
        document.documentElement.style.setProperty('--vh', this.vh + 'px');
    }

    catch(error, instance)
    {
        !error?.in_process && this.api.remove(instance); return true;
    }

    start({dispatch, request, remove, subscribe, clear})
    {
        this.dispatch = dispatch; this.api = {request, remove}; this.stream = {subscribe, clear}; document.querySelector("root").removeAttribute('data-ssr'); window.addEventListener('resize', () => this.onResize.call());

        $(document).on('click', '.js-gallery-image', e => dispatch(Imager.actions.open(e.currentTarget.getAttribute('data-index'))) && false);

        document.fonts.onloadingdone = e => e.fontfaces.map(font => dispatch(Loader.actions.load(font.family.replace(/"/g, ''))) && dispatch(Loader.actions.check()));

        request('chat.messages', 'GET', '/chat/messages/index.json').then(r => dispatch(Chater.actions.init(r)) && remove('chat.messages')).catch(r => this.catch(r, 'chat.messages'));
        request('socials', 'GET', '/stats/index.json').then(r => dispatch(Socier.actions.init(r)) && remove('socials')).catch(r => this.catch(r, 'socials'));
        request('user', 'GET', '/me/index.json').then(r => dispatch(User.actions.init(r)) && remove('user')).catch(r => this.catch(r, 'user'));

        document.documentElement.style.setProperty('--vw', this.vw + 'px');
        document.documentElement.style.setProperty('--vh', this.vh + 'px');

        this.socket.on('answer', props => this[props.shift()](...props));

        return () => this.socket.off('answer');
    }

    /////////////////////
    // WHEEL AND SWIPE //
    /////////////////////

    continue()
    {
        this.container.scrollLeft > 0 ? this.lb.ref.current.classList.add('active') : this.lb.ref.current.classList.remove('active');

        this.page >= this.pages && this.container.scrollLeft >= this.width ? this.rb.ref.current.classList.remove('active') : this.rb.ref.current.classList.add('active');

        this.async = false;
    }

    wheel(distance)
    {
        const module = document.body.classList.contains('chat-active') ? 1.25 : 11.125; this.page = Math.max(0, Math.floor((distance + (this.vw * module))/ (this.vw * 58.5))); this.continue();
    }

    turn(event, check)
    {
        if(this.async || this.pages < 0) return; this.async = true; const module = document.body.classList.contains('chat-active') ? 1.25 : 11.125;

        check ? this.page++ : this.container.scrollLeft <= Math.max(0, this.vw * (58.5 * this.page - module)) && this.page--;

        this.as?.left(Math.max(0, this.vw * (58.5 * this.page - module))).then(() => this.continue());
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

        this.setChildrens([this.pages > 0 && this.lb, this.pages > 0 && this.rb, ...list.map((children, index) => jsx('div', {children, className: 'column', page: index + 1 + ' стр.'}))].filter(v => v));

        document.body.classList.add('columnizer-active'); document.body.classList.remove('loading-after'); this.lb.ref.current?.classList.remove('active'); this.rb.ref.current?.classList.add('active');

        this.width = Math.max(0, Math.floor(this.vw * (58.5 * this.pages-- - 20)));

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
        return !Object.entries(state.list).filter(values => !values.pop()).length ? this[state.action ?? 'after']() : false;
    }

    render(childrens, setChildrens)
    {
        this.childrens = [...this.first, ...childrens, ...this.last]; this.setChildrens = setChildrens;

        if(this.first.length || this.last.length) setChildrens(this.childrens);

        this.context?.page === 'article' && this.dispatch(Loader.actions.check()); return true;
    }

    ///////////////
    // LISTENERS //
    ///////////////

    chat(instance, {uid, id, ...props})
    {
        const me = uid === this.context.uid * 1;

        switch (instance)
        {
            case 'insert': this.dispatch(Chater.actions.insert(['id:' + id, {me, id, ...props}])) && me && this.dispatch(User.actions.counter(1)) && this.api.remove('chat.message'); break;
            case 'edit': this.dispatch(Chater.actions.edit(['id:' + id, props])) && me && this.dispatch(User.actions.clear(id)) && this.api.remove('chat.message'); break;
            case 'delete': this.dispatch(Chater.actions.delete('id:' + id)) && me && this.dispatch(User.actions.counter(-1)) && this.dispatch(User.actions.clear(id)) && this.api.remove('chat.delete'); break;
        }
    }

    social(instance, uid, id, ...props)
    {
        const me = uid === this.context.uid * 1; this.dispatch(Socier.actions.insert([instance, me, id, ...props])) && me && this.api.remove(instance) && this.stream.clear(instance + id);
    }
}