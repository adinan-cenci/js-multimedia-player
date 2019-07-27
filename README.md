This package describes an API for multimedia players, a base in common so different vendors may be more easily interchanged.

It also offers an a base class to help write wrappers and implement the API.

See these implementations for example:

- [A wrapper for YouTube's embbed api](https://github.com/adinan-cenci/js-youtube-wrapper)
- [A wrapper for Deezer's Javascript SDK](https://github.com/adinan-cenci/js-deezer-wrapper)
- [A wrapper for the HTML native audio and video tags](https://github.com/adinan-cenci/js-html-multimedia-wrapper)

## The Player interface

### Properties

| Property| |
| --- | --- |
| paused | @var Boolean<br />@readonly |
| playing | @var Boolean<br />@readonly |
| buffering | @var Boolean<br />@readonly |
| reproducing | Indicates whether reproduction is in progress<br />@var Boolean<br />@readonly |
| waiting | Indicates whether the player is unable to reproduce due to lack of data.<br />@var Boolean<br />@readonly |
| ended | When true it means that the media has finished playing<br />@var Boolean<br />@readonly |
| volume | Between 0 and 100<br />@var Integer<br />@readonly |
| | |
| duration | The length of the media in seconds<br />@var Double<br />@readonly |
| currentTime | The current playback time in seconds<br />@var Double<br />@readonly |
| remainingTime | The remaining playback time in seconds<br />@var Double<br />@readonly |
| | |
| formattedDuration | The length of the media formatted as an ISO 8601 string ( hh:mm:ss )<br />@var String<br />@readonly |
| formattedCurrentTime | The current playback time formatted as an ISO 8601 string ( hh:mm:ss )<br />@var String<br />@readonly |
| formattedRemainingTime | The remaining playback time formatted as an ISO 8601 string ( hh:mm:ss )<br />@var String<br />@readonly |
| | |
| currentPercentage | The completed percentage of the current playback<br />@var Double<br />@readonly |
| remainingPercentage | The remaining percentage of the current playback<br />@var Double<br />@readonly |
|  |  |
| volume | @var Integer<br />@readonly |

### Methods

|Method||
|---|---|
| contructor(settings) | The settings differ for each vendor.<br />@param Object settings |
| setData(data) | Receives an object describing the media to be played and returns a Promise to be resolved once the player is ready.<br />The object may differ for each vendor, but preferably use properties such as: "href" or "src".<br />@param Object data<br />@return Promise |
| seek(time) | Seeks the media to the new time that may be represented as:<br />- in seconds as a double<br />- an ISO 8601 formatted string ( hh:mm:ss )<br />- a numerical string suffixed with %<br />@time Number\|String time |
| play(time = null) | Begins playback of the media. If time is informed it also seeks the media to the new time. Accepts the same parameter as seek.<br />@param Number\|String |
| pause() | |
| getTime(perc) | Returns the time corresponding to perc % in seconds. <br />@param Number perc Between 0 and 100 <br />@return Double |
| getFormattedTime(perc) | Returns the time corresponding to perc % as an ISO 8601 formatted string ( hh:mm:ss ). <br />@param Number perc Between 0 and 100<br />@param String |
| getPercentage(time) | Returns the playback's percentage corresponding to time<br />@param Double\|String Seconds in the form of a double or an ISO 8601 formatted string ( hh:mm: ss) |
| | |
| setVolume(vol) | @param Number vol Between 0 and 100 |
| addEventListener(eventName, listener) | @param String eventName<br />@param function listener<br />@return Player |
| removeEventListener(eventName, listener) | @param String eventName<br />@param function listener<br />@return Player |

### Events

| Callback   |                                                              |
| ---------- | ------------------------------------------------------------ |
| play       |                                                              |
| pause      |                                                              |
| ended      |                                                              |
| timeupdate | Fired as the reproduction progresses                         |
| waiting    | Fired when when playback has stopped because of a temporary lack of data |
| playing    | Fired when the playback is ready to start after having been paused due to lack of data |
| error      | Passes an object to the listener containing two proprieties: "errorCode" and "errorMessage". |