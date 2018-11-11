/**
 * BCLearningNetwork.com
 * Asteroid Interceptor
 * @author Parsa Rajabi - ParsaRajabiPR@gmail.com
 * October 2018
 */

//// VARIABLES ////

var mute = false;
var FPS = 20;
var STAGE_WIDTH, STAGE_HEIGHT;
var gameStarted = false;
var angleSlider;
var angleText;
var angle = 0;
var container;
var inputBox;
var inputBoxHTML;
var shotsFired = false;
var oldX, oldY;
var newX, newY;
var speed = 2;
var levelText;


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
    if (gameStarted) {

//        //new text(text, font, color)
//        stage.removeChild(angleText);
//        angleText = new createjs.Text(angle, "23px Lato", "#ffffff");
//        angleText.x = 403;
//        angleText.y = 542;
//        stage.addChild(angleText);
        
        container.rotation = -angle;
        rocket.rotation = -angle;
        updateSelectPositions();
        
        if (shotsFired){
            const deltaX = Math.cos(convertToRad(angle)) * speed;
            const deltaY = Math.sin(convertToRad(angle)) * speed;
            rocket.x += deltaX;
            rocket.y -= deltaY;
            
            if (rocket.x >= 765)
                rocket.visible = false;
            else if (rocket.y <= 0)
                rocket.visible = false;
            
//            rocket.x += 1;
//            rocket.y -= 1;
//            console.log(angle);
            console.log("rocket.x : " + rocket.x);
            console.log("rocket.y : " + rocket.y);
    
        }
    }

    stage.update(event);
}

function convertToRad(degAngle){
    return (degAngle * (Math.PI/180));
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

    stage.addChild(background);

    container = new createjs.Container();
    container.x = 410;
    container.y = 473;

    container.addChild(whiteArrow);
//    container.addChild(rocket);
    stage.addChild(container);

    container.regX = -3;
    container.regY = 7;
    
    angleBase.x = 15;
    angleBase.y = 30;
    stage.addChild(angleBase);
    
    
    
    rocket.x = 412;
    rocket.y = 475;
    
    rocket.regX = -10;
    rocket.regY = 20;
    stage.addChild(rocket);

    
    
//    SLIDER STUFF 
    
//    // angle slider
//    // new Slider(min, max, width, height)
//    angleSlider = new Slider(0, 180, 450, 30).set({
//        x: 180,
//        y: 450,
//        value: 0 //default value
//    });
//
//
//    angleSlider.on("change", handleAngleSliderChange, this); // assign event handler to the slider (What function to call)
//    stage.addChild(angleSlider);


    //positioning of the fire button
    fireButton.x = fireButtonPressed.x = 250;
    fireButton.y = fireButtonPressed.y = 500;
    stage.addChild(fireButton);

    //positioning of the fire button
    resetButton.x = resetButtonPressed.x = 425;
    resetButton.y = resetButtonPressed.y = 500;
    stage.addChild(resetButton);

    //textInput
    inputBoxHTML = document.createElement('input');
    inputBoxHTML.type = "text";
    inputBoxHTML.placeholder = " # ";
    inputBoxHTML.placeholder.color = "white";
    inputBoxHTML.id = "inputBox";
    inputBoxHTML.class = "overlayed";
    //positioning
    inputBoxHTML.style.position = "absolute";
    inputBoxHTML.style.top = 0;
    inputBoxHTML.style.left = 0;
    //width and height
    inputBoxHTML.style.width = "35px";
    inputBoxHTML.style.height = "35px";
    //text background colour
    inputBoxHTML.style.background = "transparent";
    //font style
    inputBoxHTML.style.fontSize = "20px";
    inputBoxHTML.style.color = "white";
    inputBoxHTML.maxLength = "3";

    inputBoxHTML.onkeyup = updateAngle;
    
    document.body.appendChild(inputBoxHTML);
    inputBox = new createjs.DOMElement(inputBoxHTML);
    stage.addChild(inputBox);
    //    inputBox.visible = true;
//    inputBox.htmlElement.style.border = "2px solid red";
    inputBox.htmlElement.style.border = "none";

    
    
//    var UserInput = new TextInput();
//      UserInput.y = UserInput.x = 400;
//      UserInput.placeHolder = "Input Field";
//      stage.addChild(UserInput);
//      // Updates the text field to the new internal data (ie. placeholder)
//      textField.update();

    initMuteUnMuteButtons();
    initListeners();

    // start the game
    gameStarted = true;
    stage.update();
}

