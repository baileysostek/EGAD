// game.js for Perlenspiel 3.2
// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

//Pointers to Timers and Databases that need to be started/stopped or initialized/destroyed
var goalsID;
var placedID;
var tickID;
var renderID;
var exitID;
var fadeoutID;
var IS_FADE_IN = false;

//The size of the area effected per click
var TOGGLE_SIZE = 3;

//the background grid color
var COLOR_BG = 6143825;
//the data bead color
var COLOR_SELECTED = 2048027;
//the tutorial Highlight Color
var COLOR_TUTORIAL = PS.COLOR_WHITE;
//the tutorial Highlight Color
var COLOR_STATUS = PS.COLOR_WHITE;
//the border color for the grid tiles
var COLOR_BORDER = 4095798;
//the color of the web page
var COLOR_WEB_PAGE = 4095798;

//for nice fade color constantly updateing
var SIN_COLOR_INDEX = 0;
//speed at wich the sin flashes
var SIN_SPEED = 8;


//amount of time in 60ths of a second it takes to fade
var fadeTime = 30;
//amount of steps to take
var COLOR_STEP_PERCENT = (255/fadeTime)/255;

//the index of ticks to skip the tutorial
var TUTORIAL_SKIP_PERCENT = 0;

//Only send the data the first time the player looses
var SENT_DATA = false;

//if it is still the tutorial
var IS_TUTORIAL = true;
var TUTORIAL_INDEX = 0;
//The tutorial levels
var TUTORIAL_LEVELS = [
	//1
	[
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0
	],
	//2
	[
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,1,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0
	],//3
	[
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0
	],//4
	[
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,1,0,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,1,0,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0
	],//5
	[
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,1,0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,1,0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0
	],//6
	[
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,1,0,0,0,0,0,0,0,0,0,0,
		0,0,1,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0
	]


];


//amount to offset the placed database by
var PLACED_OFFSET = 0;

//How hard the level should be
var DIFFICULTY = 1;

//how many clicks it took the user to complete the level
var CLICKS = 0;


//The timer for how long you have to solve each level
var TIMER_CURRENT = 0;

//The base number of moves a player has for this level
var MOVES_LEFT = 0;
//exact percent is 26.5023894731362
var PERCENT = 1.265;

//Data for fadeOut stuff
//amount of time in 60ths of a second it takes to fade
var FINAL_FADE_PERCENT = 0;
var COLOR_STEP_PERCENT = (255/fadeTime)/255;
var FINAL_FADE_IN = true;


//if the game is over, stop some of the update functions
var OVER = false;

//if final fade = true
var FINAL_FADE = false;

//If the mouse is pressed
var PRESSED=false;

//SOUND
//sound for click
var SOUND_PING = "ping";
//src:https://www.freesound.org/people/AndreAngelo/sounds/246201/
var SOUND_DOUBLE_PING = "double_ping";
//src:https://www.freesound.org/people/AndreAngelo/sounds/246201/
var SOUND_BG_MUSIC = "bg_loop";
//src:https://www.freesound.org/people/PhonZz/sounds/263467/

//The grid variable representing the size of the PS grid
//The data field is auto-initialized on INIT
var grid = {
	width : 13, height : 13,
	//this stores if the data is fadeing in or out
	data : []
};

var LAST_X = 0;
var LAST_Y = 0;
var MAX_DISTANCE =0;

// PS.init( system, options )
// Initializes the game
PS.init = function( system, options ) {
	"use strict";
	init();
};


var init = function(){
	// Preload & lock sounds
	PS.audioLoad( SOUND_PING, { lock : true, path:"sound/"} );
	PS.audioLoad( SOUND_DOUBLE_PING, { lock : true, path:"sound/"} );
	PS.audioLoad( SOUND_BG_MUSIC, { lock : true, path:"sound/"} );

	// PS.debug("Init\n");
	goalsID = PS.dbInit("goals", { discard : true });
	placedID = PS.dbInit("placed", { discard : true });
	tickID = PS.timerStart(1, tick);
	renderID = PS.timerStart(1, render);

	//set the game up
	PS.gridSize( grid.width, grid.height );
	PS.gridColor(COLOR_WEB_PAGE); // grid background color
	PS.border( PS.ALL, PS.ALL, 0 ); // no bead borders

	//Initalize grid
	for(var j = 0; j < grid.height; j++){
		for(var i = 0; i < grid.width; i++){
			PS.data(i,j,0.0);
			grid.data[i+(j * grid.width)] = true;
			PS.border ( i, j, 1 );
		}
	}

	MAX_DISTANCE = distance(0,0,grid.width,grid.height);

	//set status line stuff
	PS.statusText("Click & hold to skip tutorial");
	PS.statusColor(COLOR_STATUS);

	//COMMENT THIS BACK IN
	PS.audioPlay( SOUND_BG_MUSIC, { lock : true, path:"sound/", loop:true});
}

