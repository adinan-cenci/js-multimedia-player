interface Player 
{
    /** 
     * @var boolean 
     * @readonly 
     */
    playing;

    /** 
     * @var boolean 
     * @readonly 
     */
    paused;

    /** 
     * @var boolean 
     * @readonly 
     */
    reproducing;

    /** 
     * @var float Seconds
     * @readonly 
     */
    duration;

    /** 
     * @var float Seconds
     * @readonly 
     */
    currentTime;

    /** 
     * @var float Seconds
     * @readonly
     */
    remainingTime;

    /** 
     * @var string ISO 8601 formated as hh:mm:ss
     * @readonly 
     */
    currentTimer;

    /** 
     * @var string ISO 8601 formated as hh:mm:ss
     * @readonly 
     */
    remainingTimer;

    /** 
     * @var float 
     * @readonly 
     */
    currentPercentage;

    /** 
     * @var float 
     * @readonly
     */
    remainingPercentage;

    //////////////////////////////
    //          METHODS
    //////////////////////////////

    /**
     * @param object settings
     */
    contructor(settings);
    
    /**
     * @param object data
     */
    setData(data);

    /**
     * @param float|string time Accepts:
     * - A float, 
     * - An ISO 8601 formated string hh:mm:ss
     * - a numerical string suffixed with %
     */
    play(time = null);

    pause();

    /**
     * @param float|string time Accepts:
     * - A float, 
     * - An ISO 8601 formated string hh:mm:ss
     * - a numerical string suffixed with %
     */
    setCurrentTime(time);

    /** 
     * @param int vol Between 0 and 100
     */
    setVolume(vol);

    /**
     * Returns the seconds that correspond to perc
     * @method
     * @param integer perc
     * @return float
     */
    percent(perc);

    // CALLBACKS 
     
    onError(error);
    onEnded();

    /** called as the song progress */
    onTimeupdate();
    
    /** called when started, paused, resumed, ended etc */
    onStateChange(code);
}