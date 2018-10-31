// Constants are in all upper-case
var WIDTH = 26; // grid width
var HEIGHT = 17; // grid height

//Pointers to Timers and Databases that need to be started/stopped or initialized/destroyed
var tickID;
var renderID;
var GAME_DB = "analytics";
var MY_USERNAME = "bhsostek";

//The grid data
var grid = {
    width: WIDTH, // must match WIDTH!
    height: HEIGHT, // must match HEIGHT!
    src:"grid.png",//source image for the background
    data:[],//additional bead data stored here
};

//for nice fade color constantly updateing
var SIN_COLOR_INDEX = 0;
//speed at wich the sin flashes
var SIN_SPEED = 8;

//The colors that any of the crates can be
var CRATE_COLORS = [15723330,16021547,10602810,6985914,8869774];
//the color of the floor
var COLOR_FLOOR = 6974058;

//Location of all sprites in memory, sprites can be pulled from this array
var SPRITES = [];

//Buffer for crates that go off the screen
var CRATE_BUFFER = [];

//This represents the initial state of the board, what receptacles are toggled
//This variable is set whenever a level or tutorial level is generated SEE: generateLevel(), or generateTutorialLevel()
var INITIAL_TOGGLES = [];

//The initial mapping of each button to each receptacle
//This variable is set whenever a level or tutorial level is generated SEE: generateLevel(), or generateTutorialLevel()
var INITIAL_BUTTONS= [];
//used to determine which button was cliced in the touch function SEE: PS.touch()
var INITIAL_BUTTONS_INDEX = 0;

//Array of all entities in the world
var ENTITIES = [];
//Array of any entities to be added at the start of the next update
var TO_ADD = [];
//Array of any entities to be removed at the stat of the next update
var TO_REMOVE = [];

//The difficulty of the game
var DIFFICULTY = 0;

//IF the player is controlling the father
var CONTROLLING_FATHER = false;
//If the player is controlling the son
var CONTROLLING_SON = false;

//Mouse information for where the mosue was last seen
var LAST_X = 0;
var LAST_Y = 0;

//count down for adding crates
var CRATE_COUNT_DOWN = 0;
var CRATE_COUNT_DOWN_MAX = 30;

//Initializeing level
var INITIALIZING = false;

//tutorial information
var HAND_HOLDING_COUNTDOWN = 300;
var HAND_HOLDING_INDEX = HAND_HOLDING_COUNTDOWN;
var IS_TUTORIAL = true;
var TUTORIAL_RECEPTACLES = [
    {id:"reciever_1", open:false},
    {id:"reciever_2", open:false},
    {id:"reciever_3", open:false},
    {id:"reciever_4", open:false},
    {id:"reciever_5", open:false},
];
var REPEAT_TUTORIAL = false;
var TUTORIAl_LEVELS = [
    //Level 1
    {
        crates:[0],
        recievers:[
            {id:"reciever_1", open:false},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:false},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:false}],
        buttons:[
            {id:"button_1", toggles:["reciever_1"]},
            {id:"button_2", toggles:["reciever_2"]},
            {id:"button_3", toggles:["reciever_3"]},
            {id:"button_4", toggles:["reciever_4"]},
            {id:"button_5", toggles:["reciever_5"]}],
    },
    //Level 2
    {
        crates:[0,1],
        recievers:[
            {id:"reciever_1", open:false},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:false},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:false}],
        buttons:[
            {id:"button_1", toggles:["reciever_1"]},
            {id:"button_2", toggles:["reciever_2"]},
            {id:"button_3", toggles:["reciever_3"]},
            {id:"button_4", toggles:["reciever_4"]},
            {id:"button_5", toggles:["reciever_5"]}],
    },
    //Level 3
    {
        crates:[0,1],
        recievers:[
            {id:"reciever_1", open:true},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:false},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:false}],
        buttons:[
            {id:"button_1", toggles:["reciever_1"]},
            {id:"button_2", toggles:["reciever_2"]},
            {id:"button_3", toggles:["reciever_3"]},
            {id:"button_4", toggles:["reciever_4"]},
            {id:"button_5", toggles:["reciever_5"]}],
    },
    //Level 4
    {
        crates:[0,1,2,3,4],
        recievers:[
            {id:"reciever_1", open:true},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:true},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:true}],
        buttons:[
            {id:"button_1", toggles:["reciever_1"]},
            {id:"button_2", toggles:["reciever_2"]},
            {id:"button_3", toggles:["reciever_3"]},
            {id:"button_4", toggles:["reciever_4"]},
            {id:"button_5", toggles:["reciever_5"]}],
    },
    //Level 5
    {
        crates:[0,1,2,3,4],
        recievers:[
            {id:"reciever_1", open:false},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:false},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:false}],
        buttons:[
            {id:"button_1", toggles:["reciever_5"]},
            {id:"button_2", toggles:["reciever_4"]},
            {id:"button_3", toggles:["reciever_3"]},
            {id:"button_4", toggles:["reciever_2"]},
            {id:"button_5", toggles:["reciever_1"]}],
    },
    //Level 6
    {
        crates:[2],
        recievers:[
            {id:"reciever_1", open:false},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:false},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:false}],
        buttons:[
            {id:"button_1", toggles:["reciever_3"]},
            {id:"button_2", toggles:["reciever_3"]},
            {id:"button_3", toggles:["reciever_3"]},
            {id:"button_4", toggles:["reciever_3"]},
            {id:"button_5", toggles:["reciever_3"]}],
    },
    //Level 7
    {
        crates:[0,1],
        recievers:[
            {id:"reciever_1", open:false},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:false},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:false}],
        buttons:[
            {id:"button_1", toggles:["reciever_1","reciever_2"]},
            {id:"button_2", toggles:["reciever_2","reciever_3"]},
            {id:"button_3", toggles:["reciever_3","reciever_4"]},
            {id:"button_4", toggles:["reciever_4","reciever_5"]},
            {id:"button_5", toggles:["reciever_5","reciever_1"]}],
    },
    //Level 8
    {
        crates:[0,1,4],
        recievers:[
            {id:"reciever_1", open:false},
            {id:"reciever_2", open:false},
            {id:"reciever_3", open:false},
            {id:"reciever_4", open:false},
            {id:"reciever_5", open:false}],
        buttons:[
            {id:"button_1", toggles:["reciever_2","reciever_1"]},
            {id:"button_2", toggles:["reciever_3","reciever_1"]},
            {id:"button_3", toggles:["reciever_4","reciever_3"]},
            {id:"button_4", toggles:["reciever_1","reciever_5"]},
            {id:"button_5", toggles:["reciever_2","reciever_3"]}],
    },
];

