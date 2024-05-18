export default
{
    async: {},

    async post(operation, path, data)
    {
        if(this.async[operation]) throw {abort: true, in_process: true, message: 'In process'}; this.async[operation] = true;

        const response = await new Promise(r => setTimeout(() => r(fetch(location.origin + path, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(r => r.json())), 250));

        if(!response?.success) throw response?.abort ?? {abort: true, message: 'Internal Error'}; return response;
    }
}