/**
 * BCLearningNetwork.com
 * Asteroid Interceptor
 * @author Parsa Rajabi - ParsaRajabiPR@gmail.com
 * October 2018
 */
    // TODO: DONE 1) Make the asteroid move towards the base
    // TODO: 2) Make it so the angle can not be changed after the rocket has been launched
    // TODO: DONE 3) Create the explosion after the rocket hits the asteroid - use the same one from Colin's game
    // TODO: 4) Finish the miss/hit screens (photoshop)
    // TODO: 5) implement the level feature: as the level increases, the speed of asteriod++
    // TODO: 6) Make the angle bonus thing - it needs to be a pop up after the user has entered an angle and is ready to launch
//// VARIABLES ////

var mute = false;
var FPS = 20;
var STAGE_WIDTH, STAGE_HEIGHT;
var gameStarted = false;
var angleSlider;
var scoreText;
var angle = 0;
var container;
var inputBox;
var inputBoxHTML;
var shotsFired = false;
var rocketSpeed = 10;
var levelText;
var level = 1;
var asteroidPosition = -70;
var asteroidSpeed = 1.5;
var score = 0;
var tween;

let angleBetweenAsteroidAndBase;
var asteroidContainer;
var asteroidX;
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
var myTween;
var explosionAnimation;

var sucess = false;
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
        // if there is a collision = check = true
        // else if there is not a collision, check = false
        // intersection is null if no collision, otherwise a {x,y,width,height}-Object is returned
        try {
            if (shotsFired) {
                // var checkCollision = ndgmr.checkPixelCollision(rocket, asteroid, 1);
                // if (checkCollision) {

                //if there is a collision...
                    if(ndgmr.checkPixelCollision(rocket, asteroid, 1)){
                    shotsFired = false;
                    // explode asteroid
                    explosionAnimation.x = asteroid.x;
                    explosionAnimation.y = asteroid.y;
                    explosionAnimation.scaleX = explosionAnimation.scaleY = 1.4; // adjust as needed to hide asteroid.
                    stage.addChild(explosionAnimation);
                    explosionAnimation.gotoAndPlay("explode");
                    createjs.Tween.removeTweens(asteroid);
                    stage.removeChild(asteroid);
                    resetRocketPosition();
                    score++;
                    sucess = true;
                    playSound("explosionSound");

                        // asteroid.visible = false;
                    setTimeout(function(){
                        stage.addChild(hit);
                        nextLevel();
                    }, 1100);

                    console.log("there was an explosion!");
                    // newGame();
                    // resetRocketPosition();
                    // toggleTween(tween);
                    // resetAsteriod();
                    // resetAsteroidPosition();
                }
                //there was no collision
                else{
                    // resetAsteroidPosition();
                    // level++;
                }
            }
        }catch (e) {
            console.log("error is: "+ e);

        }


        // console.log("ASS X" ,asteroid.x);
        // console.log("ROCKET X ", rocket.x);
        // console.log("ASS Y" ,asteroid.y);
        // console.log("ROCKET Y" , rocket.y);

        //new text(text, font, color)
        stage.removeChild(scoreText);
        scoreText = new createjs.Text(score, "23px Lato", "#ffffff");
        scoreText.x = 639;
        scoreText.y = 545;
        stage.addChild(scoreText);

        //Level lable
        //new text(text, font, color)
        stage.removeChild(levelText);
        levelText = new createjs.Text(level, "25px Big John", "white");
        levelText.x = 167 - levelText.getMeasuredWidth();
        levelText.y = 80;
        stage.addChild(levelText);

        container.rotation = -angle;
        rocket.rotation = -angle;

        updateSelectPositions();

        if (shotsFired) {
            const deltaX = Math.cos(convertToRad(angle)) * rocketSpeed;
            const deltaY = Math.sin(convertToRad(angle)) * rocketSpeed;
            rocket.x += deltaX;
            rocket.y -= deltaY;

            //if the rocket goes out of bounds to the left or right of screen
            //reset it's position to origin at base - ready to be shot again
            if (rocket.x >= 765 || rocket.x <= 0) {
                missed();
                console.log("rocket left through x ");
                // level++;
                // rocket.visible = false;
                // resetAsteroidPosition();

                //if the rocket goes out of bounds upwards
            } else if (rocket.y <= 0) {
                // rocket.visible = false;
                missed();
                console.log("rocket left through y ");
                // level++;
                // resetAsteroidPosition();
            }
        }

    }//ends the game

    stage.update(event);
}


function convertToRad(degAngle) {
    return (degAngle * (Math.PI / 180));
}

/*
 * Ends the game.
 */
