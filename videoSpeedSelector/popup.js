

var confirmButton = document.getElementById("confirmButton");





confirmButton.addEventListener("click", function() {
    var vidSpeed = document.getElementById("numBox").value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {


        //https://stackoverflow.com/a/40666096
        chrome.storage.local.set({
            speed: vidSpeed
        }, executeForegroundScript(tabs)); // Callback invoked after storing is complete.
        
    });

});


function executeForegroundScript(tabs) {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["foreground.js"]
    });
}