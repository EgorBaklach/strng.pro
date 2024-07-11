import Editor from "../Reducers/Editor.jsx";
import Renderer from "../Plugins/Renderer.jsx";

export default {
    onEdit: message => dispatch => dispatch(Editor.actions.edit(['comments', message])),
    onDelete: ([id, aid, count]) => (dispatch, getState, {api}) => confirm('Вы действительно хотите удалить комментарий?') && api.request('dialog.delete', 'POST', '/comments/delete/index.json', JSON.stringify([id, aid]))
        .then(props => Renderer.socket.emit('call', ['dialog', 'comments', 'delete', {...props, aid, count}]))
        .catch(e => Renderer.catch(e, 'dialog.delete') && alert('Ошибка удаления сообщения'))
}