function endGame() {
    gameStarted = false;
}

//sets the position of rocket to origin and sets shorts fired to false - ready to be launched again
function resetRocketPosition() {
    rocket.x = 412;
    rocket.y = 475;
    shotsFired = false;
    rocket.visible = false;
}

function resetAsteroidPosition() {
    // toggleTween(tween);
    asteroid.visible = true;
    // asteroid.x = 250;
    // asteroid.x = getRandomNumber(500);
    // asteroid.y = -60;
    // console.log("did it reset?");
    // console.log("asteroid's visiblity: "+asteroid.visible);
    // console.log("asteroid's x: "+asteroid.x);
    // console.log("asteroid's y: "+asteroid.y);
    // stage.addChild(rocket, asteroid);
    // fireAsteroid();
}

function newGame(){
    asteroid.x = getRandomNumber(500);
    asteroid.y = -70;
    stage.addChild(asteroid);
    myTween = createjs.Tween.get(asteroid).to({x: STAGE_WIDTH/2, y: 600}, 20000).call(handleComplete);
    function handleComplete(){
        console.log("tween has completed");
    }
    resetRocketPosition();
}
/*
 * Place graphics and add them to the stage.
 */
function fireAsteroid(){
    tween = createjs.Tween.get(asteroid).to({x: STAGE_WIDTH/2, y: 600}, 20000);
    // console.log("fireAsteroid was called");
}

function resetAsteriod(){
    createjs.Tween.get(asteroid).to({x: getRandomNumber(500), y: -60}, -1).to({x: STAGE_WIDTH/2, y: 600}, 20000);
    stage.addChild(asteroid);
    console.log("reset was called");

    // createjs.Tween.get(asteroid).wait(1000).to({x: STAGE_WIDTH/2, y: 600}, 20000);
    // toggleTween(tween);
    // asteroid.visible = true;
    // fireAsteroid();
}

function toggleTween(tween) {
    if (tween.paused) {
        // tween.paused = false;
        // tween.setPaused(false);
    } else {
        tween.paused = true;
        tween.setPaused(true);
    }
}

function initGraphics() {

    stage.addChild(background);

    container = new createjs.Container();
    container.x = 410;
    container.y = 473;

    asteroidContainer = new createjs.Container();
    asteroidContainer.addChild(asteroid);

    container.addChild(whiteArrow);
    //    container.addChild(rocket);
    stage.addChild(container);

    container.regX = -3;
    container.regY = 17;

    base.x = 15;
    base.y = 30;
    stage.addChild(base);

    rocket.x = 412;
    rocket.y = 475;

    rocket.regX = -10;
    rocket.regY = 25.5;
    stage.addChild(rocket);
    // rocket.visible = false;

    // asteroidX = getRandomNumber(500);
    // asteroid.x = asteroidX;
    // asteroid.x = getRandomNumber(500);
    // asteroid.y = -70;
    // stage.addChild(asteroid);
    newGame();
    // resetAsteriod();
    // fireAsteroid();

    miss.x = missHover.x = 0;
    miss.y = missHover.y = 0;
    // miss.x = missHover.x = 95;
    // miss.y = missHover.y = 40;
    stage.addChild(miss);
    miss.visible = false;

    nextButton.x = nextButtonHover.x = 0;
    nextButton.y = nextButtonHover.y = 0;
    // stage.addChild(nextButton);
    // nextButton.visible = false;
    // asteroid.y = 400;
    // asteroid.y = -70;
    // angleBetweenAsteroidAndBase = -Math.atan(0 - 400 / asteroid.x - 400);
    // console.log("Asteroid X: " + asteroid.x);
    // console.log("Base X: " + base.x);
    // console.log("Asteroid Y: " + asteroid.y);
    // console.log("Base Y: " + base.y);

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
    inputBoxHTML.placeholder = "0";
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
    // inputBoxHTML.onchange= updateAngle;

    document.body.appendChild(inputBoxHTML);
    inputBox = new createjs.DOMElement(inputBoxHTML);
    stage.addChild(inputBox);
    //    inputBox.visible = true;
    //    inputBox.htmlElement.style.border = "2px solid red";
    inputBox.htmlElement.style.border = "none";


    $(document).ready(function () {
        $('input').bind("enterKey", function (e) {
            // alert("angle is now: " + angle);
            fire();
        });
        $('input').keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }

        });
    });
    //    var UserInput = new TextInput();
    //      UserInput.y = UserInput.x = 400;
    //      UserInput.placeHolder = "Input Field";
    //      stage.addChild(UserInput);
    //      // Updates the text field to the new internal data (ie. placeholder)
    //      textField.update();

    // explosion animation
    var explosionSpriteData = {
      images: ["images/explosion.png"],
      frames: {width:100, height:100, count:81, regX:0, regY:0, spacing:0, margin:0},
      animations: {
        explode: [0, 81, false]
      }
    };
    explosionAnimation = new createjs.Sprite(new createjs.SpriteSheet(explosionSpriteData));

    initMuteUnMuteButtons();
    initListeners();

    // start the game
    gameStarted = true;
    stage.update();


}

