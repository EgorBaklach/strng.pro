import {memo, useEffect, useRef, useState} from "react";
import ContentEditable from "react-contenteditable";
import {connect} from "react-redux";

import Renderer from "../Plugins/Renderer.jsx";

import Editor from "../Reducers/Editor.jsx";

import Api from "../Actions/Api.jsx";

export default connect(States => ({...States.User, ...States.Editor}), {dispatch: action => dispatch => dispatch(action), ...Api})(memo(({instance, dispatch, loaded, aid, count, user, edit, request}) =>
{
    const [[name, text, message], setData] = useState(['', '', '']), ref = useRef(null), onKeyDown = e => e.altKey && e.keyCode === 13 && ref.current.querySelector('[type="submit"]').click();

    useEffect(() =>
    {
        loaded && setData([edit[instance]?.name ?? user.name ?? name, edit[instance]?.text ?? text, edit[instance]?.id ? 'Редактировать сообщение' : '']);

        edit[instance]?.id && ref.current.querySelector('.textarea').focus()

    }, [loaded, edit[instance]?.id]);

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
            case edit[instance]?.name === name && edit[instance]?.text === text: return dispatch(Editor.actions.clear([instance, edit[instance]?.id])) && setData([n, '', '']);
        }

        request('dialog.message', 'POST', '/' + instance + '/message/index.json', JSON.stringify([n, t, edit[instance]?.id, aid])).then(r =>
        {
            Renderer.socket.emit('call', ['dialog', instance, edit[instance]?.id ? 'edit' : 'insert', {...user, ...edit[instance], ...r, aid, count}]); setData([n, '', '']);
        }).catch(e => Renderer.catch(e, 'dialog.message') && setData([n, t, 'Internal Error']));
    };

    return <form onSubmit={onSubmit} ref={ref}>
        <div className="field"><input type="text" required maxLength="30" className="input" onChange={e => setData([e.target.value, text, message])} value={name} name="name" placeholder="Имя" onKeyDown={onKeyDown}/></div>
        <div className="field"><ContentEditable tagName="pre" html={text} disabled={false} placeholder="Сообщение" className="textarea" onChange={e => setData([name, e.currentTarget.textContent, message])} onKeyDown={onKeyDown}/></div>
        <div className="field"><div className="tools">{message}</div><button type="submit">ОТПРАВИТЬ</button></div>
    </form>
}, (p, n) => p.loaded === n.loaded && JSON.stringify(p.edit) === JSON.stringify(n.edit)));