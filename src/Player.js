'use strict';

// abstract class
class Player
{
    toggle()
    {
        if (this.playing) {
            this.pause();
            return;
        }

        this.play();
    }

    get remainingTime()
    {
        return this.duration - this.currentTime;
    }

    get durationTimer()
    {
        return Player.secondsToStringRepresentation(this.duration);
    }

    get currentTimer()
    {
        return Player.secondsToStringRepresentation(this.currentTime);
    }

    get remainingTimer()
    {
        return Player.secondsToStringRepresentation(this.remainingTime);
    }

    /** returns the completed percentage of the audio */
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

    seek(time)
    {
        return this.setCurrentTime(time);
    }

    /**
     * Returns the seconds that correspond to perc %
     * @param perc float Percentual
     * @param bool formated If true, it will return an ISO 8601 formated string
     */
    getSeconds(perc, formated = false)
    {
        var seconds = Math.round((this.duration / 100) * perc);

        if (! formated) {
            return seconds;
        }

        return Player.secondsToStringRepresentation(seconds);
    }

    /**
     * Returns the percentage corresponding to time
     * @param time int|float|string Time, either a number or ISO 8601 formated string
     * @return float
     */
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

    sanitizeGetSeconds(time)
    {
        var seconds;

        if (typeof time == 'string' && time.indexOf(':') >= 0) {
            seconds = Player.stringRepresentationToSeconds(time);
        } else if (typeof time == 'string' && time.indexOf('%') >= 0) {
            seconds = this.getSeconds(parseInt(time));
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

    log(msg)
    {
        console.log(msg);
    }

    onReady() {}

    onError(error)
    {
        this.log(error);
    }

    onEnded() {}

    onTimeupdate() {}

    onStateChange(code) {}
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

Player.prototype.paused         = false;
Player.prototype.playing        = false;
Player.prototype.reproducing    = false;
Player.prototype.buffering      = false;
Player.prototype.waiting        = false;

// export default Player;
module.exports = Player;
