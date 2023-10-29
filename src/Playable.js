'use strict';

/**
 * Continualy fired as the reproduction progresses.
 *
 * @event Playable#playable:timeupdate
 */

/**
 * Fired when an error ocurred at any moment in the lifecycle. <br>
 * It is detailed by two proprieties: <code>errorCode</code> and <code>errorMessage</code>
 * 
 * @event Playable#playable:error
 * @type {object}
 */

/**
 * Fired when the reproduction has reached its end.
 * 
 * @event Playable#playable:ended
 */

/**
 * Fired when when reproduction has stopped because of a temporary lack of data.
 * 
 * @event Playable#playable:waiting
 */

/**
 * Fired when the reproduction is ready to start after having been previously paused due to lack of data.
 * 
 * @event Playable#playable:playing
 */

/**
 * Fired when the player starts playing.
 * 
 * @event Playable#playable:play
 */

/**
 * Fired when the player is paused.
 * 
 * @event Playable#playable:pause
 */

/**
 * Base class and interface.
 * 
 * @fires Playable#playable:playing
 * @fires Playable#playable:waiting
 * @fires Playable#playable:ended
 * @fires Playable#playable:error
 * @fires Playable#playable:timeupdate
 */
class Playable extends HTMLElement 
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
     * Appends the media player to a specified HTML.
     *
     * @param {HTMLElement} parentElement
     *   The HTML element to which the player will be appended to.
     *
     * @return {Promise}
     *   This promise is resolved once the player is fully set up and ready to be used.<br>
     *   <b>Note</b>: Readiness to play and readiness to reproduce are not the same; see the <code>playing()</code> method.
     */
    appendTo(parentElement)
    {
        parentElement.append(this);
        return new Promise(async (success, fail) => { return success(); });
    }

    /**
     * Inserts the player before the first child of the <code>parentElement</code>.
     * 
     * @param {HTMLElement} parentElement
     *   The HTML element to which the player will be appended to.
     *
     * @return {Promise}
     *   This promise is resolved once the player is fully set up and ready to be used.<br>
     *   <b>Note</b>: Readiness to play and readiness to reproduce are not the same; see the <code>playing()</code> method.
     */
    prependTo(parentElement)
    {
        parentElement.prepend(this);
        return new Promise(async (success, fail) => { return success(); });
    }

    /**
     * Inserts the player in the children list of the <code>siblingElement</code>'s parent, 
     * just after the <code>siblingElement</code>.
     * 
     * @param {HTMLElement} siblingElement
     *   The HTML element to which the player will proceed.
     *
     * @return {Promise}
     *   This promise is resolved once the player is fully set up and ready to be used.<br>
     *   <b>Note</b>: Readiness to play and readiness to reproduce are not the same; see the <code>playing()</code> method.
     */
    appendAfter(siblingElement)
    {
        siblingElement.after(this);
        return new Promise(async (success, fail) => { return success(); });
    }

    /**
     * Self-explanatory.
     *
     * @readonly
     * @type {bool}
     */
    get isPaused()
    {
        return this.state.isPaused;
    }

    /**
     * Self-explanatory.
     *
     * @readonly
     * @type {bool}
     */
    get isPlaying()
    {
        return this.state.isPlaying;
    }

    /**
     * Indicates whether reproduction is currently in progress.<br>
     *
     * This property differs from <code>isPlaying</code> in that a player can be "playing" while
     * waiting for the buffer to load, but it may not be actively "reproducing" content.<br>
     *
     * When <code>isReproducing</code> is <code>true</code>, <code>isWaiting</code> must be <code>false</code>.
     * 
     * @readonly
     * @type {bool}
     */
    get isReproducing()
    {
        return this.state.isReproducing;
    }

    /**
     * Indicates whether the player is unable to reproduce due to lack of data.<br>
     * When <code>true</code>, <code>isReproducing</code> must be <code>false</code>.
     *
     * @readonly
     * @type {bool}
     */
    get isWaiting()
    {
        return this.state.isWaiting;
    }

    /**
     * Indicates whether the player is currently buffering content.<br>
     *
     * <code>isBuffering</code> differs from <code>isWaiting</code> in that <code>isWaiting</code> is only <code>true</code>
     * when reproduction has caught up with the buffer.<br>
     *
     * A player may be capable of buffering and reproducing content simultaneously.<br>
     * Therefore, it is possible for <code>isBuffering</code> to be <code>true</code> while <code>isWaiting</code> is <code>false</code>.<br>
     *
     * @readonly
     * @type {bool}
     */
    get isBuffering()
    {
        return this.state.isBuffering;
    }

    /**
     * Indicates whether the media has finished playing.<br>
     * It must be <code>false</code> when <code>isReproducing</code> is <code>true</code>.
     *
     * @readonly
     * @type {bool}
     */
    get isEnded()
    {
        return this.state.isEnded;
    }

    /**
     * Returns the volume, an integer between 0 and 100.
     *
     * @readonly
     * @type {integer}
     */
    get volume()
    {
        return this.state.volume;
    }

    /**
     * Return the current playback time in seconds.
     * 
     * @readonly
     * @type {float}
     */
    get currentTime() 
    {
        // Implementation specific.
    }

    /**
     * Retrieves the current playback time formatted as an ISO 8601 string ( hh:mm:ss ).
     *
     * @readonly
     * @type {string}
     */
    get currentTimeFormatted()
    {
        return Playable.secondsToStringRepresentation(this.currentTime);
    }

    /**
     * Retrieves the current playback time as a parcentage of the <code>duration</code>.
     *
     * @readonly
     * @type {float}
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
     * @type {float}
     * @readonly
     */
    get remainingTime()
    {
        return this.duration - this.currentTime;
    }

    /**
     * Return the remaining time as an ISO 8601 string ( hh:mm:ss ).
     *
     * @readonly
     * @type {string}
     */
    get remainingTimeFormatted()
    {
        return Playable.secondsToStringRepresentation(this.remainingTime);
    }
 
    /**
     * Return the remaining time as a percentage of the <code>duration</code>.
     *
     * @readonly
     * @type {float}
     */
    get remainingTimePercentage()
    {
        return 100 - this.currentTimePercentage;
    }

    /**
     * Return the length of the media in seconds.
     *
     * @readonly
     * @type {float}
     */
    get duration() 
    {
        // Implementation specific.
    }

    /**
     * Return the duration of the media as an ISO 8601 string ( hh:mm:ss ).
     *
     * @readonly
     * @type {string}
     */
    get durationFormatted()
    {
        return Playable.secondsToStringRepresentation(this.duration);
    }

    /**
     * Returns the time in seconds corresponding to a given <code>percentage</code> of the <code>duration</code>.
     *
     * @param {number} percentage
     *   The percentage of the <code>duration</duration>.
     *
     * @return {number}
     *   Seconds.
     */
    getTime(percentage)
    {
        return Math.round((this.duration / 100) * percentage);
    }
 
    /**
     * Returns the time corresponding to a given <code>percentage</code> of the <code>duration</code>
     * as an ISO 8601 formatted string ( hh:mm:ss ).
     *
     * @param {number} percentage
     *   Between 0 and 100.
     *
     * @return {string}
     *   ISO 8601
     */
    getTimeFormatted(percentage)
    {
        return Playable.secondsToStringRepresentation(this.getTime(percentage));
    }
 
    /**
     * Returns the playback's percentage corresponding to <code>time</code>.
     *
     * @param {number|string} time
     *   Seconds in the form of a number <br>
     *   or an ISO 8601 formatted string ( hh:mm:ss ).
     * 
     * @return {number}
     *   Seconds
     */
    getPercentage(time)
    {
        var seconds;
 
        if (typeof time == 'string' && time.indexOf(':') >= 0) {
            seconds = Playable.stringRepresentationToSeconds(time);
        } else {
            seconds = parseFloat(time);
        }

        return (seconds / this.duration) * 100
    }

    //--------------

    /**
     * Seeks the media to the new position.
     *
     * @abstract
     *
     * @param {number|string} time
     *   It accepts:<br>
     *   - Seconds as a float or int.<br>
     *   - An ISO 8601 formatted string ( hh:mm:ss ).<br>
     *   - A percentege ( a numerical string suffixed by % ).
     */
    seek(time) 
    {
        // Implementation specific.
    }

    /**
     * Starts/resume the reproduction of the media.<br>
     * It accepts the same parameters as <code>seek()</code>.
     *
     * @fires Playable#playable:play
     * 
     * @param {number|string|null} time.
     *   Will seek to <code>time</code> when informed.<br>
     *   It accepts:<br>
     *   - Seconds as a float or int.<br>
     *   - An ISO 8601 formatted string ( hh:mm:ss ).<br>
     *   - A percentege ( a numerical string suffixed by % ).
     *
     * @return {Promise}
     *   It will resolved when reproduction has been started, or is rejected if for any reason playback cannot be started.
     */
    play(time = null) 
    {
        // Implementation specific.
    }

    /**
     * @fires Playable#playable:pause
     * 
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
     * @private
     *
     * @param {number|string} time
     *   It accepts:<br>
     *   - ISO 8601 string, transforming it in seconds.<br>
     *   - A percentege ( a numerical string suffixed by % ),
     *     it depends on the duration of the media.
     *
     * @return {number}
     *   Seconds.
     */
    sanitizeGetSeconds(time)
    {
        var seconds;

        if (typeof time == 'string' && time.indexOf(':') >= 0) {
            seconds = Playable.stringRepresentationToSeconds(time);
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
     * An helper function to fire a custom event.
     *
     * @private
     * 
     * @param {string} eventName.
     * @param {mixed} detail
     * @param {bool} bubbles
     *
     * @return {bool}
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
     * @private
     *
     * @param {number} seconds
     *
     * @returns {string}
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
     * @private
     *
     * @param {string}
     *   An ISO 8601 string ( hh:mm:ss ).
     *
     * @returns {number}
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

export default Playable;
