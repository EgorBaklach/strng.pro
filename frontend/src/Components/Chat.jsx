import {Fragment, memo, useEffect, useRef, useState} from "react";
import ContentEditable from "react-contenteditable";
import {connect} from "react-redux";

import Wrapper from "./Wrapper.jsx";

import Renderer from "../Plugins/Renderer.jsx";
import Delayer from "../Plugins/Delayer.jsx";

import User from "../Reducers/User.jsx";

import Api from "../Actions/Api.jsx";

const MessageTextComponent = ({text}) => text.length <= 250 ? text : <Fragment>
    <span className="anounce">{text.slice(0, 250)}...&nbsp;</span>
    <span className="detail">{text}</span>
    <span className="show" onClick={e => {e.target.parentElement.classList.add('detail-show'); Renderer.scrollers?.chat?._ps.update()}}>Читать</span>
</Fragment>

const MessageComponent = memo(({message, onEdit, onDelete}) => <Fragment>
    <div className={['message', message.me && 'is-your'].filter(v => v).join(' ')}>
        <div className="title">
            <div className="name">{message.role && message.role !== 'user' && <span className={'role ' + message.role}></span>}{message.name ?? 'Anonymous'}<span className="data">{message.time}</span></div>
            {message.me && <Fragment><button className="btn edit" onClick={() => onEdit(message)}></button><button className="btn delete" onClick={() => onDelete(message.id)}></button></Fragment>}
        </div>
        <div className="text"><MessageTextComponent text={message.text}/></div>
    </div>
    {message?.date_break && <div className="break"><span>{message.date_break}</span></div>}
</Fragment>, (p, n) => p.message.name === n.message.name && p.message.role === n.message.role && p.message.text === n.message.text);

const chatInit = container =>
{
    container.scrollTo(0, 9999999); Renderer.onScroll.call(); !container.classList.contains('loaded') && container.classList.add('loaded');
};

const ChatFormConnect = connect(States => States.User, {dispatch: action => dispatch => dispatch(action), ...Api})(memo(({dispatch, loaded, user, request}) =>
{
    const [[name, text, message], setData] = useState(['', '', '']), ref = useRef(null), onKeyDown = e => e.altKey && e.keyCode === 13 && ref.current.querySelector('[type="submit"]').click();

    useEffect(() => {loaded && setData([user.name ?? name, user.text ?? text, user.mid ? 'Редактировать сообщение' : '']); user.mid && ref.current.querySelector('.textarea').focus()}, [loaded, user.mid]);

    const onSubmit = e =>
    {
        const n = name.trim(), t = text.trim(), textarea = ref.current.querySelector('.textarea'); textarea.focus(); e.preventDefault();

        if(!n.length || !t.length)
        {
            !t.length && textarea.setAttribute('placeholder', 'Введите сообщение');
            !n.length && ref.current.querySelector('[name="name"]').setAttribute('placeholder', 'Введите имя');

            return setData([n, t, 'Заполните все поля']);
        }

        switch(true)
        {
            case n.length > 30: return setData([n, t, 'Имя > 30 символов']);
            case (/[^a-zA-Z\u0430-\u044f\s]+/gi).test(n): return setData([n, t, 'Имя содержит только буквы']);
            case t.length > 1000: return setData([n, t, 'Текст > 1000 символов']);
            case user.name === name && user.text === text: return dispatch(User.actions.clear(user.mid)) && setData([n, '', '']);
        }

        request('chat.message', 'POST', '/chat/message/index.json', JSON.stringify([n, t, user.mid])).then(r =>
        {
            Renderer.socket.emit('call', ['chat', user.mid ? 'edit' : 'insert', {...user, ...r}]); setData([n, '', '']);
        }).catch(e => Renderer.catch(e, 'chat.message') && setData([n, t, 'Internal Error']));
    };

    return !loaded ? '' : <form onSubmit={onSubmit} ref={ref}>
        <div className="field"><input type="text" required maxLength="30" className="input" onChange={e => setData([e.target.value, text, message])} value={name} name="name" placeholder="Имя" onKeyDown={onKeyDown}/></div>
        <div className="field">
            <ContentEditable tagName="pre" html={text} disabled={false} placeholder="Сообщение" className="textarea" onChange={e => setData([name, e.currentTarget.textContent, message])} onKeyDown={onKeyDown}/>
        </div>
        <div className="field"><div className="tools">{message}</div><button type="submit">ОТПРАВИТЬ</button></div>
    </form>;
}, (p, n) => p.loaded === n.loaded && p.user.mid === n.user.mid));

export default connect(States => ({...States.Chater, ...States.Mobiler}), {...Api, edit: message => dispatch => dispatch(User.actions.edit(message))})(({loaded, last_id, messages, mobile, request, edit}) =>
{
    const ref = useRef(null), delay = new Delayer(chatInit, 150); useEffect(() => {loaded && delay.call(ref.current.parentElement)}, [loaded, last_id, mobile]);

    const onDelete = id => confirm('Вы действительно хотите удалить сообщение?') && request('chat.delete', 'POST', '/chat/delete/index.json', id)
        .then(props => Renderer.socket.emit('call', ['chat', 'delete', props]))
        .catch(e => Renderer.catch(e, 'chat.delete') && alert('Ошибка удаления сообщения'))

    return !loaded ? '' : <Fragment>
        <Wrapper component="div" role="chat" className="wrapper">
            <div className="messages" ref={ref}>{Object.entries(messages).map(([id, message]) => <MessageComponent message={message} key={id} onEdit={edit} onDelete={onDelete}/>)}</div>
        </Wrapper>
        <div className="user-form"><ChatFormConnect /></div>
    </Fragment>
});