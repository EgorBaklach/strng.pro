import Renderer from "../Plugins/Renderer.jsx";

export default {
    dispatch: action => dispatch => dispatch(action),
    socket: (instance, uid, id, count, value) =>
        (dispatch, getState, {api}) =>
            api.post(instance, '/blog/' + id + '/' + instance + '/update/index.json', {value})
                .then(() => Renderer.socket.emit('call', ['social', instance, uid, id, count, value]))
                .catch(e => !e?.in_process && delete api.async[instance])
}