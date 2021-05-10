



//https://stackoverflow.com/a/40666096
chrome.storage.local.get('speed', function (items) {
    setVideoSpeed(items.speed);
    chrome.storage.local.remove('speed');
});

function setVideoSpeed(speed){
    document.querySelector('video').playbackRate = speed;
}


