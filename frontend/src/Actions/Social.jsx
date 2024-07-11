import Renderer from "../Plugins/Renderer.jsx";

export default {
    update(instance, id, count, value, {Socier}, api, stream)
    {
        if(!Socier.loaded) return false; if(instance === 'visits' && Socier.visits[id]) return true;

        api.request(instance, 'POST', '/blog/' + id + '/' + instance + '/update/index.json', value)
            .then(({uid}) => Renderer.socket.emit('call', ['social', instance, uid, id, count, value]))
            .catch(e => Renderer.catch(e, instance) && stream.remove(instance + id))

        return true;
    }
}