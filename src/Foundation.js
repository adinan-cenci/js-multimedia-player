'use strict';

/**
 * @event 'player:error'
 * @description Fired when an error ocurred at any moment in the lifecycle.
 * The event is detailed by an error object containing two proprieties: "errorCode" and "errorMessage".
 *
 * @event 'player:ended'
 * @description Fired when the playback has reached its end.
 *
 * @event 'player:playing'
 * @description Fired when the playback is ready to start after having been previously paused due to lack of data.
 *
 * @event 'player:play'
 * @description Fired when the player starts playing.
 *
 * @event 'player:pause'
 * @description Fired when the player is paused.
 *
 * @event 'player:waiting'
 * @description Fired when when playback has stopped because of a temporary lack of data.
 *
 * @event 'player:timeupdate'
 * @description Continualy fired as the reproduction progresses.
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
     * Appends the media player to a specified HTML element and returns a promise.
     * This promise is resolved once the player is fully set up and ready to be used.
     * Note that readiness to play and readiness to reproduce may differ; see the 'playing()' method.
     *
     * @param HTMLElement parentElement
     *   The HTML element to which the player will be appended.
     *
     * @return Promise
     *   A promise that resolves when the player is set up and ready for use.
     */
    appendTo(parentElement)
    {
        parentElement.append(this);
        return new Promise(async (success, fail) => { return success(); });
    }

    /**
     * Basically the same as appendTo(), but the player will be inserted
     * before the first child of the specified element.
     */
    prependTo(parentElement)
    {
        parentElement.prepend(this);
        return new Promise(async (success, fail) => { return success(); });
    }

    /**
     * Basically the same as appendTo(), but the player will be inserted
     * into the siblingElement's parent, after the siblingElement.
     */
    appendAfter(siblingElement)
    {
        siblingElement.after(this);
        return new Promise(async (success, fail) => { return success(); });
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
     * Indicates whether media reproduction is currently in progress.
     *
     * This property differs from 'isPlaying' in that a player can be "playing" while
     * waiting for the buffer to load, but it may not be actively reproducing content.
     * When 'isReproducing' is 'true', 'isWaiting' must be 'false'.
     * 
     * @return bool
     */
    get isReproducing()
    {
        return this.state.isReproducing;
    }

    /**
     * Indicates whether the player is unable to reproduce due to lack of data.
     * When 'true', isReproducing must be false.
     *
     * @return bool
     */
    get isWaiting()
    {
        return this.state.isWaiting;
    }

    /**
     * Indicates whether the player is currently buffering content.
     *
     * 'isBuffering' differs from 'isWaiting' in that 'isWaiting' is only 'true'
     * when media reproduction has caught up with the buffer.
     *
     * A player may be capable of buffering and reproducing content simultaneously.
     * Therefore, it is possible for 'isBuffering' to be 'true' while 'isWaiting' is 'false'.
     *
     * @return bool
     *   'true' if the player is currently buffering content; otherwise, 'false'.
     */
    get isBuffering()
    {
        return this.state.isBuffering;
    }

    /**
     * Indicates whether the media has finished playing.
     *
     * @return bool
     *   'false' if isReproducing is 'true'.
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
     * @return float
     *   Seconds
     */
    get currentTime() 
    {
        // Implementation specific.
    }

    /**
     * Retrieves the current playback time formatted as an ISO 8601 string (hh:mm:ss).
     *
     * @return string
     *   The formatted current playback time.
     */
    get currentTimeFormatted()
    {
        return Foundation.secondsToStringRepresentation(this.currentTime);
    }

    /**
     * Retrieves the current playback time as a parcentage of the full duration.
     *
     * @return float
     *   A percentage.
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
     * Return the remaining time as an ISO 8601 string ( hh:mm:ss ).
     *
     * @return string
     */
    get remainingTimeFormatted()
    {
        return Foundation.secondsToStringRepresentation(this.remainingTime);
    }
 
    /**
     * Return the remaining time as a percentage of the full duration.
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
        // Implementation specific.
    }

    /**
     * Return the duration of the media as an ISO 8601 string ( hh:mm:ss ).
     *
     * @return string
     */
    get durationFormatted()
    {
        return Foundation.secondsToStringRepresentation(this.duration);
    }

    /**
     * Returns the time in seconds corresponding to a given percentage of the full duration.
     *
     * @param int|float percentage
     *   The percentage between 0 and 100.
     *
     * @return int|float
     *   The time in seconds corresponding to the given percentage.
     */
    getTime(percentage)
    {
        return Math.round((this.duration / 100) * percentage);
    }
 
    /**
     * Returns the time corresponding to a given percentage of the full duration
     * as an ISO 8601 formatted string (hh:mm:ss).
     *
     * @param float|int perc
     *   Between 0 and 100.
     *
     * @return string
     */
    getTimeFormatted(percentage)
    {
        return Foundation.secondsToStringRepresentation(this.getTime(percentage));
    }
 
    /**
     * Returns the playback's percentage corresponding to time.
     *
     * @param float|string
     *   Seconds in the form of a float or
     *   an ISO 8601 formatted string ( hh:mm:ss ).
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
     * Seeks the media to the new position.
     *
     * @time int|float|string time
     *   It accepts:
     *   - Seconds as a float or int.
     *   - An ISO 8601 formatted string ( hh:mm:ss ).
     *   - A percentege ( a numerical string suffixed by % ).
     */
    seek(time) 
    {
        // Implementation specific.
    }

    /**
     * Starts/resume the reproduction of the media.
     * It accepts the same parameters as seek().
     *
     * @time int|float|string time.
     *
     * @return Promise
     */
    play(time = null) 
    {
        // Implementation specific.
    }

    /**
     * Pauses the player.
     */
    pause() 
    {
        // Implementation specific.
    }

    /**
     * Resumes playing, or pauses, it depends on the current state.
     */
    toggle()
    {
        this.isPlaying
            ? this.pause()
            : this.play();
    }

    //--------------

    /**
     * Transform everything into seconds,
     * ISO 8601 string, perc% strings etc.
     *
     * @param float|int|string time
     *   It accepts:
     *   - ISO 8601 string, transforming it in seconds.
     *   - A percentege ( a numerical string suffixed by % ),
     *     it depends on the duration of the media.
     *
     * @return float
     *   Seconds.
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

    /**
     * An helper function, more for briviety sake than anything else.
     *
     * @param string eventName.
     * @param mixed detail
     * @param bool bubbles
     *
     * @return bool
     */
    fireEvent(eventName, detail, bubbles = true)
    {
        var options = {
            bubbles
        };

        if (detail != null) {
            options.detail = detail;
        }

        var event = new CustomEvent(eventName, options);

        return this.dispatchEvent(event);
    }

    log(msg)
    {
        // Implementation specific.
        console.log(msg);
    }

    /**
     * Format seconds into a ISO 8601 string ( hh:mm:ss ).
     *
     * @param float|int seconds
     *
     * @returns string
     *   An ISO 8601 string.
     */
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
    
        min     = min < 10 ? '0' + min : min;
        sec     = sec < 10 ? '0' + sec : sec;
    
        string = min + ':' + sec;
        string = hor > 0 ? hor + ':' + string : string;
    
        return string;
    }

    /**
     * Parses an ISO 8601 string ( hh:mm:ss ).
     *
     * @param string
     *   An ISO 8601 string ( hh:mm:ss ).
     *
     * @returns int
     *   The equivalent in seconds.
     */
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
    
        seconds = (hor * 3600) + (min * 60) + sec;
    
        return seconds;
    }
}

export default Foundation;
