//create a new instance of shake.js.
var myShakeEvent = new Shake({
    threshold: 15
});

// start listening to device motion
myShakeEvent.start();

var audioEnabled = true;
var shakeEnabled = false;
var onlineMode = true;
var cookingTime = 30;

// register a shake event
window.addEventListener('shake', shakeEventDidOccur, false);

//shake event callback
function shakeEventDidOccur() {
    //put your own code here etc.
    console.log("Shake event!");
    
    if (shakeEnabled) {
        var fullPath = getPhoneGapPath() + 'shaker.mp3';

        if (device.platform == 'Android') {
            fullPath = '/android_asset/www/' + 'shaker.mp3';
        }

        console.log('Full path to audio: '+fullPath);

        var myMedia = new Media(fullPath,
            // success callback
            function () {
                console.log("playAudio():Audio Success");
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: " + err);
            }
        );
        myMedia.setVolume('1.0');
        if (audioEnabled) 
        {
            console.log("Audio enabled, playing...");
            myMedia.play();
        }
        else
        {
            console.log("Shake audio disabled in Settings!");
        }

        modal.show();
        setTimeout('modal.hide()', 4000);   
    } else {
        console.log('...but on a Tab where it is disabled!');
    }
}
function mediaError(e) {
    alert(JSON.stringify(e));
}

function getPhoneGapPath() {
    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    //return 'cdvfile://' + path;
    return path;
};

function toggleAudio() {
    if (audioSwitch.isChecked()) {
        console.log('Enabling audio...');
        audioEnabled = true;
    } else { audioEnabled = false; console.log('Disabling audio...');}
}