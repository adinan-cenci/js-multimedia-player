'use strict';

/**
 * player:error Passes an object to the listener containing two proprieties: "errorCode" and "errorMessage".
 * player:ended
 * player:playing Fired when the playback is ready to start after having been paused due to lack of data
 * player:play
 * player:pause
 * player:waiting Fired when when playback has stopped because of a temporary lack of data
 * player:timeupdate Fired as the reproduction progresses
 */
class Foundation extends HTMLElement 
{
    constructor()
    {
        super();

        this.state =
        {
            isPaused        : false,
            isPlaying       : false,
            isReproducing   : false,
            isBuffering     : false,
            isWaiting       : false,
            isEnded         : false,
            volume          : 100
        }
    }

    /**
     * @return bool
     */
    get isPaused()
    {
        return this.state.isPaused;
    }

    /**
     * @return bool
     */
    get isPlaying()
    {
        return this.state.isPlaying;
    }

    /**
     * @return bool
     */
    get isBuffering()
    {
        return this.state.isBuffering;
    }

    /**
     * Indicates whether reproduction is in progress.
     * When true, isWaiting must be false.
     * 
     * @return bool
     */
    get isReproducing()
    {
        return this.state.isReproducing;
    }

    /**
     * Indicates whether the player is unable to reproduce due to lack of data.
     * When true, isReproducing must be false.
     *
     * @return bool
     */
    get isWaiting()
    {
        return this.state.isWaiting;
    }

    /**
     * Indicates whether the media has finished playing.
     *
     * @return bool
     */
    get isEnded()
    {
        return this.state.isEnded;
    }

    /**
     * An integer between 0 and 100
     * 
     * @return int
     */
    get volume()
    {
        return this.state.volume;
    }

    /**
     * Return the current playback time in seconds.
     * 
     * @return float seconds
     */
    get currentTime() 
    {
        // To implement
    }

    /**
     * Return the current playback time formated as an ISO 8601 string ( hh:mm:ss )
     *
     * @return string
     */
    get currentTimeFormatted()
    {
        return Foundation.secondsToStringRepresentation(this.currentTime);
    }

    /**
     * Return the current playback time as a parcentage of the full duration.
     *
     * @return float
     */
    get currentTimePercentage()
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

    /**
     * Return the remaining time in seconds.
     *
     * @return float
     */
    get remainingTime()
    {
        return this.duration - this.currentTime;
    }

    /**
     * Return the remaining time as an ISO 8601 string ( hh:mm:ss )
     *
     * @return string
     */
    get remainingTimeFormatted()
    {
        return Foundation.secondsToStringRepresentation(this.remainingTime);
    }
 
    /**
     * Return the remaining time as a percentage.
     *
     * @return float
     */
    get remainingTimePercentage()
    {
        return 100 - this.currentTimePercentage;
    }

    /**
     * Return the length of the media in seconds.
     *
     * @return float seconds
     */
    get duration() 
    {
        // To implement
    }

    /**
     * Return the duration of the media as an ISO 8601 string ( hh:mm:ss )
     *
     * @return string
     */
    get durationFormatted()
    {
        return Foundation.secondsToStringRepresentation(this.duration);
    }

    /**
     * Returns in seconds the time corresponding to percentage%.
     *
     * @param float|int percentage Between 0 and 100
     *
     * @return float|int seconds
     */
    getTime(percentage)
    {
        return Math.round((this.duration / 100) * percentage);
    }
 
    /**
     * Returns in a ISO 8601 formatted string ( hh:mm:ss ) the time corresponding to percentage%.
     *
     * @param float|int perc Between 0 and 100
     *
     * @return string
     */
    getTimeFormatted(percentage)
    {
        return Foundation.secondsToStringRepresentation(this.getTime(percentage));
    }
 
    /**
     * Returns the playback's percentage corresponding to time
     *
     * @param float|string Seconds in the form of a float or an ISO 8601 formatted string ( hh:mm:ss )
     * 
     * @return float
     */
    getPercentage(time)
    {
        var seconds;
 
        if (typeof time == 'string' && time.indexOf(':') >= 0) {
            seconds = Foundation.stringRepresentationToSeconds(time);
        } else {
            seconds = parseFloat(time);
        }

        return (seconds / this.duration) * 100
    }

    //--------------

    /**
     * Seeks the media to the new position
     *
     * @time int|float|string time, it accepts:
     * - seconds as a float or int
     * - an ISO 8601 formatted string ( hh:mm:ss )
     * - a percentege ( a numerical string suffixed by % )
     */
    seek(time) 
    {
        // To implement
    }

    /**
     * Starts/resume the reproduction of the media.
     * It accepts the same parameters as seek()
     *
     * @time int|float|string time
     *
     * @return Promise
     */
    play(time = null) 
    {
        // To implement
    }

    pause() 
    {
        // To implement
    }

    toggle()
    {
        this.isPlaying
            ? this.pause()
            : this.play();
    }

    //--------------

    /**
     * Transform everything into seconds, 
     * ISO 8601 string, n% strings etc
     *
     * @param float|int|string time 
     *
     * @return float
     */
    sanitizeGetSeconds(time)
    {
        var seconds;

        if (typeof time == 'string' && time.indexOf(':') >= 0) {
            seconds = Foundation.stringRepresentationToSeconds(time);
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

    fireEvent(eventName, detail, bubbles = true)
    {
        return this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: bubbles,
            detail: detail
        }));
    }

    log(msg)
    {
        console.log(msg);
    }

    static secondsToStringRepresentation(seconds)
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
    
    static stringRepresentationToSeconds(string)
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
}

export default Foundation;
