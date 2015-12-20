//create a new instance of shake.js.
var myShakeEvent = new Shake({
    threshold: 15
});

// start listening to device motion
myShakeEvent.start();

// initial setting for Shake Sound
var audioEnabled = true;
// initial setting for Shake Prompt
var shakeEnabled = true;
// initial cooking time displayed in Settings
var cookingTime = 30;
// URL of the website that hosts the SQL<->JSON service
var inventoryURL = "http://pingvinfeszek.hu/cs50.php";
// variable that holds the contents of the local JSON Database
var localData;
// path to the local JSON Database
var localLocation;
// path to the local Recipe Database
var recipeLocation;
// name of the local JSON Database
var localDataName = "localData.json";
// name of the local Recipe Database
var recipeDataName = "recipe.json";
// array of checked Fridge items
var checkedIds;
// dirty fix in order to prevent loss of checked items
var fridgeOpened = false;
// what we have in the fridge right now
var inTheFridge = [];
// what we can make as of now
var availableDishes = [];

// register a shake event
window.addEventListener('shake', shakeEventDidOccur, false);

//shake event callback
function shakeEventDidOccur() {
    //put your own code here etc.
    console.log("Shake event!");
    
    if (shakeEnabled) {
        modal.hide();
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
        doTheRecipe();
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

function doTheRecipe() {
    console.log('Loading recipe...');
    console.log('Fridge: ' + window.inTheFridge);
    var output = $('#suggestion');
    var recipePath = getPhoneGapPath() + window.recipeDataName;
    var suggestion = [];
    availableDishes = [];
    console.log(recipePath);
    jQuery.getJSON(recipePath, function(data) {
        
        console.log(data);
        
        for (var i = 0; i < data.length; i++)
        {
            var canBeMade = true;
            console.log('Analyzing: ' + data[i]['name']);
            
            for (var k = 0; k < data[i]['items'].length; k++)
            {
                if ($.inArray(data[i]['items'][k], window.inTheFridge) == -1) {
                    canBeMade = false;
                    console.log("Missing item!");
                }  
            }

            if (canBeMade) {
                availableDishes.push(data[i]['name']);
                console.log('Can be made: ' + data[i]['name']);
            }
        }
        
        
        console.log('Finished evaluating!');
        console.log(window.availableDishes);
        suggestion = window.availableDishes[Math.floor(Math.random()*window.availableDishes.length)];
        console.log(suggestion);
        output.text(suggestion);
        
        /*$.each(data, function(j,stuff){
            var items = stuff.name + '<br/>' + stuff.info + '<br/>';
            output.append(items);
        });*/

    });
    

}