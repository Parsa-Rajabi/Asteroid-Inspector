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
var scoreText;
var angle = 0;
var container;
var inputBox;
var inputBoxHTML;
var shotsFired = false;

var levelText;
var level = 1;
var score = 0;
var rocketAtBase;
var asteroidContainer;
//normal game speed
var asteroidSpeedInitial = 20000;
var rocketSpeed = 10;

//for testing and debugging
// var asteroidSpeedInitial =2000;
// var rocketSpeed = 1;

var asteroidSpeed = asteroidSpeedInitial;

var angleType;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
var explosionAnimation;

var success = false;

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

        try {
            if (shotsFired) {
                const deltaX = Math.cos(convertToRad(angle)) * rocketSpeed;
                const deltaY = Math.sin(convertToRad(angle)) * rocketSpeed;
                rocket.x += deltaX;
                rocket.y -= deltaY;
                // intersection is null if no collision, otherwise a {x,y,width,height}-Object is returned
                //if there is a collision...
                if (ndgmr.checkPixelCollision(rocket, asteroid, 1)) {
                    shotsFired = false;
                    // explode asteroid
                    explosionAnimation.x = asteroid.x;
                    explosionAnimation.y = asteroid.y;
                    explosionAnimation.scaleX = explosionAnimation.scaleY = 1.4; // adjust as needed to hide asteroid.
                    stage.addChild(explosionAnimation);
                    explosionAnimation.gotoAndPlay("explode");

                    resetObjects();
                    score++;
                    success = true;
                    playSound("explosionSound");
                    bonusQuestion();
                    newGame();
                    levelUp();

                }
                //there was no collision
                else {
                    //if the rocket goes out of bounds to the left or right of screen
                    //resetGame it's position to origin at base - ready to be shot again
                    if (rocket.x >= 765 || rocket.x <= 0) {
                        missedAsteroid()
                    } else if (rocket.y <= 0) {
                        missedAsteroid()
                    }
                }
            }
        } catch (e) {
            console.log("error is: " + e);
        }

        //text boxes

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
        levelText.x = 177 - levelText.getMeasuredWidth();
        levelText.y = 80;
        stage.addChild(levelText);

        container.rotation = -angle;
        rocket.rotation = -angle;

        updateSelectPositions();

        //updates the background based on the level
        if(level == 1 || level == 12){
            stage.removeChild(back11);
            stage.addChildAt(back1,0);
        } else if(level == 2 || level == 13){
            stage.removeChild(back1);
            stage.addChildAt(back2,0);
        } else if(level == 3 || level == 14){
            stage.removeChild(back2);
            stage.addChildAt(back3,0);
        } else if(level == 4 || level == 15){
            stage.removeChild(back3);
            stage.addChildAt(back4,0);
        } else if(level == 5 || level == 16){
            stage.removeChild(back4);
            stage.addChildAt(back5,0);
        } else if(level == 6 || level == 17){
            stage.removeChild(back5);
            stage.addChildAt(back6,0);
        } else if(level == 7 || level == 18){
            stage.removeChild(back6);
            stage.addChildAt(back7,0);
        } else if(level == 8 || level == 19){
            stage.removeChild(back7);
            stage.addChildAt(back8,0);
        } else if(level == 9 || level == 20){
            stage.removeChild(back8);
            stage.addChildAt(back9,0);
        } else if(level == 10 || level == 21){
            stage.removeChild(back9);
            stage.addChildAt(back10,0);
        } else if(level == 11 || level == 22){
            stage.removeChild(back10);
            stage.addChildAt(back11,0);
        }else
            stage.addChild(back1);
    }//ends the game
    stage.update(event);
}

//converts a given degrees angle to radians
function convertToRad(degAngle) {
    return (degAngle * (Math.PI / 180));
}

