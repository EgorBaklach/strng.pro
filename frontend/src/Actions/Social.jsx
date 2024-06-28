import Renderer from "../Plugins/Renderer.jsx";

export default {
    update(instance, id, count, value, {Socier}, api, stream)
    {
        if(!Socier.loaded) return false; if(instance === 'visits' && Socier.visits[id]) return true;

        api.request(instance, 'POST', '/blog/' + id + '/' + instance + '/update/index.json', JSON.stringify({value}))
            .then(({uid}) => Renderer.socket.emit('call', ['social', instance, uid, id, count, value]))
            .catch(e => !e?.in_process && api.remove(instance) && stream.remove(instance + id))

        return true;
    }
}