import Parent from "./Parent.jsx";

export default new class extends Parent
{
    subscribe (instance, callback, getState, api)
    {
        if(this.async[instance]) return false; this.async[instance] = setInterval(() => callback([getState(), api, this]) && clearInterval(this.async[instance]), 200);
    }
}