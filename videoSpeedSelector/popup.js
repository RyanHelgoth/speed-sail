

var confirmButton = document.getElementById("confirmButton");

confirmButton.onclick = function(element) {
    var vidSpeed = document.getElementById("numBox").value;
    console.log(vidSpeed);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        {code: "document.querySelector('video').playbackRate =" + vidSpeed + ";" });
    });
};

/*
function setVideoSpeed(speed) {
    document.querySelector('video').playbackRate = speed;  
}
*/