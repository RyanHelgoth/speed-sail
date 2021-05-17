/*All code by Ryan Helgoth unless cited otherwise.

This script executes when the extention's popup is opened,
it handles user input and setting some ui elements.
*/

main();

function main() {
    const [speedSlider, sliderNum, applyButton] = getUiElements();
    addListeners(); 
    getCurrentSpeed();
    //When the popup opens, sets slider position if speed was not changed since last time popup was open.
    initializeSlider()
}

//Gets ui elements of popup.
function getUiElements() {
    const speedSlider = document.getElementById("speedSlider"); 
    const sliderNum = document.getElementById("sliderNum");
    const applyButton = document.getElementById("applyButton");
    return [speedSlider, sliderNum, applyButton];
}

//Finds video speed on current tabg and saves it to storage.
function getCurrentSpeed() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.startsWith("https://") || tabs[0].url.startsWith("http://")) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id, allFrames: true},
                files: ["contentScripts/getCurrentSpeed.js"]
            });
        }
    });
    
}

//Sets position of speed slider and text when popup is opened.
function initializeSlider() {
    chrome.storage.local.get("currentSpeed", function (items) {
        if (typeof items.currentSpeed !== "undefined") { 
            speedSlider.value = items.currentSpeed;
            sliderNum.innerText = items.currentSpeed;
        }
    });
}

//Sets text of speed slider.
function setSliderText() {
    let selectedSpeed = speedSlider.valueAsNumber;
    sliderNum.innerText = selectedSpeed;
}

//Adds listeners.
function addListeners() {
    //Doesn't work twice in a row because data stays the same (doesnt look for writes, only data change).
    //Listens for change in speed that occured while the popup was closed.
    chrome.storage.onChanged.addListener(handleSpeedChange); 
    
    //
    applyButton.addEventListener("click", setSpeed, false); 

    //
    speedSlider.addEventListener("input", setSliderText, false);
}

//Set speed of videos in current tab to the speed the user has selected.
function setSpeed() {
    let selectedSpeed = speedSlider.valueAsNumber;
    //TODO find cleaner solution to line below
    chrome.storage.onChanged.removeListener(handleSpeedChange); //Prevents slider from being set if no speed changes occured.

    chrome.storage.local.get("currentSpeed", function (items) {
        if (selectedSpeed !== items.currentSpeed) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                /*  Link: https://stackoverflow.com/a/40666096
                Author: Makyen♦
                Date: Nov 17 '16 at 22:20
                License: SA 3.0

                I used this post to learn how to pass values to content scripts 
                from background scripts using storage.
                */
                chrome.storage.local.set({
                    selectedSpeed: selectedSpeed
                }, executeSetSpeedScript(tabs)); 
            });

        }
    });
}

//When the popup opens, sets slider position if speed has changed since last time popup was opened.
function handleSpeedChange(changes, namespace) {
    initializeSlider();
    chrome.storage.onChanged.removeListener(handleSpeedChange);
}

//Executes script responsible for setting video speed in the current tab.
function executeSetSpeedScript(tabs) {
    if (tabs[0].url.startsWith("https://") || tabs[0].url.startsWith("http://")) { 
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id, allFrames: true},
            files: ["contentScripts/setSpeed.js"]
        });
    }
}