var tick = function(){
	//add 1 to the sin index for nice fades
	SIN_COLOR_INDEX+=SIN_SPEED;
	//so the var dosent get too big
	SIN_COLOR_INDEX%=720;

	//Manage smooth transitions between fadeing in and out
	for(var j = 0; j < grid.height; j++){
		for(var i = 0; i < grid.width; i++){
			//if its not fading in, fade out
			if(grid.data[i+(j * grid.width)] == false){
				//Fade in
				if (PS.data(i, j) > 0 && PS.data(i, j) < 1) {
					PS.data(i, j, PS.data(i, j) + COLOR_STEP_PERCENT);
					if (PS.data(i, j) > 1) {
						PS.data(i, j, 1);
					}
				}
			}else{
				//fade Out
				if (PS.data(i, j) > 0) {
					PS.data(i, j, PS.data(i, j) - COLOR_STEP_PERCENT);
					if (PS.data(i, j) < 0) {
						PS.data(i, j, 0.0);
					}
				}
			}
		}
	}

	if(!OVER) {
		//if this is the tutorial, flash the next valid space
		if (IS_TUTORIAL) {
			//the fade index for the skip tutorial option
			if(TUTORIAL_INDEX == 1) {
				if (PRESSED) {
					if(TUTORIAL_SKIP_PERCENT>=1){
						buildTutorialLevel(0);
						IS_TUTORIAL = false;
						DIFFICULTY = 1;
						buildLevel(DIFFICULTY);
					}
					TUTORIAL_SKIP_PERCENT+=COLOR_STEP_PERCENT/4;
				}
			}
			var events = PS.dbData("placed")['events'];
			//check if the index is less than zero, if so then increase the difficulty
			if ((events.length - 1 - PLACED_OFFSET) < 0) {
				if (checkWin()) {
					if (TUTORIAL_INDEX >= TUTORIAL_LEVELS.length) {
						IS_TUTORIAL = false;
						DIFFICULTY = 1;
						buildLevel(DIFFICULTY);
					} else {
						buildTutorialLevel(TUTORIAL_INDEX);
						TUTORIAL_INDEX++;
					}
				}
			}
		} else {
			//Game Level logic
			if(TUTORIAL_SKIP_PERCENT>0){
				TUTORIAL_SKIP_PERCENT-=COLOR_STEP_PERCENT/4;
				if(TUTORIAL_SKIP_PERCENT<=0){
					TUTORIAL_SKIP_PERCENT=0;
				}
			}
			//this comes first, in the case of a tie with the clock, the tie goes to the player
			//check to see if the player won
			if (checkWin()) {
				//push to the DB
				if(!SENT_DATA) {
					PS.dbEvent("goals", "time_taken", (parseInt(TIMER_CURRENT / 60)), "difficulty", DIFFICULTY, "clicks", CLICKS);
				}
				DIFFICULTY++;
				buildLevel(DIFFICULTY);
				TIMER_CURRENT = 0;
				CLICKS = 0;
			}

			//check to see if the player ran out of moves
			if (MOVES_LEFT <= 0) {
				//trigger loss send DB to bhsostek
				if(!SENT_DATA) {
					PS.dbEvent("goals", "time_taken", (parseInt(TIMER_CURRENT / 60)), "difficulty", DIFFICULTY, "clicks", CLICKS);
					//COMMENT THIS BACK IN
					PS.dbSend("goals", "bhsostek");
					PS.dbErase(goalsID);
					SENT_DATA = true;
				}
				PLACED_OFFSET = 0;
				exitID = PS.timerStart(Math.min(fadeTime, 60), exit);
				// PS.debug("Sent Exit command.\n");
				PS.statusText("");
				OVER = true;
			}
			PS.statusText("Moves:"+MOVES_LEFT);
			TIMER_CURRENT++;

		}
	}else{
		if(checkWin()){
			if(!FINAL_FADE) {
				PS.timerStop(renderID);
				FINAL_FADE_PERCENT = -1;
				fadeoutID = PS.timerStart(1, fadeOut);
				FINAL_FADE = true;
			}
		}
	}
}

