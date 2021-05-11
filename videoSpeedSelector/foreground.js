



//https://stackoverflow.com/a/40666096
chrome.storage.local.get('speed', function (items) {
    if (typeof items.speed !== 'undefined') { // Prevents errors if slider is moved too fast which stores an undefined value
        setVideoSpeed(items.speed);
        chrome.storage.local.remove('speed'); //clear() instead?
    }
});

function setVideoSpeed(speed){
    console.log(speed);
    var video = document.querySelector('video');

    if (video !== null) {
        video.playbackRate = speed;
        chrome.storage.local.set({
            lastSpeed: speed
        });
    }
    

    
}


