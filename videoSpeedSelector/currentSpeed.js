console.log("at currentSpeed");

var video = document.querySelector('video');

if (video !== null) {
    var currentSpeed = video.playbackRate;
    chrome.storage.local.set({
        lastSpeed: currentSpeed
    });
}




