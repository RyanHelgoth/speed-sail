/*All code written by Ryan Helgoth, any resources used are commented.

This script executes when the extention's popup is opened,
it handles user input and setting some ui elements.
*/

main();

function main() {
    const [speedSlider, sliderNum, appliedSpeed, 
        applyButton, defaultButton, messgae] = getUiElements();
    initializeUi();
    addListeners(); 
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

//Sets ui elements when popup is opened.
function initializeUi() {
    message.innerText = "";
    chrome.storage.local.get("currentSpeed", function (items) {
        if (typeof items.currentSpeed !== "undefined") { 
            speedSlider.value = items.currentSpeed;
            appliedSpeed.innerText = items.currentSpeed;
            updateUi();
        }
        else {
            appliedSpeed.innerText = "1";
            speedSlider.value = "1";
            sliderNum.innerText = "1";
        }
    });
}

//Updates ui elements that should change after slider is moved.
function updateUi() {
    let selectedSpeed = speedSlider.value;
    let leftColor = "rgba(200, 200, 200, 0.50)";
    let rightColor = "rgba(200, 200, 200, 0.25)";
    let percentFilled = (selectedSpeed/16)*100;

    sliderNum.innerText = selectedSpeed;
    
    /*  Link: https://stackoverflow.com/a/57153340
        Author: dargue3
        Date: Jul 22 '19 at 20:32
        License: SA 4.0

        I used this post to learn how to fill the left 
        of a range slider with color in chrome.
    */
    speedSlider.style.background = "linear-gradient(to right," + leftColor+" 0%," + leftColor 
    + percentFilled + "%," + rightColor + percentFilled + "%," + rightColor + "100%)";
}

//Adds listeners.
function addListeners() {
    
    //Catches change in speedSet boolean that tracks if applying the speed selection was sucessful or not.
    chrome.storage.onChanged.addListener(displayResults); 
    
    //Catches clicks on apply speed selection button
    applyButton.addEventListener("click", setSpeed, false); 

    //Catches clicks on default speed button
    defaultButton.addEventListener("click", setDefaultSpeed, false); 

    //Catches changes in speed slider position
    speedSlider.addEventListener("input", updateUi, false);
}

//Set speed of videos in current tab to the speed the user has selected.
function setSpeed() {
    let selectedSpeed = speedSlider.value;
    
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

//Sets slider to speed of 1 and then attempts to apply it to the current tab.
function setDefaultSpeed() {
    let leftColor = "rgba(200, 200, 200, 0.50)";
    let rightColor = "rgba(200, 200, 200, 0.25)";
    
    speedSlider.value = "1";
    sliderNum.innerText = "1";
    speedSlider.style.background = "linear-gradient(to right, " + leftColor + " 0%," 
    + leftColor + "6.25%," + rightColor + " 6.25%," + rightColor + " 100%)";
    setSpeed();
}

//Displays results after an attempt has been made to apply the user's selected speed to the current tab.
function displayResults() {

    //Time out prevents brief display of error message as speedSet is initially set to false.
    setTimeout(function() {
        chrome.storage.local.get("speedSet", function(items) {
            let choice = speedSlider.value;
            let times = "\u00D7";
        
            if (items.speedSet) {
                appliedSpeed.innerText = choice;
                message.innerText = "Your speed selection of " + choice + times + " has been successfully applied.";  
            }
            else if (!items.speedSet && typeof items.speedSet !== "undefined") {
                /*undefined evaluates to false, but when speedSet is undefined it means user has not 
                tried to apply a speed and the error message below shouldn't be displayed.*/
                message.innerText = "ERROR: Your speed selection of " + choice + times 
                + " has not been applied, as no supported videos or audio clips were found on this page.";     
            }
        });
        chrome.storage.local.remove("speedSet"); //Prevents wrong message being shown on tab switch.
    }, 50);
}

//Executes script responsible for setting speed in the current tab.
function executeSetSpeedScript(tabs) {
    if (tabs[0].url.startsWith("https://") || tabs[0].url.startsWith("http://") || tabs[0].url.startsWith("file://")) { 
        
        //speedSet is saved as true if speed is applied to at least one video or audio clip in the current tab (in setSpeed.js)
        chrome.storage.local.set({
            speedSet: false
        });
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id, allFrames: true},
            files: ["contentScripts/setSpeed.js"]
        });
    }
    else {
        message.innerText = "ERROR: Can't set speed, as the URL must start with http://, https://, or file://";
    }
}

