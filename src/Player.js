'use strict';

const EventfulObject = require('./EventfulObject.js');

class Player extends EventfulObject
{
    constructor()
    {
        super();

        this.state =
        {
            paused          : false,
            playing         : false,
            reproducing     : false,
            buffering       : false,
            waiting         : false,
            ended           : false,
            volume          : 100
        }
    }

    get paused()
    {
        return this.state.paused;
    }

    get playing()
    {
        return this.state.playing;
    }

    get buffering()
    {
        return this.state.buffering;
    }

    get reproducing()
    {
        return this.state.reproducing;
    }

    get waiting()
    {
        return this.state.waiting;
    }

    get ended()
    {
        return this.state.ended;
    }

    get volume()
    {
        return this.state.volume;
    }

    //--------------

    get remainingTime()
    {
        return this.duration - this.currentTime;
    }

    //--------------

    get formattedDuration()
    {
        return Player.secondsToStringRepresentation(this.duration);
    }

    get formattedCurrentTime()
    {
        return Player.secondsToStringRepresentation(this.currentTime);
    }

    get formattedRemainingTime()
    {
        return Player.secondsToStringRepresentation(this.remainingTime);
    }

    //--------------

    toggle()
    {
        if (this.playing) {
            this.pause();
            return;
        }

        this.play();
    }

    //--------------

    get currentPercentage()
    {
        var time, duration;

        time        = Math.round(this.currentTime);
        duration    = Math.round(this.duration);

        if (isNaN(time) || isNaN(duration)) {
            return 0;
        }

        if (time == 0 || duration == 0) {
            return 0;
        }

        return (time / duration) * 100;
    }

    get remainingPercentage()
    {
        return 100 - this.currentPercentage;
    }

    //--------------

    getTime(perc)
    {
        return Math.round((this.duration / 100) * perc);
    }

    getFormattedTime(perc)
    {
        return Player.secondsToStringRepresentation(this.getTime(seconds));
    }

    //--------------

    getPercentage(time)
    {
        var seconds;

        if (typeof time == 'string' && time.indexOf(':') >= 0) {
            seconds = Player.stringRepresentationToSeconds(time);
        } else {
            seconds = parseFloat(time);
        }

        return (seconds / this.duration) * 100
    }

    //--------------

    sanitizeGetSeconds(time)
    {
        var seconds;

        if (typeof time == 'string' && time.indexOf(':') >= 0) {
            seconds = Player.stringRepresentationToSeconds(time);
        } else if (typeof time == 'string' && time.indexOf('%') >= 0) {
            seconds = this.getTime(parseInt(time));
        } else if (typeof time == 'string') {
            seconds = parseInt(time);
        } else {
            seconds = time;
        }

        if (isNaN(seconds)) {
            seconds = 0;
        }

        return seconds;
    }

    //--------------

    log(msg)
    {
        console.log(msg);
    }
}

Player.secondsToStringRepresentation = function(seconds)
{
    if (isNaN(seconds)) {
        return '00:00';
    }

    var hours, minutes, seconds, hor, min, sec, string;

    seconds = Math.round(seconds);
    minutes = Math.floor(seconds / 60);
    hours   = Math.floor(minutes / 60);

    hor     = hours;
    min     = minutes - (hours * 60);
    sec     = seconds - (minutes * 60);

    min     = min < 10 ? '0'+min : min;
    sec     = sec < 10 ? '0'+sec : sec;

    string = min+':'+sec;
    string = hor > 0 ? hor+':'+string : string;

    return string;
}

Player.stringRepresentationToSeconds = function(string)
{
    var seconds, matches, hor, min, sec;

    matches = string.match(/[0-9]+/g);

    if (matches.length > 3) {
        return false;
    }

    sec = parseInt(matches[matches.length - 1]);
    min = parseInt(matches[matches.length - 2] || 0);
    hor = parseInt(matches[matches.length - 3] || 0);

    seconds = hor * 3600 + min * 60 + sec;

    return seconds;
}

module.exports = Player;