var render = function(){
	//render the grid as a fade between the background color and the designated fade-to color
	for(var j = 0; j < grid.height; j++){
		for(var i = 0; i < grid.width; i++){
			PS.color(i,j,crossFadeColors(COLOR_BG, COLOR_SELECTED, PS.data(i,j)));
			if(grid.data[i+(j * grid.width)] == false){
				//Fade in
				PS.borderColor (i,j,crossFadeColors(COLOR_BORDER, COLOR_BG, PS.data(i,j)));
			}else{
				//fade Out
				PS.borderColor (i,j,crossFadeColors(COLOR_BG, COLOR_BORDER, PS.data(i,j)));
			}
		}
	}
	//control the shadow
	if(TUTORIAL_SKIP_PERCENT>0.5){
		PS.gridShadow(true,crossFadeColors(COLOR_SELECTED, COLOR_BG, TUTORIAL_SKIP_PERCENT));
	}else{
		PS.gridShadow(false);
	}

	//if is the tutorial render when the next click should be
	if(IS_TUTORIAL){
		var events = PS.dbData("placed")['events'];
		//check if the index is larger than zero
		if((events.length - 1 - PLACED_OFFSET) >= 0) {
			var event = events[events.length - 1 - PLACED_OFFSET];
			var tmp_x = event['x'];
			var tmp_y = event['y'];
			PS.color(tmp_x, tmp_y, crossFadeColors(PS.color(tmp_x, tmp_y), COLOR_TUTORIAL, ((getSIN() + 1) / 2)));
		}
	}
	PS.statusColor(crossFadeColors(COLOR_TUTORIAL, COLOR_BG, TUTORIAL_SKIP_PERCENT));
}

var insideGrid = function(x,y){
	if(x >= 0 && x < grid.width){
		if(y >= 0 && y < grid.height){
			return true;
		}
	}
	return false;
}

var toggle = function(x, y){
	//for the tiles around the touched point with a square the size of TOGGLE SIZE, toggle the grid
	var toggledTiles = 0;

	for(var j = 0; j < TOGGLE_SIZE; j++){
		for(var i = 0; i < TOGGLE_SIZE; i++){
			if(insideGrid(x-((TOGGLE_SIZE-1)/2)+i,y-((TOGGLE_SIZE-1)/2)+j)){
				loop:{
					//if the grid is fading in / fully faded in, start to fade out
					if (grid.data[(x-((TOGGLE_SIZE-1)/2) + i)+((y - ((TOGGLE_SIZE-1)/2) + j) * grid.width)] == false) {
						//the data value was one so decrease it by color step percent
						PS.data((x-((TOGGLE_SIZE-1)/2) + i),(y - ((TOGGLE_SIZE-1)/2) + j), PS.data((x-((TOGGLE_SIZE-1)/2) + i),(y - ((TOGGLE_SIZE-1)/2) + j))-COLOR_STEP_PERCENT);
						if(PS.data((x-((TOGGLE_SIZE-1)/2) + i),(y - ((TOGGLE_SIZE-1)/2) + j))<0){
							PS.data((x-((TOGGLE_SIZE-1)/2) + i),(y - ((TOGGLE_SIZE-1)/2) + j), 0);
						}
						grid.data[(x-((TOGGLE_SIZE-1)/2) + i)+((y - ((TOGGLE_SIZE-1)/2) + j) * grid.width)] = true;
						toggledTiles++;
						break loop;
					}
					//if the grid is fading out / fully faded out, start to fade in
					if (grid.data[(x-((TOGGLE_SIZE-1)/2) + i)+((y - ((TOGGLE_SIZE-1)/2) + j) * grid.width)] == true) {
						//the data value was zero so switch it to color step percent
						PS.data((x-((TOGGLE_SIZE-1)/2) + i),(y - ((TOGGLE_SIZE-1)/2) + j), COLOR_STEP_PERCENT);
						if(PS.data((x-((TOGGLE_SIZE-1)/2) + i),(y - ((TOGGLE_SIZE-1)/2) + j))>1){
							PS.data((x-((TOGGLE_SIZE-1)/2) + i),(y - ((TOGGLE_SIZE-1)/2) + j), 1);
						}
						grid.data[(x-((TOGGLE_SIZE-1)/2) + i)+((y - ((TOGGLE_SIZE-1)/2) + j) * grid.width)] = false;
						break loop;
					}
				}
			}
		}
	}
	return toggledTiles;
}

