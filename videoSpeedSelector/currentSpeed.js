

var video = document.querySelector('video');

if (video !== null) {
    var currentSpeed = video.playbackRate;
    console.log(currentSpeed);
    
    chrome.storage.local.set({
        currentSpeed: currentSpeed
    });
}