//SOUND
//sound for crate hit
var SOUND_HIT = "hit";
//src:https://www.freesound.org/people/kevinkace/sounds/66780/
var SOUND_SLIDE = "slide";
//src:https://www.freesound.org/people/MC_Minnaar/sounds/365737/
var SOUND_WHISTLE_START = "whistle";
//src:https://www.freesound.org/people/theshaggyfreak/sounds/278885/
var SOUND_WHISTLE_TRY_AGAIN = "try_again";
//src:https://www.freesound.org/people/theshaggyfreak/sounds/278885/
var SOUND_BUTTON_PRESS = "button";
//src:https://www.freesound.org/people/GreekIrish/sounds/254713/
var SOUND_RECEPTACLE = "receptacle";
//src:https://www.freesound.org/people/jalastram/sounds/318915/
var SOUND_BREAK = "break";
//src:https://www.freesound.org/people/kevinkace/sounds/66771/


var HEALTH = 3;

var OVER = false;

// PS.init( system, options )
// Initializes the game
PS.init = function( system, options ) {
    "use strict";
    init();
};

var callback = function(id){
    if(id === PS.ERROR){

    }
    tickID = PS.timerStart(1, tick);
    renderID = PS.timerStart(1, render);

    //load all sprites
    loadSprite("reciever");
    loadSprite("father");
    loadSprite("son");

    // Preload & lock sounds
    PS.audioLoad( SOUND_HIT, { lock : true, path:"sound/"} );
    PS.audioLoad( SOUND_SLIDE, { lock : true, path:"sound/"} );
    PS.audioLoad( SOUND_WHISTLE_START, { lock : true, path:"sound/"} );
    PS.audioLoad( SOUND_WHISTLE_TRY_AGAIN, { lock : true, path:"sound/"} );
    PS.audioLoad( SOUND_BUTTON_PRESS, { lock : true, path:"sound/"} );
    PS.audioLoad( SOUND_RECEPTACLE, { lock : true, path:"sound/"} );
    PS.audioLoad( SOUND_BREAK, { lock : true, path:"sound/"} );

    setTimeout(function(){
        addEntity([5,14], "reciever_1", 	 "reciever", 	  "reciever", {color:15723330, open:true});
        addEntity([9,14], "reciever_2", 	 "reciever", 	  "reciever", {color:16021547, open:true});
        addEntity([13,14],"reciever_3", 	 "reciever", 	  "reciever", {color:10602810, open:true});
        addEntity([17,14],"reciever_4",    	 "reciever", 	  "reciever", {color:6985914 , open:true});
        addEntity([21,14],"reciever_5",      "reciever",      "reciever", {color:8869774 , open:true});
        addEntity([2,8],"convayor_belt_1", "conveyor_belt", ""    , {width:23,height:1,direction:"left"});
        addEntity([1,8],"convayor_belt_2", "conveyor_belt", ""    , {width:1,height:3,direction:"down"});
        addEntity([0,1],"convayor_belt_3", "conveyor_belt", ""    , {width:24,height:1,direction:"right"});
        addEntity([24,1],"convayor_belt_4", "conveyor_belt", ""    , {width:1,height:3,direction:"down"});
        addEntity([24,5],"convayor_belt_5", "conveyor_belt", ""    , {width:1,height:3,direction:"down"});
        addEntity([24,12],"convayor_belt_6", "conveyor_belt", ""    , {width:2,height:1,direction:"right"});
        addEntity([5,6],"button_1", "button", ""    , {toggles:["reciever_1","reciever_2"]              , press:0});
        addEntity([9,6],"button_2", "button", ""    , {toggles:["reciever_1","reciever_2","reciever_3"] , press:0});
        addEntity([13,6],"button_3", "button", ""    , {toggles:["reciever_2","reciever_3","reciever_4"], press:0});
        addEntity([17,6],"button_4", "button", ""    , {toggles:["reciever_3","reciever_4","reciever_5"], press:0});
        addEntity([21,6],"button_5", "button", ""    , {toggles:["reciever_4","reciever_5"]             , press:0});
        addEntity([4,4],"father", "father", "father"    , {path:[],index:0, speed:4, speedIndex:0, movingToButton:false});
        addEntity([4,11],"son", "son", "son"    , {hasCrate:PS.COLOR_BLACK, drop:false, placeOnGround:false, path:[], index:0, speed:3, speedIndex:0, canMove:false});

        // addEntity([1,11],"convayor_belt_3", "conveyor_belt", ""    , {width:23,height:1,direction:"right"});
        // addEntity([24,9],"convayor_belt_4", "conveyor_belt", ""    , {width:1,height:3,direction:"up"});
        PS.imageLoad("images/grid.png",pushImage,3);
        PS.statusText("");
        updateEntities();
        generateTutorialLevel(DIFFICULTY);
        //after level is loaded play whistle
        PS.audioPlay(SOUND_WHISTLE_START, {path: "sound/"});
        updateEntities();
    }, 1000);
}