//check level win state by itterating through the data and seeing if all tiles are faded out
var checkWin = function(){
	for(var j = 0; j < grid.height; j++){
		for(var i = 0; i < grid.width; i++){
			if(grid.data[i+(j * grid.width)] == false){
				return false;
			}
		}
	}
	return true;
}


//build a level with a difficulty of DIFFICULTY
var buildLevel = function(DIFFICULTY){
	//clear the placed DB then reinitialize it
	PS.dbErase(placedID);
	this.placedID = PS.dbInit("placed", { discard : true });
	PLACED_OFFSET = 0;
	MOVES_LEFT = parseInt(DIFFICULTY*PERCENT);
	//generate a valid level, then the placed DB will be populated correctly
	//if the DIFFICULTY == 0 break to avoid cycling
	if(DIFFICULTY == 0){
		return;
	}
	//Toggle random tiles, and log the location
	for(var i = 0; i < DIFFICULTY; i++){
		var tmp_x = PS.random(grid.width)-1;
		var tmp_y = PS.random(grid.height)-1;
		toggle(tmp_x, tmp_y);
		//send data to placed database
		PS.dbEvent( "placed", "x", tmp_x, "y", tmp_y);
	}
	if(checkWin()){
		buildLevel(DIFFICULTY);
	}
}

//build the tutorial level at INDEX
var buildTutorialLevel = function(INDEX){
	//clear the placed DB then reinitialize it
	PS.dbErase(placedID);
	this.placedID = PS.dbInit("placed", { discard : true });
	PLACED_OFFSET = 0;
	//Toggle the tiles with a value of 1 in the level index
	for(var j = 0; j < grid.height; j++) {
		for (var i = 0; i < grid.width; i++) {
			if((TUTORIAL_LEVELS[INDEX])[i+(j*grid.width)]>0) {
				toggle(i, j);
				//send data to placed database
				PS.dbEvent("placed", "x", i, "y", j);
			}
		}
	}
}

//solve the level for the player
var exit = function(){
	var events = PS.dbData("placed")['events'];
    PS.statusText(""+(events.length - 1 - PLACED_OFFSET)+">= 0:"+((events.length - 1 - PLACED_OFFSET) >= 0));
	//check if the index is larger than zero
	// PS.debug("Exit - tick\n");
	if((events.length - 1 - PLACED_OFFSET) >= 0) {
		var event = events[events.length - 1 - PLACED_OFFSET];
		var tmp_x = event['x'];
		var tmp_y = event['y'];
		toggle(tmp_x,tmp_y);
	}else{
		PS.timerStop(exitID);
		// PS.debug("Exit stopped.\n");
	}
	PLACED_OFFSET++;
}

