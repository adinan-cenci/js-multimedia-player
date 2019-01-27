import Player from './Player.js';
import loadExternalJs from './functions.js';

class PlayerAudio extends Player 
{
    constructor(settings = null) 
    {
        super();

        if (settings == null) {
            this.settings = this.defaults;
        } else {
            this.settings = {...this.defaults, ...settings};
        }

        this.currentTime    = 0;
        this.mediaP         = this.createMedia();
        this.source         = null;
        this.mediaP.addEventListener('play',        this.evtPlay.bind(this));
        this.mediaP.addEventListener('pause',       this.evtPause.bind(this));
        this.mediaP.addEventListener('timeupdate',  this.evtTimeupdate.bind(this));
        this.mediaP.addEventListener('ended',       this.evtEnded.bind(this));
        this.mediaP.addEventListener('error',       this.evtError.bind(this));
        this.mediaP.addEventListener('waiting',     this.evtWaiting.bind(this));
    }

    createMedia() 
    {
        return new Audio();
    }

    get duration() 
    {
        return this.mediaP.duration;
    }

    setData(data) 
    {
        this.data = data;
        this.newSource(data.file);
        this.mediaP.play();
    }

    play(time = this.currentTime) 
    {
        this.setCurrentTime(time);
        return this.mediaP.play();
    }

    pause() 
    {
        this.mediaP.pause();
    }

    setCurrentTime(time) 
    {
        var seconds = this.sanitizeGetSeconds(time);
        this.mediaP.currentTime = seconds;
    }

    setVolume(value) 
    {
        if (value > 1 && value < 10) { 
            value /= 10
        } else if (value >= 10) {
            value /= 100
        }

        this.mediaP.volume = value;
    }

    newSource(source) 
    {
        this.mediaP.pause();
        
        this.source = source;
        this.mediaP.src = source;
    }

    evtPause(evt) 
    {
        this.paused         = true;
        this.reproducing    = false;
        this.playing        = false;
    }

    evtPlay(evt) 
    {
        this.paused         = false;
        this.playing        = true;
    }

    evtEnded(evt) 
    {
        this.playing        = false;
        this.paused         = false;
        this.reproducing    = false;
        this.onEnded(evt);
    }

    evtTimeupdate(evt) 
    {
        this.reproducing    = true;
        this.currentTime    = this.mediaP.currentTime;
        this.onTimeupdate(evt);
    }

    evtError(evt) 
    {
        this.onError();
    }

    evtWaiting(evt) 
    {
        this.reproducing = false;
    }
}

PlayerAudio.prototype.defaults = {};

export default PlayerAudio;