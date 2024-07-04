export default {
    request: (instance, ...props) => (dispatch, getState, {api}) => api.request(instance, ...props),
    remove: (instance) => (dispatch, getState, {api}) => api.remove(instance),
}