

var confirmButton = document.getElementById("confirmButton");
var speedSlider = document.getElementById("speedSlider");
var sliderNum = document.getElementById("sliderNum");

//Finds current video speed
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0].url.startsWith("https://")) {//Maybe check http too?
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["currentSpeed.js"]
        });
    }
});


chrome.storage.onChanged.addListener(test);

function test(changes, namespace) {
    chrome.storage.local.get("lastSpeed", function (items) {
        if (typeof items.lastSpeed !== 'undefined') { 
            speedSlider.value = items.lastSpeed;
            sliderNum.innerText = items.lastSpeed;
        }
    });
    chrome.storage.onChanged.removeListener(test);
}



// Speed stays if page is refreshed, should probably use a foreground script to find speed.
chrome.storage.local.get("lastSpeed", function (items) {
    if (typeof items.lastSpeed !== 'undefined') { 
      
        speedSlider.value = items.lastSpeed;
        sliderNum.innerText = items.lastSpeed;
    }
});




//https://www.impressivewebs.com/onchange-vs-oninput-for-range-sliders/
speedSlider.addEventListener('input', function () { //See if i can change to an on release listener
    var vidSpeed = speedSlider.value;
    
    sliderNum.innerText = vidSpeed;
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {


        //https://stackoverflow.com/a/40666096
        chrome.storage.local.set({
            speed: vidSpeed
        }, executeForegroundScript(tabs)); // Callback invoked after storing is complete.
        
    });
  }, false);




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
    if (tabs[0].url.startsWith("https://")) { //Maybe check http too?

    
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["foreground.js"]
        });
    }
}