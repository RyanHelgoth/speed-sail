



main();




function main() {
    //Add to function?
    const speedSlider = document.getElementById("speedSlider"); 
    const sliderNum = document.getElementById("sliderNum");

    addListeners(); 
    getCurrentSpeed();
    setSlider();
    
}


function getCurrentSpeed() {
    //Finds current video speed and saves it to storage
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.startsWith("https://")) {//Maybe check http too?
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["currentSpeed.js"]
            });
        }
    });
}

function setSlider() {
    //When popup opens, sets slider if speed was not changed.
    chrome.storage.local.get("lastSpeed", function (items) {
        if (typeof items.lastSpeed !== 'undefined') { 
            console.log("setting ui");
            speedSlider.value = items.lastSpeed;
            sliderNum.innerText = items.lastSpeed;
        }
    });

    

}

function addListeners() {
    //Doesn't work twice in a row because data stays the same (doesnt look for write, only data change)
    //When popup opens, sets slider if speed has changed.
    chrome.storage.onChanged.addListener(handleSpeedChange);
    
    //https://www.impressivewebs.com/onchange-vs-oninput-for-range-sliders/
    speedSlider.addEventListener('input', setSpeed, false);

}


function setSpeed() {
    var vidSpeed = speedSlider.value;

    sliderNum.innerText = vidSpeed;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {


        //https://stackoverflow.com/a/40666096
        chrome.storage.local.set({
            speed: vidSpeed
        }, executeForegroundScript(tabs)); // Callback invoked after storing is complete.
    });

}


//Handles change in speed after reopening the popup
function handleSpeedChange(changes, namespace) {
    chrome.storage.local.get("lastSpeed", function (items) {
        if (typeof items.lastSpeed !== 'undefined') { 
            console.log("setting ui");
            speedSlider.value = items.lastSpeed;
            sliderNum.innerText = items.lastSpeed;
        }
    });
    chrome.storage.onChanged.removeListener(handleSpeedChange);
}


function executeForegroundScript(tabs) {//Rename function
    if (tabs[0].url.startsWith("https://")) { //Maybe check http too?

    
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["foreground.js"]//Rename file
        });
    }
}


