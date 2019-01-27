import Player from './Player.js';
import loadExternalJs from './functions.js';

class PlayerYouTube extends Player 
{
    constructor(settings = null) 
    {
        super();

        this.settings = this.defaults;

        if (typeof settings == 'string') {
            this.settings.wrapperId = settings;
        } else {
            this.settings = {...this.defaults, ...settings};
        }

        this.wrapper        = null;
        this.data           = null;
        this.sdkReady       = false;
        this.playerReady    = false;
        this.ytPlayer       = null;
        this.volume         = 100;
        this.follower       = null;     // time interval
        this.currentTime    = 0;
    }

    get duration() 
    {
        if (this.ytPlayer && this.ytPlayer.getDuration) {
            return this.ytPlayer.getDuration();
        }

        return 0;
    }

    async setData(data) 
    {
        this.data = data;

        if (! this.sdkReady) {
            return this.setupSdk().then(() =>
            {
                return this.setData(data);
            });
        }

        this.reset();
        this.startFollowing();
        return this.initializePlayer().then(() =>
        {
            this.playerReady = true;
            this.play();
        });
    }

    play(time = null) 
    {
        if (time) {
            this.setCurrentTime(time);
        }
        this.ytPlayer.playVideo();
    }

    pause() 
    {
        this.ytPlayer.pauseVideo();
    }

    setCurrentTime(time) 
    {
        var seconds = this.sanitizeGetSeconds(time);
        this.ytPlayer.seekTo(seconds, true)
    }

    setVolume(vol) 
    {
        this.volume = vol;
        this.ytPlayer.setVolume(vol);
    }

    cuePlaylist(id, index = null, startSeconds = 0, suggestedQuality = null) 
    {
        this.ytPlayer.cuePlaylist(id);
    }

    async setupSdk() 
    {
        var gxi = this;
        this.deployRootDiv();
        return this.loadSdk().then(function(m) 
        {
            console.log(m)
            gxi.sdkReady = true;
        });
    }

    reset() 
    {
        this.stopFollowing();
        if (! this.ytPlayer) {
            return;
        }

        this.ytPlayer.destroy();
        this.ytPlayer = null;
    }

    deployRootDiv() 
    {
        var youtubeDiv, w;
        w = document.getElementById(this.settings.wrapperId);
        if (w) {
            this.wrapper = w;
        } else {
            this.wrapper       = document.createElement('div')
            this.wrapper.id    = this.settings.wrapperId;
            document.body.append(this.wrapper);
        }

        youtubeDiv          = document.createElement('div')
        youtubeDiv.id       = this.settings.embbedId;

        this.wrapper.append(youtubeDiv);
    }

    async loadSdk() 
    {
        return new Promise((success, fail) =>
        {
            loadExternalJs("https://www.youtube.com/iframe_api").then(function() {
                console.log('SDK: loaded');
                setTimeout(function(){success('SDK: ready');}, 500);
            }, function() {
                fail();
                this.callBackOnError('Error loading');
            });
        });
    }

    async initializePlayer() 
    {
        return new Promise((success, fail) => 
        {
            var width   = this.settings.width;
            var height  = this.settings.height;

            if (this.settings.width == 'auto') {
                width = this.wrapper.offsetWidth;
                height = width / 1.77;
            }

            this.ytPlayer = new YT.Player(this.settings.embbedId, 
            {
                width           : width,
                height          : height,
                videoId         : this.data.id, 
                startSeconds    : 0, 
                playerVars      : { 'autoplay': 1, 'controls': 1 }, 
                events          : 
                {
                    onReady(event) 
                    {
                        success('PLAYER: ready');
                        this.callBackOnReady(event);
                    },
                    onStateChange: this.callBackOnStateChange.bind(this),
                    onError(errorCode) 
                    {
                        switch (errorCode) 
                        {
                            case 2:
                                console.log('Error 2: parametros invalidos.');
                            break;
                            case 5:
                                console.log('Error 5: Ocorreu um erro relacionado ao player HTML5.');
                            break;
                            case 100:
                                console.log('Error 100: O vídeo não foi encontrado.');
                            break;
                            case 101:
                            case 150:
                                console.log('Error 101: O proprietário do vídeo não permite que ele seja reproduzido em players incorporados.');
                            break;
                        }

                        fail(errorCode);
                        this.callBackOnError(errorCode);
                    }
                }
            });
        });
    }

    /*-------------------*/

    startFollowing() 
    {
        this.follower = setInterval(this.following.bind(this), 1000);
    }

    stopFollowing() 
    {
        clearInterval(this.follower);
    }

    following()
    {
        var t = this.ytPlayer && this.ytPlayer.getCurrentTime ? this.ytPlayer.getCurrentTime() : 0;
        
        if (t != this.currentTime) {
            this.currentTime = t;
            this.callBackOnTimeupdate();
        }
    }

    /*-------------------*/

    callBackOnReady(event) 
    {
        this.setVolume(this.volume);
        this.onReady(event);
    }

    callBackOnStateChange(e) 
    {
        /*
        -1 = não iniciado
        0  = encerrado
        1  = em reprodução
        2  = em pausa
        3  = armazenando em buffer
        5  = vídeo cued
        */

        var code = e.data;

        console.log('code', code)

        switch (code) {
            case -1: /* não iniciado */
                console.log('-1 não iniciado');
                this.reproducing    = false;
                this.playing        = false;
                this.paused         = false;            
            break;
            case 0: /* encerrado */
                console.log('0 encerrado');
                this.reproducing    = false;
                this.playing        = false;
                this.paused         = false;
                this.callBackOnEnded();
            break;
            case 1: /* em reprodução */
                console.log('1 em reprodução');
                this.reproducing    = true;
                this.playing        = true;
                this.paused         = false;
                this.callbackOnReproducing();
            break;
            case 2: /* em pausa */
                console.log('2 em pausa');
                this.reproducing    = false;
                this.playing        = false;
                this.paused         = true;            
            break;
            case 3: /* armazenando em buffer */
                console.log('3 buffering');
                this.reproducing    = false;
                this.playing        = true;
                this.paused         = false;            
            break;
            case 5: /* vídeo cued */
                console.log('5 vídeo pronto');
                this.play(0)
            break;
        }
        
        this.onStateChange(code);
    }

    callBackOnError(error) 
    {
        this.onError(error);
    }

    callbackOnReproducing() 
    {
        this.startFollowing();
    }

    callBackOnEnded() 
    {
        this.stopFollowing();
        this.onEnded();
    }

    callBackOnTimeupdate() 
    {
        this.onTimeupdate();
    }
}

PlayerYouTube.prototype.defaults = 
{
    wrapperId   : 'youtube-wrapper', 
    embbedId    : 'youtube-embbeded', 
    width       : 640, 
    height      : 360
};

export default PlayerYouTube;