/*All code by Ryan Helgoth unless cited otherwise.

This script executes when the user has moved the 
speed selection slider in the extentions's popup.
This script sets all the video's on the current
tab to the speed the user has selected with 
the slider.
*/

main();

function main() {
    setVideoSpeed();
}

//Sets speed of all videos in current tab.
//NOTE: current does not set speed of videos in iframes.
function setVideoSpeed() {
    /*  Link: https://stackoverflow.com/a/40666096
        Author: Makyen♦
        Date: Nov 17 '16 at 22:20
        License: SA 3.0

        I used this post to learn how to recieve values
        in content scripts from background scripts.
    */
    chrome.storage.local.get("selectedSpeed", function (items) {
        let selectedSpeed = items.selectedSpeed;
        let speedSet = false;
        
        //Prevents errors if slider is moved too fast which can leave speed undefined.
        if (typeof selectedSpeed !== "undefined") { 
            let videos = document.querySelectorAll("video"); //Returns NodeList 
            
            /*  Link: https://developer.mozilla.org/en-US/docs/Web/API/NodeList#example
                Author: Various MDN contributers, 
                    full list: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/contributors.txt
                Date: Feb 19, 2021
                License: SA 2.5

                I used this documentation to learn why for...in loops do not
                work well with NodeLists and how to fix it (use for...of loop).
            */
            for (video of videos) { 
                if (video !== null) {
                    video.playbackRate = selectedSpeed;
                    speedSet = true; 
                }
            }
        }
        chrome.storage.local.remove("selectedSpeed"); 
        saveCurrentSpeed(speedSet, selectedSpeed);
    });
}

//Saves the speed selected by the user in storage if it has been applied to at least one video.
function saveCurrentSpeed(speedSet, selectedSpeed) {
    if (speedSet) {
        chrome.storage.local.set({
            currentSpeed: selectedSpeed
        });
    }
}