var fadeOut = function() {
	if (!IS_FADE_IN) {
		//Fade Out
		if (FINAL_FADE_IN == true) {
			FINAL_FADE_IN = false;
			for (var j = 0; j < grid.height; j++) {
				for (var i = 0; i < grid.width; i++) {
					PS.color(i, j, crossFadeColors(crossFadeColors(COLOR_BG, COLOR_SELECTED, PS.data(i, j)), COLOR_WEB_PAGE, Math.min(Math.max((FINAL_FADE_PERCENT+(distance(i,j,LAST_X,LAST_Y)/MAX_DISTANCE)), 0),1)));
					if((Math.min((FINAL_FADE_PERCENT+(distance(i,j,LAST_X,LAST_Y)/MAX_DISTANCE)), 1)) < 1){
						FINAL_FADE_IN = true;
					}
					PS.borderColor(i, j, PS.color(i, j));
				}
			}
			FINAL_FADE_PERCENT += COLOR_STEP_PERCENT/8;
		}else {
			FINAL_FADE_IN = true;
			IS_FADE_IN = true;
		}
	}else{
		//Fade in
		if (FINAL_FADE_IN == true) {
			FINAL_FADE_IN = false;
			for (var j = 0; j < grid.height; j++) {
				for (var i = 0; i < grid.width; i++) {
					PS.color(i, j, crossFadeColors(crossFadeColors(COLOR_BG, COLOR_SELECTED, PS.data(i, j)), COLOR_WEB_PAGE, Math.max(Math.min((FINAL_FADE_PERCENT ), 1),0)));
					if((Math.min((FINAL_FADE_PERCENT+(distance(i,j,LAST_X,LAST_Y)/MAX_DISTANCE)), 1)) > 0){
						FINAL_FADE_IN = true;
					}
					PS.borderColor(i, j, PS.color(i, j));
				}
			}
			FINAL_FADE_PERCENT -= COLOR_STEP_PERCENT/4;
		} else {
			IS_FADE_IN = false;
			PS.timerStop(fadeoutID);
			renderID = PS.timerStart(1, render);
			resetGameWithSameDifficulty();
		}
	}
}

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
PS.touch = function( x, y, data, options ) {
	if(!OVER) {
		PRESSED = true;
		LAST_X = x;
		LAST_Y = y;
		if (IS_TUTORIAL) {
			if(TUTORIAL_INDEX==1) {

			}else {
				var events = PS.dbData("placed")['events'];
				if ((events.length - 1 - PLACED_OFFSET) >= 0) {
					var event = events[events.length - 1 - PLACED_OFFSET];
					var tmp_x = event['x'];
					var tmp_y = event['y'];
					if (tmp_x == x && tmp_y == y) {
						var toggle_num = toggle(x, y);
						if (toggle_num > 0 && toggle_num < 9) {
							PS.audioPlay(SOUND_PING, {path: "sound/"});
						} else {
							PS.audioPlay(SOUND_DOUBLE_PING, {path: "sound/"});
						}
						PLACED_OFFSET++;
					}
				}
			}
		} else {
			var toggle_num = toggle(x, y);
			MOVES_LEFT--;
			if (toggle_num > 0 && toggle_num < 9) {
				PS.audioPlay(SOUND_PING, {path: "sound/"});
			} else {
				PS.audioPlay(SOUND_DOUBLE_PING, {path: "sound/"});
			}
			PS.dbEvent("placed", "x", x, "y", y);
			CLICKS++;
		}
	}
	"use strict";
};

// All event functions must be present to prevent startup errors,
// even if they don't do anything

PS.release = function( x, y, data, options ) {
	PRESSED = false;
	if (TUTORIAL_INDEX == 1) {
		if (!OVER) {
			if (IS_TUTORIAL) {
				PS.statusText("");
				var events = PS.dbData("placed")['events'];
				if ((events.length - 1 - PLACED_OFFSET) >= 0) {
					var event = events[events.length - 1 - PLACED_OFFSET];
					var tmp_x = event['x'];
					var tmp_y = event['y'];
					if (tmp_x == x && tmp_y == y) {
						var toggle_num = toggle(x, y);
						if (toggle_num > 0 && toggle_num < 9) {
							PS.audioPlay(SOUND_PING, {path: "sound/"});
						} else {
							PS.audioPlay(SOUND_DOUBLE_PING, {path: "sound/"});
						}
						PLACED_OFFSET++;
					}
				}
			}
		}
	}
	"use strict";
};

var resetGameWithSameDifficulty = function(){
	//if the game is over, stop some of the update functions
	OVER = false;
    IS_FADE_IN = false;
	FINAL_FADE = false;
    FINAL_FADE_IN = true;
	FINAL_FADE_PERCENT = 0;
	PLACED_OFFSET = 0;
	buildLevel(DIFFICULTY);
}

PS.enter = function( x, y, data, options ) {
	"use strict";
};

PS.exit = function( x, y, data, options ) {
	"use strict";
};

PS.exitGrid = function( options ) {
	"use strict";
};

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";
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

var distance = function(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
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

//get the sin of the variable SIN_COLOR_INDEX
var getSIN = function(){
	//convert to radians
	return Math.sin(SIN_COLOR_INDEX/180);
}