function initGraphics() {
    stage.addChild(back1);

    container = new createjs.Container();
    container.x = 410;
    container.y = 473;

    asteroidContainer = new createjs.Container();
    asteroidContainer.addChild(asteroid);

    whiteArrow.x = 10;
    whiteArrow.y = 10;
    container.addChild(whiteArrow);
    stage.addChild(container);

    container.regX = -3;
    container.regY = 17;

    base.x = 15;
    base.y = 30;
    stage.addChild(base);

    rocket.x = 412;
    rocket.y = 472;

    rocket.regX = -3;
    rocket.regY = 17;

    stage.addChild(rocket);
    rocket.visible = false;


    rocket.regX = -10;
    rocket.regY = 25.5;
    stage.addChild(rocket);
    // rocket.visible = false;

    //positioning of the fire button
    fireButton.x = fireButtonPressed.x = 340;
    fireButton.y = fireButtonPressed.y = 500;
    stage.addChild(fireButton);


    //positioning of the fire button
    resetButton.x = resetButtonPressed.x = 425;
    resetButton.y = resetButtonPressed.y = 500;
    // stage.addChild(resetButton);

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
    // inputBoxHTML.onkeyup = updateAngle;
    inputBoxHTML.onchange= updateAngle;

    document.body.appendChild(inputBoxHTML);
    inputBox = new createjs.DOMElement(inputBoxHTML);
    stage.addChild(inputBox);
    //TODO: Change the outline of the inputbox using border
    //    inputBox.htmlElement.style.border = "2px solid red";
    inputBox.htmlElement.style.border = "none";

    //after users presses enter the function fire is invoked
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

    // explosion animation
    var explosionSpriteData = {
        images: ["images/explosion.png"],
        frames: {width: 100, height: 100, count: 81, regX: 0, regY: 0, spacing: 0, margin: 0},
        animations: {
            explode: [0, 81, false]
        }
    };
    explosionAnimation = new createjs.Sprite(new createjs.SpriteSheet(explosionSpriteData));

    initMuteUnMuteButtons();
    initListeners();
    start();

    // start the game
    gameStarted = true;
    stage.update();
}

