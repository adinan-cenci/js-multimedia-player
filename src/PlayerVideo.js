import PlayerAudio from './PlayerAudio.js';

class PlayerVideo extends PlayerAudio 
{
    createMedia() 
    {
        var v = document.createElement('video');
        if (this.settings.wrapperId) {
            document.getElementById(this.settings.wrapperId).append(v);
        }
        return v;
    }
}

PlayerVideo.prototype.defaults = 
{
    wrapperId: null
};

export default PlayerVideo;