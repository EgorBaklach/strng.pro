export default class
{
    async = {};

    remove(operation)
    {
        delete this.async[operation]; return true;
    }
}