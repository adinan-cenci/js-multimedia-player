'use strict';

const Event = require('./Event.js');

class EventfulObject
{
    constructor()
    {
        this.events = {};
    }

    registerEvent(eventName)
    {
        return this.events[eventName] = new Event(eventName, this);
    }

    getEvent(eventName)
    {
        return this.events[eventName] ? this.events[eventName] : this.registerEvent(eventName);
    }

    addEventListener(eventName, listener)
    {
        this.getEvent(eventName).addCallback(listener);
        return this;
    }

    removeEventListener(eventName, listener)
    {
        this.getEvent(eventName).removeCallback(listener);
        return this;
    }

    dispatchEvent(eventName, data = {})
    {
        this.getEvent(eventName).fire(data);
    }
}

EventfulObject.arrayAddEventListener = function(array, event, listener)
{
    for (var item of array) {
        item.addEventListener(event, listener);
    }
}

module.exports = EventfulObject;
