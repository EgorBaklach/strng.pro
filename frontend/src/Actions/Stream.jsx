export default {
    subscribe: (instance, callback) => (dispatch, getState, {stream, api}) => stream.subscribe(instance, callback, getState, api),
    clear: instance => (dispatch, getState, {stream}) => stream.remove(instance)
}