export default class
{
    get(name)
    {
        return this.getAll()?.[name];
    }

    getAll()
    {
        if(!document.cookie.length) return; const pairs = document.cookie.split(';'), cookies = {};

        for(const value of pairs) ((name, value) => cookies[(name).trim()] = decodeURIComponent(value))(...value.split('='))

        return cookies;
    }

    set(name, value = '', days = 30)
    {
        const date = new Date(); date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        document.cookie = [`${name}=${value}`, `expires=${date.toUTCString()}`, 'path=/', 'secure=true'].join('; ');
    }
}