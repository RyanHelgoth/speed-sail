console.log("at currentSpeed");

var currentSpeed = document.querySelector('video').playbackRate;


chrome.storage.local.set({
    lastSpeed: currentSpeed
});