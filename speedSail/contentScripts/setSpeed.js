/*All code written by Ryan Helgoth, any resources used are commented.

This script executes when the user has 
selected a speed in the extentions's popup.
This script sets all the supported videos and audio tracks 
on the current tab to the speed the user has selected.
*/

main();

function main() {
    setVideoSpeed();
}

//Sets speed of all videos and audio tracks in current tab.
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
            let audioTracks = document.querySelectorAll("audio"); //Returns NodeList 
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
            for (audioTrack of audioTracks) {
                if (audioTrack !== null) {
                    audioTrack.playbackRate = selectedSpeed;
                    speedSet = true; 
                }
            }
        }
        saveCurrentSpeed(speedSet, selectedSpeed);
    });
}

//Saves the speed selected by the user in storage if it has been applied to at least one video or audio track.
function saveCurrentSpeed(speedSet, selectedSpeed) {
    if (speedSet) {
        chrome.storage.local.remove("currentSpeed"); 
        chrome.storage.local.set({
            currentSpeed: selectedSpeed
        });

        /*speedSet needs to only be set to true here because this script
        is executed once for each frame. So if the last frame that is processed
        contains no videos or audio clips, then speedSet will be set to false even if there was
        at least one video that did have it's speed set in a different frame.
        */
        //speedSet is set to false initially in popup.js when user selects a speed.
        chrome.storage.local.set({
            speedSet: speedSet
        });
    }
}


