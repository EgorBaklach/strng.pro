export default class
{
    constructor(callback, ttl)
    {
        this.callback = callback;
        this.ttl = ttl;

        this.finish = false;
        this.interval = 0;
    }

    call(event)
    {
        if(this.finish) return; clearTimeout(this.interval); this.interval = setTimeout(() => this.finish = this.callback(event), this.ttl);
    }
}