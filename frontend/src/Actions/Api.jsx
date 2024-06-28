export default {
    request: (instance, ...props) => (dispatch, getState, {api}) => api.request(instance, ...props).catch(e => !e?.in_process && api.remove(instance)),
    remove: (instance) => (dispatch, getState, {api}) => api.remove(instance),
}