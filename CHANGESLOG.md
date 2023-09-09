# Changelog

All notable changes to this project will be documented in this file.

### 3.1.0 - 2023-09-09
## Fixed
- Missing code in the `index.js` file.

## Added
- `Foundation.appendTo()`

--

## 3.0.0 - 2023-09-09
### Changed
- Rewrote the api almost entirely.
- Removed the Observer design patterns, opting instead for a custom elements approach.

--

## 2.0.0 - 2019-07-27
### Changed
- Callbacks replaced with events.

### Added
- The interface now features "addEventListener" and "removeEventListener" methods.
- Added the events: "play", "pause", "ended", "timeupdate", "waiting", "playing" and "error".

### Removed
- Removed callbacks: "onPlay", "onPause", "onEnded", "onTimeupdate", "onWaiting", "onPlaying" and "onError".