//generate a random number
function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//validates the user input to ensure the angle is between 0 and 180. If so there angle is set the user input
function updateAngle() {
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

    //fire button attributes
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


    //reset button attributes
    resetButton.on("mouseover", function () {
        stage.addChild(resetButtonPressed);
        stage.removeChild(resetButton);
        playSound("click");
    });
    resetButtonPressed.on("mouseout", function () {
        stage.addChild(resetButton);
        stage.removeChild(resetButtonPressed);
    });
    //once pressed, the fire function will be called
    resetButtonPressed.on("click", reset);

    //miss attributes
    nextButton.on("mouseover", function () {
        stage.addChild(nextButtonHover);
        // stage.removeChild(nextButton);
        nextButtonHover.visible = true;
        nextButton.visible = false;
        playSound("click");
    });
    nextButtonHover.on("mouseout", function () {
        // stage.addChild(nextButton);
        nextButton.visible = true;
        nextButtonHover.visible = false;
        // stage.removeChild(nextButtonHover);
    });
    //once pressed, the fire function will be called
    nextButtonHover.on("click", nextButtonPressed);
}


function fire() {
    console.log("fire was tapped");
    shotsFired = true;
    rocket.visible = true;
    updateAngle();
}
function reset() {
    console.log("reset was tapped");
    level--;
}
function missed(){
    stage.addChild(nextButton);
    stage.addChild(nextButtonHover);
    nextButton.visible = true;
    stage.addChild(miss);
    miss.visible = true;
    // fireButton.visible = fireButtonPressed.visible = false;
    // resetButton.visible = resetButtonPressed.visible = false;
    // stage.removeChild(fireButton);
    // stage.removeChild(fireButtonPressed);
    // stage.removeChild(resetButton);
    // stage.removeChild(resetButtonPressed);
}

function nextLevel(){
    resetButton.visible = fireButton.visible = false;
    stage.addChild(nextButtonHover);
    stage.addChild(nextButton);
    nextButtonHover.visible = false;
    // resetRocketPosition();

}
function nextButtonPressed(){
    asteroid.x = getRandomNumber(500);
    asteroid.y = 0;
    // miss.visible = false;

    if (sucess){
    stage.removeChild(hit);
    }else{
    stage.removeChild(miss);
    }
    resetButton.visible = fireButton.visible = true;
    stage.removeChild(nextButton);
    stage.removeChild(nextButtonHover);
    newGame();
    // resetRocketPosition();

    // nextButton.visible = nextButtonHover.visible = false;
    // fireButton.visible  = true;
    // resetButton.visible = true;
    stage.addChild(fireButton);
    stage.addChild(resetButton);
    level++;
    score--;
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
var miss, missHover
var hit;
var nextButton, nextButtonHover;
var asteroid;

/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [{
        src: "images/mute.png",
        id: "mute"
    }, {
        src: "images/unmute.png",
        id: "unmute"
    }, {
        src: "images/background.png",
        id: "background"
    }, {
        src: "images/whiteArrow.png",
        id: "whiteArrow"
    }, {
        src: "images/base.png",
        id: "base"
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
        src: "images/iRocketNew.png",
        id: "rocket"
    }, {
        src: "images/hit.png",
        id: "hit"
    }, {
        src: "images/miss.png",
        id: "miss"
    }, {
        src: "images/missHover.png",
        id: "missHover"
    },{
        src: "images/nextButton.png",
        id: "nextButton"
    },{
        src: "images/nextButtonHover.png",
        id: "nextButtonHover"
    }, {
        src: "images/asteroid.png",
        id: "asteroid"
    },	{
		src: "sounds/explosion.wav",
		id: "explosionSound"
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
    } else if (event.item.id == "base") {
        base = new createjs.Bitmap(event.result);
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
    } else if (event.item.id == "hit") {
        hit = new createjs.Bitmap(event.result);
    }  else if (event.item.id == "miss") {
        miss = new createjs.Bitmap(event.result);
    } else if (event.item.id == "missHover") {
        missHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "nextButton") {
        nextButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "nextButtonHover") {
        nextButtonHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "asteroid") {
        asteroid = new createjs.Bitmap(event.result);
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
