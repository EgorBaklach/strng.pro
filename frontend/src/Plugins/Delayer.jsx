export default class
{
    constructor(callback, ttl)
    {
        this.callback = callback; this.ttl = ttl; this.finish = false; this.interval = 0;
    }

    call(...params)
    {
        if(this.finish) return undefined; clearTimeout(this.interval); this.interval = setTimeout(() => this.finish = this.callback(...params), this.ttl);
    }
}