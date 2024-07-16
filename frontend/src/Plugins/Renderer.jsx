import {Fragment, jsx} from "react/jsx-runtime";
import remarkDirective from "remark-directive";
import AnimatedScroll from 'animated-scroll';
import {visit} from "unist-util-visit";
import {evaluate} from "@mdx-js/mdx";
import {io} from "socket.io-client";
import $ from "jquery";

import Delayer from "./Delayer.jsx"

import Comments from "../Reducers/Comments.jsx";
import Mobiler from "../Reducers/Mobiler.jsx";
import Editor from "../Reducers/Editor.jsx";
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

        this.scrollLeft = 0;

        this.scrollers = {};
        this.comments = {};
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
        this.comments = {};
        this.context = {};

        this.dispatch(Imager.actions.clear());
        this.dispatch(Loader.actions.reset());
    }

    build(context)
    {
        document.title = context.page_title + ' | Strong Elephant'; this.context = context; !this.cookies.values?.uid && this.cookies.set('uid', this.context.uid, 365); return () => this.destroy();
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

    catch(error, instance)
    {
        !error?.in_process && this.api.remove(instance); return true;
    }

    resize()
    {
        this.vw = window.innerWidth * 0.01; this.vh = window.innerHeight * 0.01; this.dispatch(Mobiler.actions.update());

        this.context?.props?.action === 'columnize' && window.innerWidth >= 768 && setTimeout(() => this.onAction.finish && this.columnize(), 1);

        document.documentElement.style.setProperty('--vw', this.vw + 'px');
        document.documentElement.style.setProperty('--vh', this.vh + 'px');
    }

    start({dispatch, request, remove, subscribe, clear})
    {
        this.dispatch = dispatch; this.api = {request, remove}; this.stream = {subscribe, clear}; document.querySelector("root").removeAttribute('data-ssr');

        document.fonts.onloadingdone = e => e.fontfaces.map(font => dispatch(Loader.actions.load(font.family.replace(/"/g, ''))) && dispatch(Loader.actions.check()));

        $(document).on('click', '.js-gallery-image', e => dispatch(Imager.actions.open(e.currentTarget.getAttribute('data-index'))) && false);

        request('chat.messages', 'GET', '/chat/messages/index.json').then(r => dispatch(Chater.actions.init(r)) && remove('chat.messages')).catch(r => this.catch(r, 'chat.messages'));
        request('socials', 'GET', '/stats/index.json').then(r => dispatch(Socier.actions.init(r)) && remove('socials')).catch(r => this.catch(r, 'socials'));
        request('user', 'GET', '/me/index.json').then(r => dispatch(User.actions.init(r)) && remove('user')).catch(r => this.catch(r, 'user'));

        document.documentElement.style.setProperty('--vw', this.vw + 'px');
        document.documentElement.style.setProperty('--vh', this.vh + 'px');

        this.socket.on('answer', props => this[props.shift()](...props));

        window.addEventListener('resize', () => this.onResize.call());

        return () => this.socket.off('answer');
    }

    /////////////////////
    // WHEEL AND SWIPE //
    /////////////////////

    continue()
    {
        this.container.scrollLeft >= this.width ? this.rb.ref.current.classList.remove('active') : this.rb.ref.current.classList.add('active');
        this.container.scrollLeft > 0 ? this.lb.ref.current.classList.add('active') : this.lb.ref.current.classList.remove('active');

        this.comments.on = this.async = false;

        if(this.page >= this.comments.page || this.container.scrollLeft >= this.width)
        {
            if(this.comments.reload)
            {
                document.body.classList.add('loading-after'); this.setChildrens([...this.first, ...this.childrens, ...this.last]); setTimeout(() => this.columnize(this.scrollLeft), 1);
            }

            this.comments.on = true; this.comments.reload = false;
        }
    }

    wheel(distance)
    {
        this.page = Math.max(0, Math.floor((distance + (this.vw * (document.body.classList.contains('chat-active') ? 1.25 : 11.125))) / (this.vw * 58.5))); this.scrollLeft = distance; this.continue();
    }

    turn(check)
    {
        if(this.async || this.pages < 0) return; this.async = true; const indent = document.body.classList.contains('chat-active') ? 1.25 : 11.125;

        const distance = Math.max(0, this.vw * (58.5 * (this.page + (check ? 1 : this.container.scrollLeft <= Math.max(0, this.vw * (this.page * 58.5 - indent)) && -1)) - indent));

        this.as?.left(distance).then(() => setTimeout(() => this.wheel(distance), 50));
    }

    ////////////
    // RENDER //
    ////////////

    columnize(scrollLeft)
    {
        if(window.innerWidth < 768) return true; let different = 0, indent = 0, list = [[]], innerHeight = window.innerHeight - window.innerWidth * 0.03; this.width = this.page = this.pages = 0;

        document.body.classList.remove('columnizer-active');

        for(const child of [...this.first, ...this.childrens, ...this.last])
        {
            if(!child.ref?.current && !child.props?.['data-id']) continue;

            const container = child.ref?.current ?? $('.js-message[data-id=' + child.props['data-id'] +']')[0], {y, bottom} = container.getBoundingClientRect();

            if(container.getAttribute('role') === 'breakline')
            {
                if((y + different) > innerHeight * (this.pages + 1) - innerHeight / 2) indent = - (y + different - (innerHeight * (this.pages + 1))); this.comments = {page: this.pages, on: false};
            }

            if((bottom + different + indent) >= innerHeight * (this.pages + 1))
            {
                if(list[++this.pages] === undefined) list[this.pages] = []; different = innerHeight * this.pages - y - indent;
            }

            list[this.pages].push(child);
        }

        this.setChildrens([this.pages > 0 && this.lb, this.pages > 0 && this.rb, ...list.map((children, index) => jsx('div', {children, className: 'column', page: index + 1 + ' стр.'}))].filter(v => v));

        document.body.classList.add('columnizer-active'); document.body.classList.remove('loading-after'); this.lb.ref.current?.classList.remove('active'); this.rb.ref.current?.classList.add('active');

        this.width = Math.max(0, Math.floor(this.vw * (58.5 * this.pages-- - 20)));

        if(this.scrollers?.article)
        {
            this.as = new AnimatedScroll(this.container = this.scrollers.article._container); this.container.scrollLeft = scrollLeft ?? 0; setTimeout(() => this.wheel(scrollLeft ?? 0), 1);
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

    rerender(counters)
    {
        if(window.innerWidth >= 768)
        {
            if(this.context?.props?.action === 'columnize')
            {
                this.comments.reload = true; if(!this.comments.on) return; this.comments.reload = false; document.body.classList.add('loading-after'); setTimeout(() => this.columnize(this.scrollLeft), 1);
            }
            else
            {
                counters?.insert && setTimeout(() => this.scrollers?.article?._container.scrollTo(0, 999999), 1);
            }
        }

        this.setChildrens([...this.first, ...this.childrens, ...this.last]);
    }

    render(childrens, setChildrens)
    {
        this.childrens = childrens; this.setChildrens = setChildrens; if(this.first.length || this.last.length) setChildrens([...this.first, ...this.childrens, ...this.last]);

        this.context?.page === 'article' && this.dispatch(Loader.actions.check()); return true;
    }

    ///////////////
    // LISTENERS //
    ///////////////

    dialog(instance, operation, {uid, id, aid, count, ...props})
    {
        const me = uid === this.context.uid * 1, actions = {chat: Chater.actions, comments: Comments.actions}; let value = null;

        switch (operation)
        {
            case 'insert': value = 1; this.dispatch(actions[instance].insert(['id:' + id, {me, id, aid, ...props}])) && me && this.dispatch(User.actions.counter(1)) && this.api.remove('dialog.message'); break;
            case 'edit': this.dispatch(actions[instance].edit(['id:' + id, {aid, ...props}])) && me && this.dispatch(Editor.actions.clear([instance, id * 1])) && this.api.remove('dialog.message'); break;
            case 'delete': value = -1; this.dispatch(actions[instance].delete(['id:' + id, aid])) && me && this.dispatch(User.actions.counter(-1)) && this.dispatch(Editor.actions.clear([instance, id * 1])) && this.api.remove('dialog.delete'); break;
        }

        if(instance === 'comments' && value !== null) this.social('comments', uid, aid, count, value); this.onScroll.call();
    }

    social(instance, uid, id, ...props)
    {
        const me = uid === this.context.uid * 1; this.dispatch(Socier.actions.insert([instance, me, id, ...props])) && me && this.api.remove(instance) && this.stream.clear(instance + id);
    }
}