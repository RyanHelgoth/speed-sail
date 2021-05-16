/*All code by Ryan Helgoth unless cited otherwise.

This script executes when the extention's popup is
opened. This script saves the speed of the first video
in the current tab to storage.
*/

main();

function main() {
    saveCurrentSpeed();
}

//Gets the speed of first video in current tab and saves it in storage.
function saveCurrentSpeed() {
    //Only checks speed of first video in current tab.
    let video = document.querySelector("video"); 

    if (video !== null) {
        let currentSpeed = video.playbackRate;
        
        chrome.storage.local.set({
            currentSpeed: currentSpeed
        });
    }
}




