'use strict';

class Event
{
    constructor(name, object)
    {
        this.name       = name;
        this.object     = object;
        this.callbacks  = [];
    }

    addCallback(callback)
    {
        if (this.callbacks.indexOf(callback) >= 0) {
            return;
        }

        this.callbacks.push(callback);
    }

    removeCallback(callback)
    {
        if (! this.callbacks.length) {
            return;
        }

        var index = this.callbacks.indexOf(callback);

        if (index < 0) {
            return;
        }

        delete this.callbacks[index];
    }

    fire(data = {})
    {
        if (! this.callbacks.length) {
            return;
        }

        for (var callback of this.callbacks) {
            callback.call(this.object, data);
        }
    }
}

module.exports = Event;
