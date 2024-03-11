export default class
{
    constructor(callback, ttl)
    {
        this.callback = callback; this.ttl = ttl; this.finish = false; this.index = 0; this.counter = 0;
    }

    call(...params)
    {
        if(this.finish) return undefined; clearTimeout(this.index); this.index = setTimeout(() => this.finish = ++this.counter && this.callback(...params), this.ttl);
    }
}