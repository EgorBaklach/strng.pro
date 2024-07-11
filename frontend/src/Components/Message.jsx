import {Fragment, memo} from "react";

export default memo(({message, onEdit, onDelete}) => <Fragment>
    <div className="title">
        <div className="name">{message.role && message.role !== 'user' && <span className={'role ' + message.role}></span>}{message.name ?? 'Anonymous'}<span className="data">{message.time}</span></div>
        {message.me && <Fragment><button className="btn edit" onClick={onEdit}></button><button className="btn delete" onClick={onDelete}></button></Fragment>}
    </div>
    <div className="text">{message.text}</div>
</Fragment>, (p, n) => p.message.name === n.message.name && p.message.role === n.message.role && p.message.text === n.message.text);