//validates the user input to ensure the angle is between 0 and 180. If so there angle is set the user input
function updateAngle(){
    var checkAngle = inputBoxHTML.value;
if (checkAngle >= 0 && checkAngle <= 180)
    angle = inputBoxHTML.value;
else if (checkAngle > 180)
    angle = 180;
else if (checkAngle < 0)
    angle = 0;
else 
    console.log("Need a valid angle (between 0 and 180)");
}
function updateSelectPositions() {
    let selectY = 538; // Need to check this in firefox
    if (isChrome) {
        selectY = 538;
    }
    inputBox.x = gameCanvas.getBoundingClientRect().left + 120;
    inputBox.y = gameCanvas.getBoundingClientRect().top + selectY
}
//function handleAngleSliderChange(evt) {
//    //angle = Math.floor(evt.target.value); //assigns the value of slider change to the variable
//    angle = Math.round(evt.target.value);
//    angleText.text = inputBox.value;
//    //    container.scaleX = container.scaleY  = angle / 8.5 * 1.1;
//
//    //    console.log("angle is " + angle);
//}

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

    fireButton.on("mouseover", function () {
        stage.addChild(fireButtonPressed);
        stage.removeChild(fireButton);
        playSound("click");
    });
    fireButtonPressed.on("mouseout", function () {
        stage.addChild(fireButton);
        stage.removeChild(fireButtonPressed);
    });
    //once pressed, the fire function will be called 
    fireButtonPressed.on("click", fire);


    resetButton.on("mouseover", function () {
        stage.addChild(resetButtonPressed);
        stage.removeChild(resetButton);
        playSound("click");

        resetButtonPressed.on("mouseout", function () {
            stage.addChild(resetButton);
            stage.removeChild(resetButtonPressed);
        });
        //once pressed, the fire function will be called 
        resetButtonPressed.on("click", reset);

    });
}

function fire() {
    console.log("fire was tapped");
    shotsFired = true;
    
    
}

function reset() {
    console.log("reset was tapped");
}



//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var background;
var whiteArrow;
var base;
var fireButton, fireButtonPressed;
var resetButton, resetButtonPressed;
var rocket;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
        {
            src: "images/mute.png",
            id: "mute"
    },{
            src: "images/unmute.png",
            id: "unmute"
    },{
            src: "images/background.png",
            id: "background"
    }, {
            src: "images/whiteArrow.png",
            id: "whiteArrow"
    }, {
            src: "images/base.png",
            id: "angleBase"
    }, {
            src: "images/fireButton.png",
            id: "fireButton"
    }, {
            src: "images/fireButtonPressed.png",
            id: "fireButtonPressed"
    }, {
            src: "images/resetButton.png",
            id: "resetButton"
    }, {
            src: "images/resetButtonPressed.png",
            id: "resetButtonPressed"
    }, {
            src: "images/iRocket.png",
            id: "rocket"
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
    } else if (event.item.id == "background") {
        background = new createjs.Bitmap(event.result);
    } else if (event.item.id == "whiteArrow") {
        whiteArrow = new createjs.Bitmap(event.result);
    } else if (event.item.id == "angleBase") {
        angleBase = new createjs.Bitmap(event.result);
    } else if (event.item.id == "fireButton") {
        fireButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "fireButtonPressed") {
        fireButtonPressed = new createjs.Bitmap(event.result);
    } else if (event.item.id == "resetButton") {
        resetButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "resetButtonPressed") {
        resetButtonPressed = new createjs.Bitmap(event.result);
    } else if (event.item.id == "rocket") {
        rocket = new createjs.Bitmap(event.result);
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

    stage.update();
    initGraphics();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS
