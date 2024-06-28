import Parent from "./Parent.jsx";

export default new class extends Parent
{
    headers = {'Content-Type': 'application/json; charset=utf-8'};

    async request(operation, method, path, body)
    {
        if(this.async[operation]) throw {abort: true, in_process: true, message: 'In process'}; this.async[operation] = true;

        const response = await new Promise(r => setTimeout(() => r(fetch(location.origin + path, {method, body, headers: this.headers}).then(r => r.json())), 250));

        if(method === 'POST' && !response?.success) throw response?.abort ?? {abort: true, message: 'Internal Error'}; return response;
    }
}