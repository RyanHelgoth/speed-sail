
//main();

function main() {
    addListeners();
}

function addListeners() {
    chrome.tabs.onUpdated.addListener(setSpeed);
}

function setSpeed() {
    console.log("hey");
    chrome.storage.local.get("currentSpeed", function (items) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            /*  Link: https://stackoverflow.com/a/40666096
            Author: Makyen♦
            Date: Nov 17 '16 at 22:20
            License: SA 3.0

            I used this post to learn how to pass values to content scripts 
            from background scripts using storage.
            */
            executeSetSpeedScript(tabs); 
        });   
    });
}


function executeSetSpeedScript(tabs) {
    if (tabs[0].url.startsWith("https://") || tabs[0].url.startsWith("http://")) { 
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id, allFrames: true},
            files: ["contentScripts/setSpeed.js"]
        });
    }
}

