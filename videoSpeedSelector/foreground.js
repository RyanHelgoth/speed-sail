var vidSpeed = 1.0;
var confirmButton = document.getElementById("confirmButton");


if (confirmButton !== null) {
    confirmButton.addEventListener("click", function() {
        vidSpeed = document.getElementById("numBox").value;
        document.querySelector('video').playbackRate = vidSpeed;
    });
}


//document.querySelector('video').playbackRate = 2.0