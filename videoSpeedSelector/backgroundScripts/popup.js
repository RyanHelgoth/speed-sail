/*All code by Ryan Helgoth unless cited otherwise.

This script executes when the extention's popup is opened,
it handles user input and setting some ui elements.
*/

main();

function main() {
    const [speedSlider, sliderNum, appliedSpeed, 
        applyButton, defaultButton, messgae] = getUiElements();
    addListeners(); 
    getCurrentSpeed();
    //When the popup opens, sets slider position if speed was not changed since last time popup was open.
    initializeUi();
}

//Gets ui elements of popup.
function getUiElements() {
    const speedSlider = document.getElementById("speedSlider"); 
    const sliderNum = document.getElementById("sliderNum");
    const appliedSpeed = document.getElementById("appliedSpeed");
    const applyButton = document.getElementById("applyButton");
    const defaultButton = document.getElementById("defaultButton");
    const message = document.getElementById("message");
    return [speedSlider, sliderNum, appliedSpeed, applyButton, defaultButton, message];
}

//Finds video speed on current tabg and saves it to storage.
function getCurrentSpeed() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.startsWith("https://") || tabs[0].url.startsWith("http://") || tabs[0].url.startsWith("file://")) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id, allFrames: true},
                files: ["contentScripts/getCurrentSpeed.js"]
            });
        }
    });
}

//Sets ui elements when popup is opened.
function initializeUi() {
    chrome.storage.local.get("currentSpeed", function (items) {
        if (typeof items.currentSpeed !== "undefined") { 
            speedSlider.value = items.currentSpeed;
            sliderNum.innerText = items.currentSpeed;
            appliedSpeed.innerText = items.currentSpeed;
        }
    });
}

//Sets selected speed text.
function setSelectedSpeedText() {
    let selectedSpeed = speedSlider.value;
    sliderNum.innerText = selectedSpeed;
}

//Adds listeners.
function addListeners() {
    //Doesn't work twice in a row because data stays the same (doesnt look for writes, only data change).
    //Catches change in speed that occured while the popup was closed.
    chrome.storage.onChanged.addListener(initUiAfterSpeedChange); 

    //Catches change in speedSet boolean that tracks if applying speed selection was sucessful or not.
    chrome.storage.onChanged.addListener(displayResults); 
    
    //Catches clicks on apply speed selection button
    applyButton.addEventListener("click", setSpeed, false); 

    //Catches clicks on default speed button
    defaultButton.addEventListener("click", setDefaultSpeed, false); 

    //Catches changes in speed slider position
    speedSlider.addEventListener("input", setSelectedSpeedText, false);
}

//Set speed of videos in current tab to the speed the user has selected.
function setSpeed() {
    let selectedSpeed = speedSlider.valueAsNumber;
    //TODO find cleaner solution to line below
    chrome.storage.onChanged.removeListener(initUiAfterSpeedChange); //Prevents slider from being set if no speed changes occured.

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
        else {
            let times = "\u00D7";
            message.innerText = "ERROR: Your speed selection of " + selectedSpeed + times + " was not applied, as it is already the current speed.";
        }
    });
}

//When the popup opens, sets slider position if speed has changed since last time popup was opened.
function initUiAfterSpeedChange() {
    initializeUi();
    chrome.storage.onChanged.removeListener(initUiAfterSpeedChange);
}

//Sets slider to speed of 1 and then attempts to apply it to the current tab.
function setDefaultSpeed() {
    speedSlider.value = "1";
    sliderNum.innerText = "1";
    setSpeed();
}

//Displays results after an attempt has been made to apply the user's selected speed to videos in the current tab.
function displayResults() {
    chrome.storage.local.get("speedSet", function(items) {
        let choice = speedSlider.value;
        let times = "\u00D7";
        
        if (items.speedSet) {
            appliedSpeed.innerText = choice;
            message.innerText = "Your speed selection of " + choice + times + " has been applied.";
        }
        else if (!items.speedSet && typeof items.speedSet !== "undefined") {
            /*undefined evaluates to false, but when speedSet is undefined it means user has not 
            tried to apply a speed and the error message below shouldn't be displayed.*/
            message.innerText = "ERROR: Your speed selection of " + choice + times + " has not been applied as no valid videos were found on this page.";
        }
    });
    chrome.storage.local.remove("speedSet"); //Prevents wrong message being shown on tab switch.
}

//Executes script responsible for setting video speed in the current tab.
function executeSetSpeedScript(tabs) {
    if (tabs[0].url.startsWith("https://") || tabs[0].url.startsWith("http://") || tabs[0].url.startsWith("file://")) { 
        
        //speedSet is saved as true if speed is applied to at least one video in the current tab (in setSpeed.js)
        chrome.storage.local.set({
            speedSet: false
        });
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id, allFrames: true},
            files: ["contentScripts/setSpeed.js"]
        });
    }
    else {
        message.innerText = "ERROR: Can't set speed, url must start with http://, https://, or file://";
    }
}

/*TODO:
-Get speed not reliable on sites with multiple videos like reddit
-Set speed in tabs with no videos or bad url to 1.
-Uninstall extension and see if current speed causes bugs (when it is undefined)
-Remove old code and add comments
-Find alternate solution to removing listener in setSpeed()


*/