var init = function(){
    //set the game up
    PS.gridSize( grid.width, grid.height );
    PS.border( PS.ALL, PS.ALL, 0 ); // no bead borders

    PS.gridColor(PS.COLOR_GRAY);

    PS.statusText("Loading");
    PS.imageLoad("images/loading.png",pushImage,3);

    PS.dbInit(GAME_DB, { login : callback} );
}


var tick = function(){
    //add 1 to the sin index for nice fades
    SIN_COLOR_INDEX+=SIN_SPEED;
    //so the var dosent get too big
    SIN_COLOR_INDEX%=720;
    updateEntities();

    if(OVER){
        if(getEntity("son").properties.index == getEntity("son").properties.path.length){
            PS.statusText("You did well son.");
        }
    }

    if (CONTROLLING_FATHER == true) {
        if(INITIALIZING){
            if(getCrate(24,4)!=null){
                INITIALIZING = false;
            }
        }else {
            if (getCrate(24, 4) == null && getCrate(24, 3) == null) {
                CONTROLLING_FATHER = false;
                CONTROLLING_SON = true;
                resetToggles();
            }
        }
        for(var i = 0; i < ENTITIES.length; i++){
            if(ENTITIES[i].type == "button"){
                if(ENTITIES[i].properties.press > 0){
                    ENTITIES[i].properties.press--;
                }
            }
        }
    }

    // PS.debug("Crate buffer"+CRATE_BUFFER.length+" \n");
    if(CRATE_BUFFER.length > 0){
        if(CRATE_COUNT_DOWN > 0){
            CRATE_COUNT_DOWN--;
        }else{
            if(getCrate(24,8)==null){
                var entity = popCrateBuffer();
                addEntity(entity[0],entity[1],entity[2],entity[3],entity[4]);
            }
            CRATE_COUNT_DOWN = CRATE_COUNT_DOWN_MAX;
        }
    }

    if(IS_TUTORIAL){
        if(HAND_HOLDING_INDEX>0){
            HAND_HOLDING_INDEX--;
        }
    }

    loop:{
        if (CONTROLLING_SON == true) {
            if(!OVER) {
                //father has stopped moving
                if (getEntity("father").properties.path.length == getEntity("father").properties.index) {
                    for (var i = 0; i < ENTITIES.length; i++) {
                        if (ENTITIES[i].type == "button") {
                            if (getEntity("father").properties.movingToButton) {
                                if (INITIAL_BUTTONS_INDEX < INITIAL_BUTTONS.length) {
                                    PS.audioPlay(SOUND_BUTTON_PRESS, {path: "sound/"});
                                    pressButton(INITIAL_BUTTONS[INITIAL_BUTTONS_INDEX]);
                                    INITIAL_BUTTONS_INDEX++;
                                }
                                getEntity("father").properties.movingToButton = false;
                                getEntity("son").properties.canMove = true;
                                //check to see if the crate can be placed
                                var canPlace = false;
                                for (var j = 0; j < ENTITIES.length; j++) {
                                    if (ENTITIES[j].type == "reciever") {
                                        if (ENTITIES[j].properties.color == getEntity("son").properties.hasCrate) {
                                            if (ENTITIES[j].properties.open) {
                                                canPlace = true;
                                            }
                                        }
                                    }
                                }
                                if (canPlace == false) {
                                    getEntity("son").properties.path = PS.line(getEntity("son").origin[0], getEntity("son").origin[1], 23, 12);
                                    getEntity("son").properties.index = 0;
                                    getEntity("son").properties.placeOnGround = true;
                                }
                            }
                            if (ENTITIES[i].id == INITIAL_BUTTONS[INITIAL_BUTTONS_INDEX - 1]) {
                                if (ENTITIES[i].properties.press < 8) {
                                    ENTITIES[i].properties.press++;
                                }
                            } else {
                                if (ENTITIES[i].properties.press > 0) {
                                    ENTITIES[i].properties.press--;
                                }
                            }
                        }
                    }
                }


                //ready to move onto the next level
                if (getEntity("son").properties.hasCrate == PS.COLOR_BLACK) {
                    if (getEntity("son").properties.path.length == getEntity("son").properties.index) {
                        if (getNumCrates() + CRATE_BUFFER.length == 0) {
                            if (getEntity("father").origin[0] != 4 && getEntity("father").properties.index != 0) {
                                getEntity("father").properties.path = PS.line(getEntity("father").origin[0], getEntity("father").origin[1], 4, 4);
                                getEntity("father").properties.index = 0;
                            } else {
                                if (getEntity("father").properties.path.length == getEntity("father").properties.index) {
                                    DIFFICULTY += 1;
                                    // PS.debug("Generating new level:"+DIFFICULTY+"\n");
                                    if(DIFFICULTY < TUTORIAl_LEVELS.length && IS_TUTORIAL){
                                        if(REPEAT_TUTORIAL){
                                            DIFFICULTY-=1;
                                            PS.audioPlay(SOUND_WHISTLE_TRY_AGAIN, {path: "sound/"});
                                            REPEAT_TUTORIAL = false;
                                        }
                                        generateTutorialLevel(DIFFICULTY);
                                    }else{
                                        if(IS_TUTORIAL){
                                            //starting difficulty after the tutorial
                                            DIFFICULTY = 4;
                                        }
                                        generateLevel(DIFFICULTY);
                                        IS_TUTORIAL = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //move father
            if(getEntity("father").properties.speedIndex == 0) {
                if (getEntity("father").properties.index < getEntity("father").properties.path.length) {
                    getEntity("father").origin[0] = getEntity("father").properties.path[getEntity("father").properties.index][0];
                    getEntity("father").origin[1] = getEntity("father").properties.path[getEntity("father").properties.index][1];
                    getEntity("father").properties.index++;
                }
                getEntity("father").properties.speedIndex = getEntity("father").properties.speed;
            }else{
                getEntity("father").properties.speedIndex--;
            }

            //move son
            if(getEntity("son").properties.speedIndex == 0) {
                if (getEntity("son").properties.index < getEntity("son").properties.path.length) {
                    getEntity("son").origin[0] = getEntity("son").properties.path[getEntity("son").properties.index][0];
                    getEntity("son").origin[1] = getEntity("son").properties.path[getEntity("son").properties.index][1];
                    getEntity("son").properties.index++;
                    getEntity("son").properties.speedIndex = getEntity("son").properties.speed;
                    break loop;
                }
            }else{
                getEntity("son").properties.speedIndex--;
                break loop;
            }

            if(!OVER) {
                if (getEntity("son").properties.drop) {
                    PS.dbEvent(GAME_DB, "difficulty", DIFFICULTY, "color", colorToText(getEntity("son").properties.hasCrate), "receptacle", true);
                    getEntity("son").properties.hasCrate = PS.COLOR_BLACK;
                    getEntity("son").properties.drop = false;
                    //in receptacle
                    PS.audioPlay(SOUND_RECEPTACLE, {path: "sound/"});
                }


                if (getEntity("son").properties.placeOnGround) {
                    HEALTH--;
                    PS.dbEvent(GAME_DB, "difficulty", DIFFICULTY, "color", colorToText(getEntity("son").properties.hasCrate), "receptacle", false);
                    getEntity("son").properties.hasCrate = PS.COLOR_BLACK;
                    getEntity("son").properties.placeOnGround = false;
                    getEntity("son").properties.path = PS.line(getEntity("son").origin[0], getEntity("son").origin[1], 2, 12);
                    getEntity("son").properties.index = 0;
                    if(!IS_TUTORIAL) {
                        if (HEALTH <= 0) {
                            PS.dbSend(GAME_DB, MY_USERNAME);
                            getEntity("son").properties.path = PS.line(getEntity("son").origin[0], getEntity("son").origin[1], getEntity("father").origin[0]+1, getEntity("father").origin[1]);
                            getEntity("son").properties.index = 0;
                            OVER = true;
                        }
                    }else{
                        REPEAT_TUTORIAL = true;
                        // PS.debug("REPEAT_TUTORIAL:"+REPEAT_TUTORIAL+"\n");
                    }
                    // add a crate into the world break
                    PS.audioPlay(SOUND_BREAK, {path: "sound/"});
                }

                if (getEntity("son").properties.hasCrate == PS.COLOR_BLACK) {
                    if (getEntity("son").origin[0] != 2) {
                        if (getEntity("son").origin[1] != 12) {
                            getEntity("son").properties.path = PS.line(getEntity("son").origin[0], getEntity("son").origin[1], 2, 12);
                            getEntity("son").properties.index = 0;
                            break loop;
                        }
                    }
                    if (getEntity("son").origin[0] == 2) {
                        if (getEntity("son").origin[1] == 12) {
                            var crate = getCrate(1, 11);
                            if (crate != null) {
                                getEntity("son").properties.hasCrate = crate.properties.color;
                                pickupCrate();
                                removeEntity(crate.id);
                                updateEntities();
                            }
                        }
                    }
                }
            }
        }
    }
    //If a hit sound has played this tick, play the slide sound instead
    var hit = false;
    var slide = false;
    //find the falling action of crates, make a noise when this happens
    for(var j = 0; j < ENTITIES.length; j++) {
        if (ENTITIES[j].type == "crate") {
            if(ENTITIES[j].properties.lastMoving!=ENTITIES[j].properties.moving){
                if(ENTITIES[j].properties.moving){
                    //Rising action
                }else{
                    //Falling action
                    if(!hit) {
                        hit = true;
                    }else{
                        if(!slide){
                            //if more hits this tick, slide
                            slide = true;
                        }
                    }
                }
            }
            ENTITIES[j].properties.lastMoving = ENTITIES[j].properties.moving;
        }
    }
    //conditions to play hit
    if(hit && !slide){
        PS.audioPlay(SOUND_HIT, {path: "sound/"});
    }
    //conditions to play slide
    if(hit && slide){
        PS.audioPlay(SOUND_SLIDE, {path: "sound/"});
    }

    //set the moving state of all crates to be false
    for(var j = 0; j < ENTITIES.length; j++) {
        if (ENTITIES[j].type == "crate") {
            ENTITIES[j].properties.moving = false;
        }
    }

    //moves all crates that are on convayer belts
    for(var i = 0; i < ENTITIES.length; i++){
        if(ENTITIES[i].type == "conveyor_belt"){
            for(var j = 0; j < ENTITIES.length; j++){
                if(ENTITIES[j].type == "crate"){
                    if(isPointInRect(ENTITIES[j].origin[0],ENTITIES[j].origin[1],ENTITIES[i].origin[0],ENTITIES[i].origin[1],ENTITIES[i].properties.width,ENTITIES[i].properties.height)){
                        //up
                        if(ENTITIES[i].properties.direction == "up"){
                            if(getCrate(ENTITIES[j].origin[0],ENTITIES[j].origin[1]-1)==null) {
                                ENTITIES[j].origin[1]--;
                                ENTITIES[j].properties.moving = true;
                            }else{
                                ENTITIES[j].properties.moving = false;
                            }
                        }
                        //down
                        if(ENTITIES[i].properties.direction == "down") {
                            if (getCrate(ENTITIES[j].origin[0], ENTITIES[j].origin[1]+1) == null) {
                                ENTITIES[j].origin[1]++;
                                ENTITIES[j].properties.moving = true;
                            }else{
                                ENTITIES[j].properties.moving = false;
                            }
                        }
                        //left
                        if(ENTITIES[i].properties.direction == "left"){
                            if (getCrate(ENTITIES[j].origin[0]-1, ENTITIES[j].origin[1]) == null) {
                                ENTITIES[j].origin[0]--;
                                ENTITIES[j].properties.moving = true;
                            }else{
                                ENTITIES[j].properties.moving = false;
                            }
                        }
                        //right
                        if(ENTITIES[i].properties.direction == "right"){
                            if (getCrate(ENTITIES[j].origin[0]+1, ENTITIES[j].origin[1]) == null) {
                                ENTITIES[j].origin[0]++;
                                ENTITIES[j].properties.moving = true;
                            }else{
                                ENTITIES[j].properties.moving = false;
                            }
                        }
                    }
                }
            }
        }
    }
}

var render = function(){
    //reset grid
    for(var j = 0; j < grid.height; j++){
        for(var i = 0; i < grid.width; i++){
            PS.color(i,j,grid.data[i+(j*grid.width)]);
            PS.border(i,j,{ top : 0, left : 0, bottom : 0, right : 0});
            PS.borderColor(i,j,PS.color(i,j));
        }
    }
    drawEntities();
    if(IS_TUTORIAL){
        if(HAND_HOLDING_INDEX<=0) {
            //find button
            var crate = getCrate(24, 4);
            if (crate != null) {
                var open;
                for (var i = 0; i < ENTITIES.length; i++) {
                    if (ENTITIES[i].type == "reciever") {
                        if (crate.properties.color == ENTITIES[i].properties.color) {
                            for (var j = 0; j < TUTORIAL_RECEPTACLES.length; j++) {
                                if (TUTORIAL_RECEPTACLES[j].id == ENTITIES[i].id) {
                                    open = TUTORIAL_RECEPTACLES[j].open;
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < ENTITIES.length; i++) {
                    if (ENTITIES[i].type == "button") {

                        var count = 0;
                        for (var j = 0; j < ENTITIES[i].properties.toggles.length; j++) {
                            if (getEntity(ENTITIES[i].properties.toggles[j]).properties.color == crate.properties.color) {
                                count++;
                            }
                        }
                        if (!open) {
                            if (count % 2 == 1) {
                                PS.color(ENTITIES[i].origin[0], ENTITIES[i].origin[1], crossFadeColors(PS.COLOR_BLACK, PS.COLOR_WHITE, (getSIN() / 2)));
                            } else {
                                PS.color(ENTITIES[i].origin[0], ENTITIES[i].origin[1], PS.COLOR_BLACK);
                            }
                        } else {
                            if (count % 2 == 1) {
                                PS.color(ENTITIES[i].origin[0], ENTITIES[i].origin[1], PS.COLOR_BLACK);
                            } else {
                                PS.color(ENTITIES[i].origin[0], ENTITIES[i].origin[1], crossFadeColors(PS.COLOR_BLACK, PS.COLOR_WHITE, ((getSIN() + 0.5) / 2)));
                            }
                        }


                    }
                }
            }
        }
    }
}
// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched

PS.touch = function( x, y, data, options ) {
    "use strict";
    // if(IS_TUTORIAL){
        //find button
        var button;
        loop:{
            for (var i = 0; i < ENTITIES.length; i++) {
                if (ENTITIES[i].type == "button") {
                    if (ENTITIES[i].origin[0] == x) {
                        if (ENTITIES[i].origin[1] == y) {
                            button = ENTITIES[i];
                            //if button has been pressed, reset the count down timer, play button press
                            HAND_HOLDING_INDEX = HAND_HOLDING_COUNTDOWN;
                            break loop;
                        }
                    }
                }
            }
        }
        if(button!=null) {
            for (var i = 0; i < button.properties.toggles.length; i++) {
                var toggle = button.properties.toggles[i];
                for (var j = 0; j < TUTORIAL_RECEPTACLES.length; j++) {
                    if (TUTORIAL_RECEPTACLES[j].id == toggle) {
                        TUTORIAL_RECEPTACLES[j].open = !TUTORIAL_RECEPTACLES[j].open
                    }
                }
            }
        }
    // }

    if(CONTROLLING_FATHER){
        for (var i = 0; i < ENTITIES.length; i++) {
            if (ENTITIES[i].type == "button") {
                if (ENTITIES[i].origin[0] == x) {
                    if (ENTITIES[i].origin[1] == y) {
                        INITIAL_BUTTONS[INITIAL_BUTTONS.length] = ENTITIES[i].id;
                        if(getCrate(24,4)!=null){
                            getCrate(24,4).origin[1]+=1;
                            tick();
                        }
                    }
                }
            }
        }
    }

    if(CONTROLLING_SON){
        if(getEntity("son").properties.canMove) {
            for (var i = 0; i < ENTITIES.length; i++) {
                if (ENTITIES[i].type == "reciever") {
                    if (isPointInRect(x, y, ENTITIES[i].origin[0] - 1, ENTITIES[i].origin[1], 3, 2)) {
                        if (ENTITIES[i].properties.color == getEntity("son").properties.hasCrate) {
                            if (ENTITIES[i].properties.open) {
                                getEntity("son").properties.path = PS.line(getEntity("son").origin[0], getEntity("son").origin[1], x, 11);
                                getEntity("son").properties.index = 0;
                                getEntity("son").properties.drop = true;
                                getEntity("son").properties.canMove = false;
                            }
                        }
                    }
                }
            }
        }
    }
};

// All event functions must be present to prevent startup errors,
// even if they don't do anything

PS.release = function( x, y, data, options ) {
    "use strict";
};

PS.enter = function( x, y, data, options ) {
    "use strict";
    LAST_X = x;
    LAST_Y = y;
};

PS.exit = function( x, y, data, options ) {
    "use strict";
};

PS.exitGrid = function( options ) {
    "use strict";
};

PS.keyDown = function( key, shift, ctrl, options ) {
    "use strict";
    if(key == 8){
        var crate = getCrate(1,11);
        if(crate!=null){
            removeEntity(crate.id);
        }
    }
};

PS.keyUp = function( key, shift, ctrl, options ) {
    "use strict";
};

PS.swipe = function( data, options ) {
    "use strict";
};

PS.input = function( sensors, options ) {
    "use strict";
};

PS.shutdown = function(options){
    if(PS.dbValid(GAME_DB)){
        PS.dbEvent(GAME_DB, "shutdown", 1);// record the shutdown event
        PS.dbSend(GAME_DB, MY_USERNAME, {discard:true});
    }
}

var loadSprite = function(src){
    PS.imageLoad("images/"+src+".png",addSprite,3);
}

var addEntity = function(origin, id, type, src, properties){
    var colors = [];
    var image=null;

    for(var i = 0; i < SPRITES.length; i++){
        if(SPRITES[i].source == "images/"+src+".png"){
            image = SPRITES[i];
        }
    }

    //if the entity has a base image
    if(image!=null) {
        for (var j = 0; j < image.height; j++) {
            for (var i = 0; i < image.width; i++) {
                colors[i + (j * image.width)] = (image.data[((i + (j * image.width)) * 3) + 0] * 65536) + (image.data[((i + (j * image.width)) * 3) + 1] * 256) + (image.data[((i + (j * image.width)) * 3) + 2]);
            }
        }
    }else{
        //otherwise
        colors[0] = PS.COLOR_BLACK;
        image = {
            width:1,
            height:1
        }
    }

    var id = id;
    var origin = origin;

    var entity = {
        id:id,
        type:type,
        origin:origin,
        width:image.width,
        height:image.height,
        colors:colors,
        properties:properties
    };

    TO_ADD[TO_ADD.length] = entity;
}

var getEntity = function(id){
    for (var i = 0; i < ENTITIES.length; i++) {
        if(ENTITIES[i] != 0) {
            if (ENTITIES[i].id === id) {
                return ENTITIES[i];
            }
        }
    }
}

var removeEntity = function(id){
    var enity = {
        id:id
    };
    TO_REMOVE[TO_REMOVE.length] = enity;
}

//Update entities
var updateEntities = function () {
    //hold out array in new Variable
    var out = [];
    //find and remove from existing FACES
    for(var j = 0; j < TO_REMOVE.length; j++) {
        for (var i = 0; i < ENTITIES.length; i++) {
            if(ENTITIES[i] != 0) {
                if (ENTITIES[i].id === (TO_REMOVE[j].id)) {
                    ENTITIES[i] = 0;
                }
            }
        }
        //find and remove from the toAdd buffer
        for (var i = 0; i < TO_ADD.length; i++) {
            if (TO_ADD[i].id === (TO_REMOVE[j].id)) {
                TO_ADD[i] = 0;
            }
        }
    }
    //reset the remove array
    TO_REMOVE = [];
    //index of face with removed faces
    var index = 0;
    //add all pre-existing faces into the out array
    for (var i = 0; i < ENTITIES.length; i++) {
        if (ENTITIES[i]!=0) {
            out[index] = ENTITIES[i];
            index++;
        }
    }
    //add all new faces to the array
    for(var i = 0; i < TO_ADD.length; i++){
        if(TO_ADD[i]!=0){
            out[out.length] = TO_ADD[i];
        }
    }
    //reset the add array
    TO_ADD = [];
    //set the ENTITIES array to the clean array
    ENTITIES = out;
}

var drawEntities = function(){
    for(var i = 0; i < ENTITIES.length; i++){
        for(var j = 0 ; j < ENTITIES[i].height; j++){
            for(var k = 0 ; k < ENTITIES[i].width; k++){
                if(isPointOnGrid(ENTITIES[i].origin[0] - (Math.ceil(ENTITIES[i].width / 2)) + k + 1, ENTITIES[i].origin[1] - (Math.ceil(ENTITIES[i].height / 2)) + j + 1)) {
                    PS.color(ENTITIES[i].origin[0] - (Math.ceil(ENTITIES[i].width / 2)) + k + 1, ENTITIES[i].origin[1] - (Math.ceil(ENTITIES[i].height / 2)) + j + 1, ENTITIES[i].colors[k + (j * ENTITIES[i].width)]);
                }
            }
        }
        if(ENTITIES[i].type=="reciever"){
            if(isPointOnGrid(ENTITIES[i].origin[0], ENTITIES[i].origin[1])) {
                PS.color(ENTITIES[i].origin[0], ENTITIES[i].origin[1], ENTITIES[i].properties.color);
            }
            if(!ENTITIES[i].properties.open){
                for(var j = 0; j < 3; j++){
                    if(isPointOnGrid(ENTITIES[i].origin[0]+j-1, ENTITIES[i].origin[1]-1)) {
                        PS.color(ENTITIES[i].origin[0]+j-1, ENTITIES[i].origin[1]-1, PS.COLOR_BLACK);
                    }
                }
            }
        }
        if(ENTITIES[i].type=="conveyor_belt"){
            for(var j = 0; j < ENTITIES[i].properties.width; j++){
                for(var k = 0; k < ENTITIES[i].properties.height; k++){
                    if(isPointOnGrid(ENTITIES[i].origin[0] + j, ENTITIES[i].origin[1] + k)) {
                        PS.color(ENTITIES[i].origin[0] + j, ENTITIES[i].origin[1] + k, PS.COLOR_BLACK);
                    }
                }
            }
        }
        if(ENTITIES[i].type=="crate"){
            if(isPointOnGrid(ENTITIES[i].origin[0], ENTITIES[i].origin[1])) {
                PS.color(ENTITIES[i].origin[0], ENTITIES[i].origin[1], ENTITIES[i].properties.color);
            }
        }

        if(ENTITIES[i].type=="son"){
            if(ENTITIES[i].properties.hasCrate != PS.COLOR_BLACK) {
                PS.color(ENTITIES[i].origin[0]+1, ENTITIES[i].origin[1], ENTITIES[i].properties.hasCrate);
            }
        }

        if(ENTITIES[i].type=="button"){
            //button size
            var offset = (ENTITIES[i].properties.press);
            PS.border(ENTITIES[i].origin[0], ENTITIES[i].origin[1],  { top : offset, left : 8, bottom : 0, right : 8});
            PS.borderColor(ENTITIES[i].origin[0], ENTITIES[i].origin[1],  COLOR_FLOOR);
            //highlight when controlling the father
            if(CONTROLLING_FATHER == true) {
                if (LAST_X == ENTITIES[i].origin[0]) {
                    if (LAST_Y == ENTITIES[i].origin[1]) {
                        var color_buffer = [];
                        var render_buffer = [];
                        for(var j = 0; j < grid.width * grid.height; j++){
                            render_buffer[j] = PS.COLOR_BLACK;
                        }
                        for (var j = 0; j < ENTITIES[i].properties.toggles.length; j++) {
                            var entity = getEntity(ENTITIES[i].properties.toggles[j]);
                            for (var k = 0; k < 3; k++) {
                                if (isPointOnGrid(entity.origin[0] + k - 1, entity.origin[1] - 1)) {
                                    color_buffer[color_buffer.length] = [entity.origin[0] + k - 1, entity.origin[1] - 1];
                                }
                            }
                        }
                        for (var j = 0; j < color_buffer.length; j++) {
                            if(isPointOnGrid(color_buffer[j][0], color_buffer[j][1])) {
                                if(render_buffer[color_buffer[j][0]+(color_buffer[j][1]*grid.width)] == PS.COLOR_GREEN){
                                    render_buffer[color_buffer[j][0]+(color_buffer[j][1]*grid.width)] =  PS.COLOR_BLACK;
                                }else{
                                    render_buffer[color_buffer[j][0]+(color_buffer[j][1]*grid.width)] =  PS.COLOR_GREEN;
                                }
                            }
                        }
                        var index = 0;
                        for (var j = 0; j < grid.height; j++) {
                            for (var k = 0; k < grid.width; k++) {
                                if(render_buffer[k+(j * grid.width)] != PS.COLOR_BLACK){
                                    PS.borderColor(k,j,crossFadeColors(render_buffer[k+(j * grid.width)], PS.COLOR_WHITE, ((getSIN()+1)/2)));
                                    if(index==0) {
                                        PS.border(k, j, {top: 1, bottom: 1, left: 1, right: 0});
                                    }else{
                                        if(k+1 < grid.width){
                                            if(render_buffer[k+1+(j * grid.width)] !=PS.COLOR_BLACK){
                                                PS.border(k, j, {top: 1, bottom: 1, left: 0, right: 0});
                                            }else{
                                                PS.border(k, j, {top: 1, bottom: 1, left: 0, right: 1});
                                                index = -1;
                                            }
                                        }else{
                                            PS.border(k, j, {top: 1, bottom: 1, left: 0, right: 1});
                                            index = -1;
                                        }
                                    }
                                    index++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

var pushImage = function(image){
    for(var j = 0; j < grid.height; j++){
        for(var i = 0; i < grid.width; i++){
            grid.data[i+(j*grid.width)] = (image.data[((i+(j*grid.width))*3)+0]*65536)+(image.data[((i+(j*grid.width))*3)+1]*256)+(image.data[((i+(j*grid.width))*3)+2]);
        }
    }
}

var addSprite = function(image){
    SPRITES[SPRITES.length] = image;
}

//fade between the two colors by percent p 0=full color1, 1=full color2
var crossFadeColors = function(color1, color2, percent){
    var rgb1=[];
    var rgb2=[];
    rgb1 = PS.unmakeRGB (color1, rgb1);
    rgb2 = PS.unmakeRGB (color2, rgb2);
    var r = (rgb2[0]*percent)+(rgb1[0]*(1.0-percent));
    var g = (rgb2[1]*percent)+(rgb1[1]*(1.0-percent));
    var b = (rgb2[2]*percent)+(rgb1[2]*(1.0-percent));
    return ((parseInt(r)*65536)+(parseInt(g)*256)+(parseInt(b)*1));
}

var isPointOnGrid = function(x,y){
    return ((x>=0&&x<grid.width)&&(y>=0&&y<grid.height));
}

var isPointInRect = function(x,y,r_x,r_y,r_width,r_height){
    return ((x-r_x>=0&&x-r_x<r_width)&&(y-r_y>=0&&y-r_y<r_height));
}

var generateLevel = function(difficulty){
    CRATE_BUFFER = [];
    var buttons = [];
    INITIAL_TOGGLES = [];
    var reciever_IDs = [];
    INITIAL_BUTTONS= [];
    INITIAL_BUTTONS_INDEX = 0;
    INITIALIZING = true;
    HEALTH = 3;
    CONTROLLING_FATHER = true;
    CONTROLLING_SON = false;

    //find all buttons and find the initial toggles also kill any crates
    for(var i = 0; i < ENTITIES.length; i++) {
        if (ENTITIES[i].type == "button") {
            buttons[buttons.length] = ENTITIES[i];
        }

        if (ENTITIES[i].type == "reciever") {
            if(PS.random(2) == 1){
                ENTITIES[i].properties.open = true;
            }else{
                ENTITIES[i].properties.open = false;
            }
            TUTORIAL_RECEPTACLES[INITIAL_TOGGLES.length].open = ENTITIES[i].properties.open;
            INITIAL_TOGGLES[INITIAL_TOGGLES.length] = ENTITIES[i].properties.open;
            reciever_IDs[reciever_IDs.length] = ENTITIES[i].id;
        }

        if (ENTITIES[i].type == "crate") {
            removeEntity(ENTITIES[i].id);
        }
    }
    updateEntities();

    // // //map all buttons to a random selection of recievers
    for(var i = 0; i < ENTITIES.length; i++) {
        if (ENTITIES[i].type == "button") {
            ENTITIES[i].properties.toggles = [];
            var length = 7;
            if(length == 0){
                length = 1;
            }
            for(var j = 0; j < length; j++){
                ENTITIES[i].properties.toggles[j] = reciever_IDs[PS.random(reciever_IDs.length)-1];
            }
        }
    }

    //if there are no buttons return
    if(buttons.length<=0){
        return;
    }

    //generate the level
    for(var i = 0; i < difficulty; i++){
        var randomIndex = PS.random(buttons.length)-1;
        for(var j = 0; j < buttons[randomIndex].properties.toggles.length; j++){
            var entity = getEntity(buttons[randomIndex].properties.toggles[j]);
            entity.properties.open = !entity.properties.open;
        }
        if(addCrate()==false){
            generateLevel(DIFFICULTY);
            return;
        }
    }
    resetToggles();
    //after level is loaded play whistle
    PS.audioPlay(SOUND_WHISTLE_START, {path: "sound/"});
}

var generateTutorialLevel = function(difficulty){
    CRATE_BUFFER = [];
    var buttons = [];
    INITIAL_TOGGLES = [];
    HEALTH = 3;
    var reciever_IDs = [];
    INITIAL_BUTTONS= [];
    INITIAL_BUTTONS_INDEX = 0;
    INITIALIZING = true;
    HAND_HOLDING_INDEX = HAND_HOLDING_COUNTDOWN+(DIFFICULTY * 60);

    CONTROLLING_FATHER = true;
    CONTROLLING_SON = false;

    var level = TUTORIAl_LEVELS[difficulty];


    //initialize the receptacles based on the level
    for(var i = 0; i < level.recievers.length; i++){
        var entity = getEntity(level.recievers[i].id);
        entity.properties.open = level.recievers[i].open;
        TUTORIAL_RECEPTACLES[i].open = entity.properties.open;
        INITIAL_TOGGLES[INITIAL_TOGGLES.length] = TUTORIAL_RECEPTACLES[i].open;
    }

    updateEntities();

    //map the buttons based on the tutorial
    for(var i = 0; i < level.buttons.length; i++){
        var buttons = getEntity(level.buttons[i].id);
        buttons.properties.toggles = level.buttons[i].toggles;
    }

    //put crates in the crate buffer
    for(var k = 0; k < level.crates.length; k++){
        CRATE_BUFFER[CRATE_BUFFER.length] = [[0,1],"crate_"+Math.random(), "crate", "", {color:CRATE_COLORS[level.crates[k]],moving:false,lastMoving:false}];
    }
}

var resetToggles = function(){
    //reset the initial toggle
    var index = 0;
    for(var i = 0; i < ENTITIES.length; i++) {
        if (ENTITIES[i].type == "reciever") {
            ENTITIES[i].properties.open = INITIAL_TOGGLES[index];
            index++;
        }
    }
}

var addCrate = function(){
    if(getCrate(24, 8)==null){
        var colors = [];
        for(var j = 0; j < ENTITIES.length; j++) {
            if (ENTITIES[j].type == "reciever") {
                if(ENTITIES[j].properties.open){
                    colors[colors.length] = ENTITIES[j].properties.color;
                }
            }
        }

        if(colors.length == 0){
            return false;
        }

        CRATE_BUFFER[CRATE_BUFFER.length] = [[0,1],"crate_"+Math.random(), "crate", ""    , {color:colors[PS.random(colors.length)-1],moving:false,lastMoving:false}];
        return true;
    }
}

var pickupCrate = function(){
    var button = getEntity(INITIAL_BUTTONS[INITIAL_BUTTONS_INDEX]);
    if(button!=null) {
        getEntity("father").properties.path = PS.line(getEntity("father").origin[0], getEntity("father").origin[1], button.origin[0], button.origin[1]-2);
        getEntity("father").properties.index = 0;
        getEntity("father").properties.movingToButton = true;
    }

}

var popCrateBuffer = function(){
    var out = CRATE_BUFFER[0];

    var buffer = [];
    for(var i = 1; i < CRATE_BUFFER.length; i++){
        buffer[i-1] = CRATE_BUFFER[i];
    }

    CRATE_BUFFER = buffer;

    return out;
}

var getCrate = function(x, y){
    for(var j = 0; j < ENTITIES.length; j++) {
        if (ENTITIES[j].type == "crate") {
            if(ENTITIES[j].origin[0] == x && ENTITIES[j].origin[1] == y){
                return ENTITIES[j];
            }
        }
    }
    return null;
}

var getNumCrates = function(){
    var count = 0;
    for(var j = 0; j < ENTITIES.length; j++) {
        if (ENTITIES[j].type == "crate") {
            count++;
        }
    }
    return count;
}

var pressButton = function(id){
    var button = getEntity(id);
    if(button != undefined) {
        for (var j = 0; j < button.properties.toggles.length; j++) {
            getEntity(button.properties.toggles[j]).properties.open = !getEntity(button.properties.toggles[j]).properties.open;
        }
    }
}

var colorToText = function(color){
    if(color == 10602810){
        return "green";
    }
    if(color == 8869774){
        return "purple";
    }
    if(color == 15723330){
        return "yellow";
    }
    if(color == 6985914){
        return "blue";
    }
    if(color == 16021547){
        return "orange";
    }
}

//get the sin of the variable SIN_COLOR_INDEX
var getSIN = function(){
    //convert to radians
    return Math.sin(SIN_COLOR_INDEX/180);
}