//validates the user input to ensure the angle is between 0 and 180. If so there angle is set the user input
function updateAngle() {
    if (rocketAtBase) {
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
}

function updateSelectPositions() {
    let selectY = 538; // Need to check this in firefox
    if (isChrome) {
        selectY = 538;
    }
    inputBox.x = gameCanvas.getBoundingClientRect().left + 120;
    inputBox.y = gameCanvas.getBoundingClientRect().top + selectY
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


function easyListener(button, buttonHover, buttonHoverOnClick) {
    //miss attributes
    button.on("mouseover", function () {
        stage.addChild(buttonHover);
        // stage.removeChild(button);
        buttonHover.visible = true;
        button.visible = false;
        playSound("click");
    });
    buttonHover.on("mouseout", function () {
        button.visible = true;
        buttonHover.visible = false;
        // stage.addChild(button);
        // stage.removeChild(buttonHover);
    });
    //once pressed, the fire function will be called
    buttonHover.on("click", buttonHoverOnClick);

}


/*
 * Add listeners to objects.
 */
function initListeners() {
    // easyListener(acuteButton, acuteButtonHover, setTypeAcute);
    // easyListener(rightButton, rightButtonHover, setTypeRight);
    // easyListener(obtuseButton, obtuseButtonHover, setTypeObtuse);

    acuteButton.on("click", setTypeAcute);
    rightButton.on("click", setTypeRight);
    obtuseButton.on("click", setTypeObtuse);

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


    //resetGame button attributes
    resetButton.on("mouseover", function () {
        stage.addChild(resetButtonPressed);
        stage.removeChild(resetButton);
        playSound("click");
    });
    resetButtonPressed.on("mouseout", function () {
        // stage.addChild(resetButton);
        stage.removeChild(resetButtonPressed);
    });
    //once pressed, the fire function will be called
    resetButtonPressed.on("click", resetGame);

    //the gameover resetGame button properties
    //resetGame button 2attributes
    resetButton2.on("mouseover", function () {
        stage.addChild(resetButtonPressed2);
        resetButtonPressed2.visible = true;
        resetButton2.visible = false;
        // stage.removeChild(resetButton2);
        playSound("click");
    });
    resetButtonPressed2.on("mouseout", function () {
        // stage.addChild(resetButton2);
        resetButton2.visible = true;
        resetButtonPressed2.visible = false;
        // stage.removeChild(resetButtonPressed2);
    });
    //once pressed, the fire function will be called
    resetButtonPressed2.on("click", resetGame);

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

    //start attributes
    startButton.on("mouseover", function () {
        stage.addChild(startButtonHover);
        stage.removeChild(startButton);
        // startButtonHover.visible = true;
        // startButton.visible = false;
        playSound("click");
    });
    startButtonHover.on("mouseout", function () {
        stage.addChild(startButton);
        // startButton.visible = true;
        // startButtonHover.visible = false;
        stage.removeChild(startButtonHover);
    });
    //once pressed, the fire function will be called
    startButtonHover.on("click", function () {
        stage.removeChild(instructions);
        startButtonHover.visible = startButton.visible = false;
        resetButton.visible = fireButton.visible = true;
        //adds asteroid to game with given positions
        newGame();
    });
}

//fire the rocket out of the base
function fire() {
    //!success: checks to make sure there is no collision - the rocket will only fire if there wsa NOT a collison
    //rocketAtBase: checks to insure the rocket is at base so the user does not change the directions of the rocket mid-air
    if (!success && rocketAtBase) {
        if (!stage.contains(resetButton2)) {
            shotsFired = true;
            rocket.visible = true;
            updateAngle();
            rocketAtBase = false;
        }
    }
    //after rocket leaves the base, the values of the angle set box resetGame
    if(!rocketAtBase){
        inputBoxHTML.value = '';
    }
}

//resets the game both resetGame buttons use this function
function resetGame() {

    asteroid.scaleX = asteroid.scaleY = 1;

    stage.addChild(base);
    container.addChild(whiteArrow);
    stage.addChild(rocket);
    stage.removeChild(explosionAnimation);
    stage.removeChild(gameover);
    resetButton.visible = fireButton.visible = true;
    stage.removeChild(resetButton2);
    stage.removeChild(resetButtonPressed2);
    level = 1;
    score = 0;
    stage.addChildAt(back1,0);
    asteroidSpeed = asteroidSpeedInitial;
    resetObjects();
    newGame();
}

function start() {
    stage.addChild(instructions);
    resetButton.visible = fireButton.visible = false;
    stage.addChild(startButton);
}

function levelUp() {
    level++;
    asteroidSpeed = asteroidSpeed - 1000;

    asteroid.scaleX = asteroid.scaleX -0.05;
    asteroid.scaleY = asteroid.scaleY  -0.05;
    // console.log("Level: " + level + " Speed: "+ asteroidSpeed);

}

//resets all moving objects of the game
function resetObjects() {
    //stops the createjs.tween animiation on asteroid
    createjs.Tween.removeTweens(asteroid);
    stage.removeChild(asteroid);
    resetRocketPosition();
}

//after a rocket is missed, a message for a duration of 1750 milli seconds appears so the user tries again
function missedAsteroid() {
    if (stage.contains(levelUpWindow)){
        removeBonusAndLevelUp();
    }
    // resetObjects();
    stage.addChildAt(miss,1);
    setTimeout(function () {
        stage.removeChild(miss);
    }, 1750);

    resetRocketPosition();
    //check to insure the user does not go in to the negative points
    if (score > 0) {
        score--;
    } else {
        score = 0;
    }
}

//sets the position of rocket to origin and sets shorts fired to false - ready to be launched again
function resetRocketPosition() {
    rocket.x = 412;
    rocket.y = 472;

    rocket.regX = -3;
    rocket.regY = 17;

    shotsFired = false;
    //remove after debugging
    // rocket.visible = true;
    rocket.visible = false;
    rocketAtBase = true;
}

//generate a random number @param(max number)
function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function leftRandom() {
    asteroid.x = -70;
    asteroid.y = getRandomNumber(420);
}

function middleRandom() {
    asteroid.x = getRandomNumber(801);
    asteroid.y = -70;
}

function rightRandom() {
    asteroid.x = 800;
    asteroid.y = getRandomNumber(420);

}

function directionGenerator() {
    var randomDirection = getRandomNumber(3);
    if (randomDirection == 0) {
        leftRandom();
    } else if (randomDirection == 1) {
        middleRandom();
    } else {
        rightRandom();
    }
}

//a new game is generated: the asteroid position is resetGame and a tween animations moves towards the base
function newGame() {
    success = false;
    // asteroid.x = getRandomNumber(500);
    // asteroid.y = -70;
    directionGenerator();
    stage.addChild(asteroid);
    createjs.Tween.get(asteroid).to({x: 360, y: 400}, asteroidSpeed).call(handleComplete);

//the function after the asteroid hits the base
    function handleComplete() {

        // explode asteroid
        explosionAnimation.x = asteroid.x;
        explosionAnimation.y = asteroid.y;
        explosionAnimation.scaleX = explosionAnimation.scaleY = 1.4; // adjust as needed to hide asteroid.
        stage.addChild(explosionAnimation);
        explosionAnimation.gotoAndPlay("explode");
        playSound("explosionSound");

        stage.removeChild(asteroid);
        stage.removeChild(base);
        stage.removeChild(rocket);
        container.removeChild(whiteArrow);
        resetButton.visible = fireButton.visible = false;

        setTimeout(function () {
            stage.addChild(gameover);
            stage.addChild(resetButton2);
            stage.addChild(resetButtonPressed2);
            resetButtonPressed2.visible = false;
        }, 1250)

    }

    resetRocketPosition();
}

function bonusQuestion() {
    if (stage.contains(miss)) {
        stage.removeChild(miss);
    }
    var shiftDownBouns = 65;
    bonusQuestionWindow.y = shiftDownBouns;
    // acuteButtonHover.y = rightButtonHover.y = obtuseButtonHover.y = shiftDownBouns;
    acuteButton.y = rightButton.y = obtuseButton.y = shiftDownBouns;
    correct.y = incorrect.y = shiftDownBouns;
    stage.addChild(bonusQuestionWindow);
    stage.addChild(acuteButton);
    stage.addChild(rightButton);
    stage.addChild(obtuseButton);
    stage.addChild(levelUpWindow);

    // stage.addChildAt(acuteButton, 3);
    // stage.addChildAt(rightButton, 3);
    // stage.addChildAt(obtuseButton, 3);
    // acuteButtonHover.visible = rightButtonHover.visible = obtuseButtonHover.visible = true;

    setTimeout(function () {
        // acuteButtonHover.visible = rightButtonHover.visible = obtuseButtonHover.visible = false;
        stage.removeChild(bonusQuestionWindow);
        stage.removeChild(correct);
        stage.removeChild(incorrect);
        removeAngleTypes();
        stage.removeChild(levelUpWindow);

    }, 3500);
}

function removeBonusAndLevelUp() {
    // acuteButtonHover.visible = rightButtonHover.visible = obtuseButtonHover.visible = false;
    stage.removeChild(bonusQuestionWindow);
    stage.removeChild(correct);
    stage.removeChild(incorrect);
    removeAngleTypes();
    stage.removeChild(levelUpWindow);

}
function removeAngleTypes() {
    stage.removeChild(acuteButton);
    stage.removeChild(rightButton);
    stage.removeChild(obtuseButton);
}


function setTypeAcute() {
    checkBonus();
    if (angleType == 0) {
        stage.addChild(correct);
        removeAngleTypes();
        score++;
    } else
        stage.addChild(incorrect);
    removeAngleTypes();

}

function setTypeRight() {
    checkBonus();
    if (angleType == 90) {
        stage.addChild(correct);
        removeAngleTypes();
        score++;
    } else
        stage.addChild(incorrect);
    removeAngleTypes();

}

function setTypeObtuse() {
    checkBonus();
    if (angleType == 180) {
        stage.addChild(correct);
        removeAngleTypes();
        score++;
    } else
        stage.addChild(incorrect);
    removeAngleTypes();

}


function checkBonus() {
    if (angle >= 0 && angle < 90) {
        // console.log("acute angle");
        angleType = 0;
    } else if (angle == 90) {
        // console.log("right angle");
        angleType = 90;
    } else if (angle > 90 && angle <= 180) {
        // console.log("obtuse angle");
        angleType = 180;
    } else {
        // console.log("unknown angle");
    }
}


//deals with the nextButton on click
function nextButtonPressed() {
    //check to see which screen to remove
    if (success) {
        stage.removeChild(hit);
    } else {
        stage.removeChild(miss);
    }

    resetButton.visible = fireButton.visible = true;
    stage.removeChild(nextButton);
    stage.removeChild(nextButtonHover);
    newGame();
    levelUp();
}

//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var background;
var whiteArrow;
var base;
var fireButton, fireButtonPressed;
var resetButton, resetButtonPressed;
var startButton, startButtonHover;
var instructions;
var rocket;
var miss, missHover;
var gameover;
var resetButton2, resetButtonPressed2;
var hit;
var nextButton, nextButtonHover;
var asteroid;
var bonusQuestionWindow;
var acuteButton, acuteButtonHover;
var rightButton, rightButtonHover;
var obtuseButton, obtuseButtonHover;
var correct, incorrect;
var levelUpWindow;
var back1, back2, back3,  back4, back5, back6, back7, back8, back9, back10, back11;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [{
        src: "images/mute_white.png",
        id: "mute"
    }, {
        src: "images/unmute_white.png",
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
        src: "images/gameover.png",
        id: "gameover"
    }, {
        src: "images/hit.png",
        id: "hit"
    }, {
        src: "images/miss_small.png",
        id: "miss"
    }, {
        src: "images/missHover.png",
        id: "missHover"
    }, {
        src: "images/nextButton.png",
        id: "nextButton"
    }, {
        src: "images/nextButtonHover.png",
        id: "nextButtonHover"
    }, {
        src: "images/asteroid.png",
        id: "asteroid"
    }, {
        src: "sounds/explosion.wav",
        id: "explosionSound"
    }, {
        src: "images/gameoverReset.png",
        id: "resetButton2"
    }, {
        src: "images/gameoverResetHover.png",
        id: "resetButtonPressed2"
    }, {
        src: "images/startButton.png",
        id: "startButton"
    }, {
        src: "images/startButtonHover.png",
        id: "startButtonHover"
    }, {
        src: "images/instructions.png",
        id: "instructions"
    }, {
        src: "images/AcuteButton.png",
        id: "acuteButton"
    }, {
        src: "images/acuteButtonHover.png",
        id: "acuteButtonHover"
    }, {
        src: "images/RightButton.png",
        id: "rightButton"
    }, {
        src: "images/RightButtonHover.png",
        id: "rightButtonHover"
    }, {
        src: "images/ObtuseButton.png",
        id: "obtuseButton"
    }, {
        src: "images/ObtuseButtonHover.png",
        id: "obtuseButtonHover"
    }, {
        src: "images/angleType.png",
        id: "bonusQuestionWindow"
    }, {
        src: "images/correct.png",
        id: "correct"
    }, {
        src: "images/incorrect.png",
        id: "incorrect"
    }, {
        src: "images/levelup.png",
        id: "levelUpWindow"
    }, {
        src: "images/background_1.png",
        id: "back1"
    }, {
        src: "images/background_2.png",
        id: "back2"
    }, {
        src: "images/background_3.png",
        id: "back3"
    }, {
        src: "images/background_4.png",
        id: "back4"
    }, {
        src: "images/background_5.png",
        id: "back5"
    }, {
        src: "images/background_6.png",
        id: "back6"
    }, {
        src: "images/background_7.png",
        id: "back7"
    }, {
        src: "images/background_8.png",
        id: "back8"
    }, {
        src: "images/background_9.png",
        id: "back9"
    }, {
        src: "images/background_10.png",
        id: "back10"
    }, {
        src: "images/background_11.png",
        id: "back11"
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
    } else if (event.item.id == "gameover") {
        gameover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "hit") {
        hit = new createjs.Bitmap(event.result);
    } else if (event.item.id == "miss") {
        miss = new createjs.Bitmap(event.result);
    } else if (event.item.id == "missHover") {
        missHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "nextButton") {
        nextButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "nextButtonHover") {
        nextButtonHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "asteroid") {
        asteroid = new createjs.Bitmap(event.result);
    } else if (event.item.id == "resetButton2") {
        resetButton2 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "resetButtonPressed2") {
        resetButtonPressed2 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "startButton") {
        startButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "startButtonHover") {
        startButtonHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "instructions") {
        instructions = new createjs.Bitmap(event.result);
    } else if (event.item.id == "acuteButton") {
        acuteButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "acuteButtonHover") {
        acuteButtonHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "rightButton") {
        rightButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "rightButtonHover") {
        rightButtonHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "obtuseButton") {
        obtuseButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "obtuseButtonHover") {
        obtuseButtonHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "bonusQuestionWindow") {
        bonusQuestionWindow = new createjs.Bitmap(event.result);
    } else if (event.item.id == "correct") {
        correct = new createjs.Bitmap(event.result);
    } else if (event.item.id == "incorrect") {
        incorrect = new createjs.Bitmap(event.result);
    } else if (event.item.id == "levelUpWindow") {
        levelUpWindow = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back1") {
        back1 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back2") {
        back2 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back3") {
        back3 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back4") {
        back4 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back5") {
        back5 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back6") {
        back6 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back7") {
        back7 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back8") {
        back8 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back9") {
        back9 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back10") {
        back10 = new createjs.Bitmap(event.result);
    } else if (event.item.id == "back11") {
        back11 = new createjs.Bitmap(event.result);
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
