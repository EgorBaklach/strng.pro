import {Fragment, useEffect, useRef} from "react";
import {connect} from "react-redux";

import Message from "./Message.jsx";
import Wrapper from "./Wrapper.jsx";
import UserForm from "./UserForm.jsx";

import Renderer from "../Plugins/Renderer.jsx";
import Delayer from "../Plugins/Delayer.jsx";

import Editor from "../Reducers/Editor.jsx";

import Api from "../Actions/Api.jsx";

const chatInit = container =>
{
    container.scrollTo(0, 9999999); Renderer.onScroll.call(); !container.classList.contains('loaded') && container.classList.add('loaded');
};

export default connect(States => ({...States.Chater, ...States.Mobiler}), {...Api, onEdit: message => dispatch => dispatch(Editor.actions.edit(['chat', message]))})(({loaded, last_id, messages, mobile, request, onEdit}) =>
{
    const ref = useRef(null), delay = new Delayer(chatInit, 150); useEffect(() => {loaded && delay.call(ref.current.parentElement)}, [loaded, last_id, mobile]);

    const onDelete = id => confirm('Вы действительно хотите удалить сообщение?') && request('dialog.delete', 'POST', '/chat/delete/index.json', JSON.stringify([id, null]))
        .then(props => Renderer.socket.emit('call', ['dialog', 'chat', 'delete', props]))
        .catch(e => Renderer.catch(e, 'dialog.delete') && alert('Ошибка удаления сообщения'))

    return loaded && <Fragment>
        <Wrapper component="div" role="chat" className="wrapper">
            <div className="messages" ref={ref}>{Object.entries(messages).map(([id, message]) => <Fragment key={id}>
                <div className={['message', message.me && 'is-your'].filter(v => v).join(' ')}>
                    {message?.date_break && <div className="message-break"><span>{message.date_break}</span></div>}
                    <Message message={message} onEdit={() => onEdit(message)} onDelete={() => onDelete(message.id)}/>
                </div>
            </Fragment>)}</div>
        </Wrapper>
        <div className="user-form"><UserForm instance="chat"/></div>
    </Fragment>
});