/**
 * BCLearningNetwork.com
 * [Game Name]   
 * @author Parsa Rajabi - ParsaRajabiPR@gmail.com
 * Date [Month/Year]
 */

//// VARIABLES ////

var mute = false;
var FPS = 20;
var STAGE_WIDTH, STAGE_HEIGHT;
var gameStarted = false;


// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

/*
 * Initialize the stage and some createJS settings
 */
function init() {
    STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
    STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

    // init state object
    stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

    setupManifest(); // preloadJS
    startPreload();

    stage.update();
}
/*
 * Main update loop.
 */


function update(event) {
    if (gameStarted) {}

    stage.update(event);
}

/*
 * Ends the game.
 */
function endGame() {
    gameStarted = false;
}



/*
 * Place graphics and add them to the stage.
 */
function initGraphics() {

    initMuteUnMuteButtons();
    initListeners();

    // start the game
    gameStarted = true;
    stage.update();
}


/*
 * Adds the mute and unmute buttons to the stage and defines listeners
 */
function initMuteUnMuteButtons() {
    var hitArea = new createjs.Shape();
    hitArea.graphics.beginFill("#000").drawRect(0, 0, muteButton.image.width, muteButton.image.height);
    muteButton.hitArea = unmuteButton.hitArea = hitArea;

    muteButton.x = unmuteButton.x = 5;
    muteButton.y = unmuteButton.y = 5;

    muteButton.cursor = "pointer";
    unmuteButton.cursor = "pointer";

    muteButton.on("click", toggleMute);
    unmuteButton.on("click", toggleMute);

    stage.addChild(unmuteButton);
}

/*
 * Add listeners to objects.
 */
function initListeners() {

}



//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
       {
            src: "images/mute.png",
            id: "mute"
    },
        {
            src: "images/unmute.png",
            id: "unmute"
    }
 	];
}


function startPreload() {
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

/*
 * Specify how to load each file.
 */
function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
    if (event.item.id == "mute") {
        muteButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "unmute") {
        unmuteButton = new createjs.Bitmap(event.result);
    } 
}

function loadError(evt) {
    console.log("Error!", evt.text);
}

// not currently used as load time is short
function handleFileProgress(event) {

}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    // ticker calls update function, set the FPS
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addEventListener("tick", update); // call update function

    stage.addChild(background);
    stage.update();
    initGraphics();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS
