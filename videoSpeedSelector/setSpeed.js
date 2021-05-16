
//https://stackoverflow.com/a/40666096
chrome.storage.local.get('selectedSpeed', function (items) {
    if (typeof items.selectedSpeed !== 'undefined') { // Prevents errors if slider is moved too fast which stores an undefined value
        setVideoSpeed(items.selectedSpeed);
        chrome.storage.local.remove('selectedSpeed'); //clear() instead?
    }
});

function setVideoSpeed(speed){
    console.log(speed);
    var videos = document.querySelectorAll('video');
    console.log(videos);


    videos.forEach(function(video) {
        if (video !== null) {
            video.playbackRate = speed;
            chrome.storage.local.set({
                currentSpeed: speed
            });
            
        }
    });

    
    

    
}


