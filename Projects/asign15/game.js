// game.js for Perlenspiel 3.1

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-14 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

var startColor = 0x0DC8FF;
var bgColor = startColor;
var webPageColor = startColor;
//
var bgMusic;
//the background light color, Black for a shadow effect.
var lightColor = bgColor;
//the size of the grid
var gridSize = 32;
//the color data for the game layer
var beadData = [];
//the color data from the light layer
var lightData = [];
//the alpha data for the light layer
var alphaData = [];
//all of the objects in a scene
var objects = [];
//the color of the mirror
var mirrorColor = 13167615;
//the color of walls
var wallColor = 8275847;

var countDown = 40 * 30;
var initialTimeConstant = 6;
var levelTimout = 0;
var endColor = 0;
var numLines = 0;
var canInteract = false;

//Camera Transition Stuff
var bgBeads = null;
var camTimout = 0;
var camDir = 0;

//the x position of the mouse
var mouseX = 0;
//the y positon of the mouse
var mouseY = 0;
//the index of the level you are on.
var c = 0;
var level_1 =[
	["addEmitter", 2, 2, 16711680, 1],
	["addReceptacle", 30, 27, 16711680, 2],
	["addMirror", 2, 27, 2],
	["setText", "I have to guide the last of my light"],
	["setText", "to the crystal before it’s too late…"],
	["setText", "These mirrors look light,"],
	["setText", "I bet even a mouse could turn them."],
];


var level_2 = [
	["addEmitter", 2, 27, 16711680, 4],
	["addReceptacle", 30, 27, 16711680, 2],
	["addMirror", 16, 27, 1],
	["addMirror", 25, 27, 1],
	["addMirror", 16, 4, 1],
	["addMirror", 25, 4, 2],
	["setText", "I need to properly position these mirrors"],
	["setText", "before my light dies out."],
];

var level_3 = [
	["addEmitter", 2, 27, 16711680, 4],
	["addReceptacle", 26, 30, 16711680, 1],
	["addMirror", 10, 27, 1],
	["addMirror", 10, 17, 1],
	["addMirror", 3, 17, 1],
	["addMirror", 3, 7, 1],
	["addMirror", 10, 7, 1],
	["addMirror", 17, 7, 1],
	["addMirror", 26, 7, 1],
	["addMirror", 26, 17, 1],
	["addMirror", 17, 27, 1],
	["addMirror", 26, 27, 1],
	["setText", "I’m glad these amplifiers are able"],
	["setText", "to keep my light going..."],
];

var level_4 = [
	["addEmitter", 26, 2, 3242493, 1],
	["addReceptacle", 1, 27, 3242493, 2],
	["addMirror", 26, 9, 1],
	["addMirror", 20, 9, 1],
	["addMirror", 20, 4, 2],
	["addMirror", 10, 4, 1],
	["addMirror", 10, 9, 1],
	["addMirror", 10, 20, 1],
	["addMirror", 10, 27, 1],
	["addMirror", 20, 20, 1],
	["addMirror", 20, 27, 1],
	["addMirror", 26, 27, 1],
	["addMirror", 26, 20, 1],
	["setText", "I wonder if there’s a quicker way"],
	["setText", "to get to the end…"],
];

var level_5 = [
	["addEmitter", 32, 27, 16711680, 2],
	["addReceptacle", 1, 4, 16711680, 2],
	["addMirror", 24, 27, 2],
	["addMirror", 24, 20, 2],
	["addMirror", 24, 13, 2],
	["addMirror", 24, 4, 2],
	["addMirror", 17, 27, 2],
	["addMirror", 17, 20, 2],
	["addMirror", 17, 13, 2],
	["addMirror", 17, 4, 2],
	["addMirror", 9, 27, 2],
	["addMirror", 9, 13, 2],
	["addMirror", 9, 4, 2],
	["addWall", 14, 24, 5, 1],
	["setText", "It’s getting darker now that I’m further in,"],
	["setText", "I’m going to need to be careful…"],
];


var level_6 = [
	["addEmitter", 28, 18, 6347397, 2],
	["addReceptacle", 30, 24, 6347397, 2],
	["addMirror", 16, 24, 1],
	["addMirror", 16, 18, 3],
	["addMirror", 16, 12, 2],
	["addMirror", 16, 2, 2],
	["addMirror", 2, 12, 4],
	["addMirror", 24, 12, 2],
	["addMirror", 2, 24, 1],
	["addMirror", 8, 18, 4],
	["addMirror", 8, 16, 2],
	["addMirror", 20, 16, 3],
	["addMirror", 20, 24, 4],
	["addWall", 18, 22, 1, 5],
	["setText", "It’s so dark in here,"],
	["setText", "I hope my light can show me there way…"],
];

var level_7 = [
	["addEmitter", 2, 25, 6347397, 4],
	["addReceptacle", 30, 26, 6347397, 2],
	["addMirror", 8, 25, 1],
	["addMirror", 8, 20, 3],
	["addMirror", 8, 15, 2],
	["addMirror", 8, 8, 2],
	["addMirror", 15, 25, 4],
	["addMirror", 15, 15, 2],
	["addMirror", 15, 8, 1],
	["addMirror", 20, 8, 4],
	["addMirror", 20, 20, 2],
	["addMirror", 25, 8, 3],
	["addMirror", 25, 15, 4],
	["addMirror", 25, 26, 4],
	["setText", "Is this darkness what the world"],
	["setText", "is destined to become if I’m to fail?"],
];

var level_8 = [
	["addEmitter", 2, 26, 6347397, 4],
	["addReceptacle", 26, 30, 6347397, 1],
	["addMirror", 7, 26, 1],
	["addMirror", 7, 18, 3],
	["addMirror", 7, 13, 2],
	["addMirror", 7, 9, 2],
	["addMirror", 14, 9, 4],
	["addMirror", 14, 13, 2],
	["addMirror", 14, 18, 1],
	["addMirror", 20, 13, 4],
	["addMirror", 20, 26, 2],
	["addMirror", 26, 13, 3],
	["addMirror", 26, 18, 4],
	["addMirror", 26, 26, 4],
	["setText", "Ouch! I think I stubbed my toe"],
	["setText", "on that last mirror…"],
];

var level_9 = [
	["addEmitter", 26, 2, 6347397, 1],
	["addReceptacle", 26, 30, 6347397, 1],
	["addMirror", 4, 27, 1],
	["addMirror", 4, 6, 3],
	["addMirror", 9, 9, 2],
	["addMirror", 9, 21, 2],
	["addMirror", 13, 6, 4],
	["addMirror", 13, 16, 2],
	["addMirror", 19, 16, 1],
	["addMirror", 19, 21, 4],
	["addMirror", 23, 9, 2],
	["addMirror", 23, 16, 3],
	["addMirror", 26, 21, 4],
	["addMirror", 26, 27, 4],
	["setText", "This calamity is our own doing,"],
	["setText", "we should have been more careful…"],
];

var level_10 = [
	["addEmitter", 26, 2, 6347397, 1],
	["addReceptacle", 30, 28, 6347397, 2],
	["addMirror", 4, 6, 1],
	["addMirror", 4, 28, 3],
	["addMirror", 8, 13, 2],
	["addMirror", 8, 22, 2],
	["addMirror", 8, 28, 4],
	["addMirror", 15, 28, 2],
	["addMirror", 21, 6, 1],
	["addMirror", 21, 22, 4],
	["addMirror", 21, 28, 2],
	["addMirror", 26, 6, 3],
	["addMirror", 31, 6, 4],
	["addMirror", 31, 13, 4],
	["setText", "If we hadn’t neglected our duties,"],
	["setText", "the world would still be bright"],
	["setText", "and full of life…"]
];

var level_11 = [
	["addEmitter", 2, 27, 6347397, 4],
	["addReceptacle", 27, 30, 6347397, 1],
	["addMirror", 7, 27, 1],
	["addMirror", 7, 23, 3],
	["addMirror", 7, 19, 2],
	["addMirror", 7, 13, 2],
	["addMirror", 7, 7, 4],
	["addMirror", 11, 7, 2],
	["addMirror", 11, 13, 1],
	["addMirror", 15, 7, 4],
	["addMirror", 20, 13, 2],
	["addMirror", 15, 27, 3],
	["addMirror", 27, 27, 4],
	["addMirror", 27, 23, 4],
	["addMirror", 27, 19, 4],
	["addMirror", 27, 13, 2],
	["addMirror", 27, 7, 3],
	["setText", "I wonder if any of the others"],
	["setText", "were able to make it this far before?"],
];

var level_12 = [
	["addEmitter", 27, 2, 6347397, 1],
	["addReceptacle", 30, 27, 6347397, 2],
	["addMirror", 7, 27, 1],
	["addMirror", 7, 23, 3],
	["addMirror", 7, 19, 2],
	["addMirror", 7, 13, 2],
	["addMirror", 7, 7, 4],
	["addMirror", 11, 7, 2],
	["addMirror", 15, 7, 4],
	["addMirror", 20, 13, 2],
	["addMirror", 15, 27, 3],
	["addMirror", 20, 27, 4],
	["addMirror", 27, 23, 4],
	["addMirror", 27, 19, 4],
	["addMirror", 27, 13, 2],
	["addMirror", 27, 7, 3],
	["setText", "I should’ve brought some snacks,"],
	["setText", "I didn’t think finding the crystal"],
	["setText", "would take this long…"],
];

var level_13 = [
	["addEmitter", 2, 27, 6347397, 4],
	["addReceptacle", 30, 27, 6347397, 2],
	["addMirror", 7, 27, 1],
	["addMirror", 7, 22, 3],
	["addMirror", 7, 7, 2],
	["addMirror", 12, 19, 2],
	["addMirror", 12, 7, 4],
	["addMirror", 17, 27, 2],
	["addMirror", 17, 19, 1],
	["addMirror", 21, 7, 4],
	["addMirror", 21, 15, 2],
	["addMirror", 27, 10, 3],
	["addMirror", 27, 15, 4],
	["addMirror", 27, 22, 4],
	["addMirror", 27, 30, 4],
	["addMirror", 31, 10, 2],
	["addMirror", 31, 15, 3],
	["setText", "I’m the only one left,"],
	["setText", "no one can do this but me…"],
];

var level_14 = [
	["addEmitter", 2, 27, 6347397, 4],
	["addReceptacle", 27, 30, 6347397, 1],
	["addMirror", 3, 6, 1],
	["addMirror", 3, 11, 3],
	["addMirror", 3, 22, 2],
	["addMirror", 9, 6, 2],
	["addMirror", 9, 17, 4],
	["addMirror", 9, 22, 2],
	["addMirror", 9, 27, 1],
	["addMirror", 17, 6, 4],
	["addMirror", 17, 17, 2],
	["addMirror", 17, 22, 3],
	["addMirror", 17, 27, 4],
	["addMirror", 22, 11, 4],
	["addMirror", 22, 17, 4],
	["addMirror", 22, 22, 2],
	["addMirror", 27, 6, 3],
	["setText", "I can’t let this darkness get to me,"],
	["setText", "I need to stay focused."],
];

var level_15 = [
	["addEmitter", 27, 2, 6347397, 1],
	["addReceptacle", 15, 31, 6347397, 1],
	["addMirror", 3, 8, 1],
	["addMirror", 3, 16, 3],
	["addMirror", 3, 28, 2],
	["addMirror", 8, 8, 2],
	["addMirror", 8, 16, 4],
	["addMirror", 8, 24, 2],
	["addMirror", 15, 28, 4],
	["addMirror", 15, 8, 2],
	["addMirror", 18, 16, 3],
	["addMirror", 18, 21, 4],
	["addMirror", 18, 8, 4],
	["addMirror", 22, 16, 4],
	["addMirror", 22, 21, 2],
	["addMirror", 22, 27, 3],
	["addMirror", 22, 8, 4],
	["addMirror", 27, 8, 4],
	["addMirror", 27, 16, 4],
	["addMirror", 27, 27, 2],
	["addMirror", 15, 24, 2],
	["setText", "That’s another room finished,"],
	["setText", "but am I even making progress?"],
];

var level_16 = [
	["addEmitter", 30, 25, 6347397, 2],
	["addReceptacle", 7, 30, 6347397, 1],
	["addMirror", 7, 4, 1],
	["addMirror", 10, 25, 2],
	["addMirror", 7, 14, 1],
	["addMirror", 7, 20, 2],
	["addMirror", 10, 14, 2],
	["addMirror", 10, 20, 4],
	["addMirror", 15, 7, 2],
	["addMirror", 15, 30, 4],
	["addMirror", 21, 14, 2],
	["addMirror", 21, 25, 2],
	["addMirror", 25, 4, 3],
	["addMirror", 25, 30, 4],
	["addMirror", 25, 7, 4],
	["addMirror", 25, 14, 4],
	["addMirror", 25, 25, 2],
	["setText", "I hope I’m not too late…"],
];

var level_17 = [
	["addEmitter", 7, 2, 6347397, 1],
	["addReceptacle", 25, 30, 6347397, 1],
	["addMirror", 2, 7, 1],
	["addMirror", 2, 15, 2],
	["addMirror", 2, 27, 1],
	["addMirror", 7, 7, 2],
	["addMirror", 7, 15, 2],
	["addMirror", 7, 24, 4],
	["addMirror", 7, 29, 2],
	["addMirror", 13, 15, 2],
	["addMirror", 13, 19, 2],
	["addMirror", 13, 29, 3],
	["addMirror", 19, 15, 4],
	["addMirror", 19, 19, 4],
	["addMirror", 19, 24, 4],
	["addMirror", 19, 27, 2],
	["addMirror", 25, 24, 4],
	["addMirror", 31, 24, 4],
	["addMirror", 31, 27, 2],
	["setText", "Yikes! Look at all those mirrors!"],
];

var level_18 = [
	["addEmitter", 25, 2, 6347397, 1],
	["addReceptacle", 1, 25, 6347397, 2],
	["addMirror", 5, 3, 1],
	["addMirror", 5, 10, 2],
	["addMirror", 15, 10, 2],
	["addMirror", 7, 25, 1],
	["addMirror", 7, 30, 2],
	["addMirror", 11, 3, 2],
	["addMirror", 11, 14, 4],
	["addMirror", 15, 17, 2],
	["addMirror", 15, 22, 4],
	["addMirror", 15, 30, 2],
	["addMirror", 18, 7, 2],
	["addMirror", 18, 14, 3],
	["addMirror", 23, 14, 4],
	["addMirror", 23, 17, 4],
	["addMirror", 23, 22, 4],
	["addMirror", 23, 30, 2],
	["addMirror", 25, 7, 4],
	["setText", "I’m almost to the crystal,"],
	["setText", "I just need to keep going into the light!"]
];

var level_19 = [
	["addEmitter", 30, 25, 6347397, 2],
	["addReceptacle", 25, 30, 6347397, 1],
	["addMirror", 5, 7, 1],
	["addMirror", 5, 11, 2],
	["addMirror", 5, 19, 1],
	["addMirror", 5, 30, 2],
	["addMirror", 10, 11, 4],
	["addMirror", 10, 19, 4],
	["addMirror", 10, 25, 2],
	["addMirror", 10, 30, 4],
	["addMirror", 15, 7, 2],
	["addMirror", 15, 30, 3],
	["addMirror", 19, 11, 4],
	["addMirror", 19, 19, 4],
	["addMirror", 19, 30, 4],
	["addMirror", 25, 7, 2],
	["setText", "Gah! I stubbed my toe even in the light!"],
];

var level_20 = [
	["addEmitter", 27, 2, 6347397, 1],
	["addReceptacle", 15, 31, 6347397, 1],
	["addMirror", 3, 8, 1],
	["addMirror", 3, 16, 3],
	["addMirror", 3, 28, 2],
	["addMirror", 8, 8, 2],
	["addMirror", 8, 16, 4],
	["addMirror", 8, 24, 2],
	["addMirror", 15, 28, 4],
	["addMirror", 15, 8, 2],
	["addMirror", 18, 16, 3],
	["addMirror", 18, 21, 4],
	["addMirror", 18, 8, 4],
	["addMirror", 22, 16, 4],
	["addMirror", 22, 21, 2],
	["addMirror", 22, 27, 3],
	["addMirror", 22, 8, 4],
	["addMirror", 27, 8, 4],
	["addMirror", 27, 16, 4],
	["addMirror", 27, 27, 2],
	["addMirror", 15, 24, 2],
	["setText", "I can see the crystal up ahead!"],
	["setText", "This is it, I can do this!"],
];

var level_21 = [
	["setText", "The world can finally be bright again!"],
	["addEmitter", 15, 2, 6347397, 1],
	["addCrystal", 15, 30, 6347397],
];

var levels = [ level_20, level_21];
PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	//initialize the grid
	PS.gridSize( gridSize, gridSize );
	PS.gridColor( webPageColor ); // Perlenspiel gray

	//initialize all data
	var k;
	for(k = 0; k < (gridSize * gridSize); k++) {
		lightData[k] = lightColor;
		alphaData[k] = 0;
		beadData[k] = bgColor;
	}

	//set the status color and data
	PS.statusColor( PS.COLOR_WHITE );
	PS.statusText( "My Last Lightline" );

	PS.audioLoad( "fx_click", { lock: true } ); // load & lock click sound
	PS.audioLoad( "fx_bloop", { lock: true } );
	PS.audioLoad( "xylo_a4",  { lock: true } );
	PS.audioLoad( "xylo_ab7", { lock: true } );
	PS.audioLoad( "fx_drip2", { lock: true } );
	PS.audioLoad( "fx_chirp1",{ lock: true } );
	PS.audioLoad( "fx_chirp2",{ lock: true } );

	//set the grid color for the light data
	var i;
	var j;
	for(i = 0; i<gridSize; i++){
		for(j = 0; j<gridSize; j++){
			PS.color( i, j, lightData[i+(j*gridSize)]); // set color
			PS.border(i,j,0);
		}
	}

	PS.timerStart(2, tick);

	loadNextLevel(levels);
	repaint(0,0);

};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";
	// Uncomment the following line to inspect parameters
	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
	// Play click sound
	//PS.audioPlay( "fx_click" );
	if(canInteract == true) {
		rotateMirror(x, y);
		//addEmitter(x, y, Math.floor(Math.random() * 16777215), Math.floor(Math.random() * 4) + 1);
	}
	//countAllRays();
	// Detect if the mouse is over a game element, if so then use that game element
};


// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";
	//set the position of the mouse variables to the mouse x and y.
	mouseX = x;
	mouseY = y;
	//The light a 1 is the mouse light.
	//so move it to the positon of the mouse.
	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";
	switch ( key ){
		//Cases for the WASD keys that will adjust the light the user is controlling
		case 100:{
			//Changes to the next color on pressing d
			//loadNextLevel(levels);
			//clearAllRaysWithoutParrents();
		}
	}
	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed

};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.swipe = function( data, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters

	/*
	 var len, i, ev;
	 PS.debugClear();
	 PS.debug( "PS.swipe(): start = " + data.start + ", end = " + data.end + ", dur = " + data.duration + "\n" );
	 len = data.events.length;
	 for ( i = 0; i < len; i += 1 ) {
	 ev = data.events[ i ];
	 PS.debug( i + ": [x = " + ev.x + ", y = " + ev.y + ", start = " + ev.start + ", end = " + ev.end +
	 ", dur = " + ev.duration + "]\n");
	 }
	 */

	// Add code here for when an input event is detected
};
PS.input = function( sensors, options ) {
	"use strict";
	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

function tick() {
	"use strict";
	//PS.debug(mouseX+","+mouseY+"\n");
	//Level stuff
	if (levelTimout <= 0) {
		PS.gridShadow(false, PS.COLOR_BLACK);
		for (var id = 0; id < objects.length / 7; id++) {
			var objectType = objects[(id * 7) + 1];
			//Light
			if (objectType == "light") {

			}
			//Emitter
			if (objectType == "emitter") {

			}
			//Receptacle
			if (objectType == "receptacle") {
				(objects[((id * 7) + 6)])[2] += 1;
				if (PS.color((objects[((id * 7) + 2)]), (objects[((id * 7) + 3)])) == (objects[((id * 7) + 6)])[1]) {
					levelTimout = 4 * 30;
					PS.audioStop(bgMusic);
					captureBG();
					canInteract = false;
					endColor = (objects[((id * 7) + 6)])[1];
					return;
				}
			}
			//Mirror
			if (objectType == "mirror") {

			}
			//Ray
			if (objectType == "ray") {
				if (canInteract == true) {
					if ((objects[((id * 7) + 6)])[5] == true) {
						(objects[((id * 7) + 6)])[2] += 1;
					}
				}
			}
			//Wall
			if (objectType == "wall") {

			}
			//Crystal
			if (objectType == "crystal") {
				if (PS.color((objects[((id * 7) + 2)]), (objects[((id * 7) + 3)])+1) ==  (objects[((id * 7) + 6)])[0]){
					levelTimout = 4 * 30;
					canInteract = false;
					endColor = PS.color((objects[((id * 7) + 2)]), (objects[((id * 7) + 3)])+1);
					return;
				}
			}
		}
		repaint(0, 0);
		//Timer stuff for the top of the screen
		if (countDown <= 0) {
			loadLevel(levels[c - 1]);
		}
		countDown -= 1;
		if (countDown <= (30 * 30)) {
			if (countDown == 30 * 30) {
				if(c<levels.length){
					bgMusic = PS.audioPlay("haunting-music", {path: "audio/"});
				}
				canInteract = true;
			}
			PS.statusText(Math.round(countDown / 30));
		} else {
			PS.statusColor(PS.COLOR_WHITE);
			PS.statusText(getLevelText(Math.ceil((countDown - (30 * 30)) / ((initialTimeConstant * 30) / numLines))));
		}
	} else {
		levelTimout -= 1;
		if (levelTimout == (3 * 30)) {
			PS.audioPlay("ftl-jump", {path: "audio/"});
		}
		var scaledColor = scaleColor(endColor, 1 - (Math.abs(levelTimout - (2 * 30)) / ((2 * 30))));
		PS.gridShadow(true, scaledColor);
		bgColor = scaledColor;
		lightColor = scaledColor;
		PS.statusColor(scaledColor);
		if(c>=levels.length){
			PS.gridColor( scaledColor );
		}
		repaint(0, 0);
		if (levelTimout == 0) {
			if(c<levels.length){
				loadNextLevel(levels);
			}
		}
	}
};



// a function to draw a pixel on the screen, auto checks to see if the pixel is on the screen.
var drawPixel = function(x, y, color){
	if(x <0||y <0||x >(gridSize-1)||y >(gridSize-1)){}else {
		beadData[x + (y * gridSize)] = color;
		PS.color(x, y, color);
	}
}

// a function to draw a pixel on the screen, auto checks to see if the pixel is on the screen.

/*
This is the start of all of the additional functions needed for the lighting system.
 */

var drawRay = function(id, x, y, orientation, color, steps){
	var path;
	//down
	//y+
	if(orientation == 1){
		path = PS.line(x,y, x, y+steps);
	}
	//left
	//x-
	if(orientation == 2){
		path = PS.line(x, y, x-steps, y);
	}
	//up
	//y-
	if(orientation == 3){
		path = PS.line(x, y, x, y-steps);
	}
	//right
	//x+
	if(orientation == 4){
		var path = PS.line(x, y, x+steps, y);
	}
	var i = 0;
	var lastX = 0;
	var lastY = 0;
	for(i = 0; i < path.length; i++){
		lastX = (path[i])[0];
		lastY = (path[i])[1];
		light(lastX, lastY, 2, color)
		drawPixel(lastX, lastY, color);
	}
	if((objects[(id * 7)])  != null) {
		(objects[(id * 7) + 6])[3] = lastX;
		(objects[(id * 7) + 6])[4] = lastY;
		checkForMirror(id);
	}
	//drawPixel(x, y, PS.COLOR_GREEN);
	//drawPixel(lastX, lastY, PS.COLOR_BLUE);
}

var drawEmitter = function(id, x, y, orientation, color){
	drawPixel(x, y, color);
	//down
	//y+
	if(orientation == 1){
		drawPixel(x-1, y-1, color);
		drawPixel(x, y-1, color);
		drawPixel(x+1, y-1, color);
		drawPixel(x-1, y, 10592673);
		drawPixel(x+1, y, 10592673);
		drawPixel(x-1, y+1, 10592673);
		drawPixel(x+1, y+1, 10592673);
		drawPixel(x-2, y-2, 5065550);
		drawPixel(x-1, y-2, 5065550);
		drawPixel(x, y-2, 5065550);
		drawPixel(x+1, y-2, 5065550);
		drawPixel(x+2, y-2, 5065550);
		drawPixel(x-2, y-1, 5065550);
		drawPixel(x-2, y, 5065550);
		drawPixel(x+2, y-1, 5065550);
		drawPixel(x+2, y, 5065550);
	}
	//left
	//x-
	if(orientation == 2){
		drawPixel(x+1, y-1, color);
		drawPixel(x+1, y, color);
		drawPixel(x+1, y+1, color);
		drawPixel(x, y+1, 10592673);
		drawPixel(x, y-1, 10592673);
		drawPixel(x-1, y+1, 10592673);
		drawPixel(x-1, y-1, 10592673);
		drawPixel(x+2, y-2, 5065550);
		drawPixel(x+2, y-1, 5065550);
		drawPixel(x+2, y, 5065550);
		drawPixel(x+2, y+1, 5065550);
		drawPixel(x+2, y+2, 5065550);
		drawPixel(x+1, y-2, 5065550);
		drawPixel(x+1, y+2, 5065550);
		drawPixel(x, y+2, 5065550);
		drawPixel(x, y-2, 5065550);
	}
	//up
	//y-
	if(orientation == 3){
		drawPixel(x-1, y+1, color);
		drawPixel(x, y+1, color);
		drawPixel(x+1, y+1, color);
		drawPixel(x-1, y, 10592673);
		drawPixel(x+1, y, 10592673);
		drawPixel(x-1, y-1, 10592673);
		drawPixel(x+1, y-1, 10592673);
		drawPixel(x-2, y+2, 5065550);
		drawPixel(x-1, y+2, 5065550);
		drawPixel(x, y+2, 5065550);
		drawPixel(x+1, y+2, 5065550);
		drawPixel(x+2, y+2, 5065550);
		drawPixel(x-2, y+1, 5065550);
		drawPixel(x-2, y, 5065550);
		drawPixel(x+2, y+1, 5065550);
		drawPixel(x+2, y, 5065550);
	}
	//right
	//x+
	if(orientation == 4){
		drawPixel(x-1, y-1, color);
		drawPixel(x-1, y, color);
		drawPixel(x-1, y+1, color);
		drawPixel(x, y+1, 10592673);
		drawPixel(x, y-1, 10592673);
		drawPixel(x+1, y+1, 10592673);
		drawPixel(x+1, y-1, 10592673);
		drawPixel(x-2, y-2, 5065550);
		drawPixel(x-2, y-1, 5065550);
		drawPixel(x-2, y, 5065550);
		drawPixel(x-2, y+1, 5065550);
		drawPixel(x-2, y+2, 5065550);
		drawPixel(x-1, y-2, 5065550);
		drawPixel(x-1, y+2, 5065550);
		drawPixel(x, y+2, 5065550);
		drawPixel(x, y-2, 5065550);
	}
	//drawRay(id, x, y, orientation, color, steps);
}

var drawReceptacle = function(x, y, orientation, color){
	if(orientation==1){
		drawPixel(x-4, y-1, wallColor);
		drawPixel(x-3, y-1, wallColor);
		drawPixel(x-2, y-1, wallColor);
		drawPixel(x-4, y, wallColor);
		drawPixel(x-3, y, color);
		drawPixel(x-2, y, wallColor);
		drawPixel(x-4, y+1, wallColor);
		drawPixel(x-3, y+1, wallColor);
		drawPixel(x-2, y+1, wallColor);

		drawPixel(x+4, y-1, wallColor);
		drawPixel(x+3, y-1, wallColor);
		drawPixel(x+2, y-1, wallColor);
		drawPixel(x+4, y, wallColor);
		drawPixel(x+3, y, color);
		drawPixel(x+2, y, wallColor);
		drawPixel(x+4, y+1, wallColor);
		drawPixel(x+3, y+1, wallColor);
		drawPixel(x+2, y+1, wallColor);
	}

	if(orientation==2){
		drawPixel(x-1, y-4, wallColor);
		drawPixel(x-1, y-3, wallColor);
		drawPixel(x-1, y-2, wallColor);
		drawPixel(x, y-4, wallColor);
		drawPixel(x, y-3, color);
		drawPixel(x, y-2, wallColor);
		drawPixel(x+1, y-4, wallColor);
		drawPixel(x+1, y-3, wallColor);
		drawPixel(x+1, y-2, wallColor);

		drawPixel(x-1, y+4, wallColor);
		drawPixel(x-1, y+3, wallColor);
		drawPixel(x-1, y+2, wallColor);
		drawPixel(x, y+4, wallColor);
		drawPixel(x, y+3, color);
		drawPixel(x, y+2, wallColor);
		drawPixel(x+1, y+4, wallColor);
		drawPixel(x+1, y+3, wallColor);
		drawPixel(x+1, y+2, wallColor);
	}
}

var drawWall = function(x1, y1, x2, y2){
	for(var i = 0; i< x2; i++){
		for(var j = 0; j< y2; j++){
			drawPixel(x1 + i, y1 + j, wallColor);
		}
	}
}

var drawMirror = function(x, y, orientation){
	drawPixel(x, y, mirrorColor);
	if(orientation == 1){
		drawPixel(x+1, y+1, mirrorColor);
		drawPixel(x-1, y-1, mirrorColor);
	}
	if(orientation == 2){
		drawPixel(x-1, y+1, mirrorColor);
		drawPixel(x+1, y-1, mirrorColor);
	}
	if(orientation == 3){
		drawPixel(x-1, y-1, mirrorColor);
		drawPixel(x+1, y+1, mirrorColor);
	}
	if(orientation == 4){
		drawPixel(x-1, y+1, mirrorColor);
		drawPixel(x+1, y-1, mirrorColor);
	}
}

var drawCrystal = function(x, y){
	drawPixel(x+1, y, PS.COLOR_WHITE);
	drawPixel(x+2, y, PS.COLOR_WHITE);
	drawPixel(x+3, y, PS.COLOR_WHITE);
	drawPixel(x+4, y, PS.COLOR_WHITE);
	drawPixel(x+5, y, PS.COLOR_WHITE);
	drawPixel(x+6, y, PS.COLOR_WHITE);
	drawPixel(x, y, PS.COLOR_WHITE);
	drawPixel(x-1, y, PS.COLOR_WHITE);
	drawPixel(x-2, y, PS.COLOR_WHITE);
	drawPixel(x-3, y, PS.COLOR_WHITE);
	drawPixel(x-4, y, PS.COLOR_WHITE);
	drawPixel(x-5, y, PS.COLOR_WHITE);
	drawPixel(x-6, y, PS.COLOR_WHITE);
	for(var i = 0; i<5; i++){
		for(var j = 0; j< 12; j++){
			drawPixel(x + i - 2, y + j - 12, PS.COLOR_WHITE);
		}
	}
	for(var i = 0; i<3; i++){
		for(var j = 0; j< 12; j++){
			drawPixel(x + i - 1, y + j - 12, mirrorColor);
		}
	}
	drawPixel(x, y-14, mirrorColor);
	drawPixel(x, y-13, mirrorColor);
	drawPixel(x, y-15, PS.COLOR_WHITE);
	drawPixel(x-1, y-14, PS.COLOR_WHITE);
	drawPixel(x-1, y-13, PS.COLOR_WHITE);
	drawPixel(x+1, y-14, PS.COLOR_WHITE);
	drawPixel(x+1, y-13, PS.COLOR_WHITE);

	drawPixel(x-8, y-1, PS.COLOR_WHITE);
	drawPixel(x-7, y-1, PS.COLOR_WHITE);
	drawPixel(x-6, y-1, mirrorColor);
	drawPixel(x-5, y-1, mirrorColor);
	drawPixel(x-4, y-1, PS.COLOR_WHITE);
	drawPixel(x-3, y-1, mirrorColor);
	drawPixel(x+8, y-1, PS.COLOR_WHITE);
	drawPixel(x+7, y-1, PS.COLOR_WHITE);
	drawPixel(x+6, y-1, mirrorColor);
	drawPixel(x+5, y-1, mirrorColor);
	drawPixel(x+4, y-1, PS.COLOR_WHITE);
	drawPixel(x+3, y-1, mirrorColor);

	drawPixel(x-9, y-2, PS.COLOR_WHITE);
	drawPixel(x-8, y-2, mirrorColor);
	drawPixel(x-7, y-2, mirrorColor);
	drawPixel(x-6, y-2, mirrorColor);
	drawPixel(x-5, y-2, PS.COLOR_WHITE);
	drawPixel(x-4, y-2, PS.COLOR_WHITE);
	drawPixel(x-3, y-2, mirrorColor);
	drawPixel(x+9, y-2, PS.COLOR_WHITE);
	drawPixel(x+8, y-2, mirrorColor);
	drawPixel(x+7, y-2, mirrorColor);
	drawPixel(x+6, y-2, mirrorColor);
	drawPixel(x+5, y-2, PS.COLOR_WHITE);
	drawPixel(x+4, y-2, PS.COLOR_WHITE);
	drawPixel(x+3, y-2, mirrorColor);

	drawPixel(x-10, y-3, PS.COLOR_WHITE);
	drawPixel(x-9, y-3, mirrorColor);
	drawPixel(x-8, y-3, mirrorColor);
	drawPixel(x-7, y-3, PS.COLOR_WHITE);
	drawPixel(x-6, y-3, PS.COLOR_WHITE);
	drawPixel(x-5, y-3, PS.COLOR_WHITE);
	drawPixel(x-4, y-3, mirrorColor);
	drawPixel(x-3, y-3, mirrorColor);
	drawPixel(x+10, y-3, PS.COLOR_WHITE);
	drawPixel(x+9, y-3, mirrorColor);
	drawPixel(x+8, y-3, mirrorColor);
	drawPixel(x+7, y-3, PS.COLOR_WHITE);
	drawPixel(x+6, y-3, PS.COLOR_WHITE);
	drawPixel(x+5, y-3, PS.COLOR_WHITE);
	drawPixel(x+4, y-3, mirrorColor);
	drawPixel(x+3, y-3, mirrorColor);

	drawPixel(x-10, y-4, PS.COLOR_WHITE);
	drawPixel(x-9, y-4, mirrorColor);
	drawPixel(x-8, y-4, mirrorColor);
	drawPixel(x-7, y-4, PS.COLOR_WHITE);
	drawPixel(x-5, y-4, PS.COLOR_WHITE);
	drawPixel(x-4, y-4, mirrorColor);
	drawPixel(x-3, y-4, mirrorColor);
	drawPixel(x+10, y-4, PS.COLOR_WHITE);
	drawPixel(x+9, y-4, mirrorColor);
	drawPixel(x+8, y-4, mirrorColor);
	drawPixel(x+7, y-4, PS.COLOR_WHITE);
	drawPixel(x+5, y-4, PS.COLOR_WHITE);
	drawPixel(x+4, y-4, mirrorColor);
	drawPixel(x+3, y-4, mirrorColor);

	drawPixel(x-10, y-5, PS.COLOR_WHITE);
	drawPixel(x-9, y-5, mirrorColor);
	drawPixel(x-8, y-5, PS.COLOR_WHITE);
	drawPixel(x-5, y-5, PS.COLOR_WHITE);
	drawPixel(x-4, y-5, mirrorColor);
	drawPixel(x-3, y-5, mirrorColor);
	drawPixel(x+10, y-5, PS.COLOR_WHITE);
	drawPixel(x+9, y-5, mirrorColor);
	drawPixel(x+8, y-5, PS.COLOR_WHITE);
	drawPixel(x+5, y-5, PS.COLOR_WHITE);
	drawPixel(x+4, y-5, mirrorColor);
	drawPixel(x+3, y-5, mirrorColor);

	drawPixel(x-9, y-6, PS.COLOR_WHITE);
	drawPixel(x-6, y-6, PS.COLOR_WHITE);
	drawPixel(x-5, y-6, mirrorColor);
	drawPixel(x-4, y-6, mirrorColor);
	drawPixel(x-3, y-6, PS.COLOR_WHITE);
	drawPixel(x+9, y-6, PS.COLOR_WHITE);
	drawPixel(x+6, y-6, PS.COLOR_WHITE);
	drawPixel(x+5, y-6, mirrorColor);
	drawPixel(x+4, y-6, mirrorColor);
	drawPixel(x+3, y-6, PS.COLOR_WHITE);

	drawPixel(x-6, y-7, PS.COLOR_WHITE);
	drawPixel(x-5, y-7, mirrorColor);
	drawPixel(x-4, y-7, mirrorColor);
	drawPixel(x-3, y-7, PS.COLOR_WHITE);
	drawPixel(x+6, y-7, PS.COLOR_WHITE);
	drawPixel(x+5, y-7, mirrorColor);
	drawPixel(x+4, y-7, mirrorColor);
	drawPixel(x+3, y-7, PS.COLOR_WHITE);

	drawPixel(x-6, y-8, PS.COLOR_WHITE);
	drawPixel(x-5, y-8, mirrorColor);
	drawPixel(x-4, y-8, PS.COLOR_WHITE);
	drawPixel(x+6, y-8, PS.COLOR_WHITE);
	drawPixel(x+5, y-8, mirrorColor);
	drawPixel(x+4, y-8, PS.COLOR_WHITE);

	drawPixel(x-7, y-9, PS.COLOR_WHITE);
	drawPixel(x-6, y-9, mirrorColor);
	drawPixel(x-5, y-9, mirrorColor);
	drawPixel(x-4, y-9, PS.COLOR_WHITE);
	drawPixel(x+7, y-9, PS.COLOR_WHITE);
	drawPixel(x+6, y-9, mirrorColor);
	drawPixel(x+5, y-9, mirrorColor);
	drawPixel(x+4, y-9, PS.COLOR_WHITE);

	drawPixel(x-7, y-10, PS.COLOR_WHITE);
	drawPixel(x-6, y-10, mirrorColor);
	drawPixel(x-5, y-10, PS.COLOR_WHITE);
	drawPixel(x+7, y-10, PS.COLOR_WHITE);
	drawPixel(x+6, y-10, mirrorColor);
	drawPixel(x+5, y-10, PS.COLOR_WHITE);

	drawPixel(x-7, y-11, PS.COLOR_WHITE);
	drawPixel(x-6, y-11, mirrorColor);
	drawPixel(x-5, y-11, PS.COLOR_WHITE);
	drawPixel(x+7, y-11, PS.COLOR_WHITE);
	drawPixel(x+6, y-11, mirrorColor);
	drawPixel(x+5, y-11, PS.COLOR_WHITE);

	drawPixel(x-6, y-12, PS.COLOR_WHITE);
	drawPixel(x+6, y-12, PS.COLOR_WHITE);


}

var rotateMirror = function(x, y){
	for(var i = 0; i < objects.length/7; i++){
		var objectType = objects[(i * 7) + 1];
		if(objectType == "mirror"){
			var objX = (objects[(i * 7) + 2]);
			var objY = (objects[(i * 7) + 3]);
			if(distance(x, y, objX, objY) <= 2){
				//rotate the mirror
				(objects[(i * 7) + 6])[0]+=1;
				if((objects[(i * 7) + 6])[0]>=5){
					(objects[(i * 7) + 6])[0] = 1;
				}
				//mirror is found, now the ray that is cast from the mirror needs to be found.
				for(var j = 0; j < objects.length/7; j++){
					objectType = objects[(j * 7) + 1];
					if(objectType == "ray"){
						//make sure that it is the correct ray
						objX = (objects[(j * 7) + 2]);
						objY = (objects[(j * 7) + 3]);
						if(distance(x, y, objX, objY) <= 2){
							//it is found, now it needs to be rotated
							//set the roation of the ray to the rotation of the mirror
							(objects[(j * 7) + 6])[0] = calculateIntersection((objects[(i * 7) + 6])[3], (objects[(i * 7) + 6])[0]);
							(objects[(j * 7) + 6])[2] = 0;
							(objects[(j * 7) + 6])[5] = true;
							//removeAllAfterRays(j, [-1]);
							removePath(j, (objects[(i * 7) + 6])[0]);
							clearAllRaysWithoutParrents();
						}
					}
				}
			}
		}
	}
}

//This function draws a light at the specific location x,y of size size, in the color color
var light = function(x, y, size, color) {
	var i;
	var j;
	for(i = -size; i < size+1; i++){
		for(j = -size; j < size+1; j++){
			if(x + i<0||y + j<0||x + i>(gridSize-1)||y + j>(gridSize-1)){}else {

				var pxDistance = distance(x, y, x + i,  y + j);
				var percent = (pxDistance/size);
				var oldAlpha = alphaData[(x + i) + ((y + j) * gridSize)];
				var newAlpha = 1-percent;
				var largestAlpha = oldAlpha;
				if(newAlpha>oldAlpha){
					largestAlpha = newAlpha;
				}
				if(pxDistance<size) {
					var existingColor = scaleColor(lightData[(x + i) + ((y + j) * gridSize)], (oldAlpha/largestAlpha)*1);
					var curColor = scaleColor(color, (newAlpha/largestAlpha)*1);
					var newColor = averageColor(existingColor, curColor);
					lightData[(x + i) + ((y + j) * gridSize)] = scaleColor(newColor, largestAlpha);
					alphaData[(x + i) + ((y + j) * gridSize)] = largestAlpha;
				}

			}
		}
	}

};

var checkForMirror = function(id){
	if(objects[(id*7)+1] == "ray") {
		for (var i = 0; i < objects.length / 7; i++) {
			var objectType = objects[(i * 7) + 1];
			if (objectType == "mirror") {
				//current positon of the laser light
				var x = (objects[(id * 7) + 6])[3];
				var y = (objects[(id * 7) + 6])[4];
				var laserOrientation = (objects[(id * 7) + 6])[0];
				if(x<0||y<0||x>(gridSize-1)||y>(gridSize-1)){}else {
					if (x == (objects[(i * 7) + 2])) {
						if (y == (objects[(i * 7) + 3])) {
							if ((objects[(id * 7) + 6])[5] == true) {
								(objects[(id * 7) + 6])[5] = false;
								var mirrorDir = (objects[(i * 7) + 6])[0];
								var dir = calculateIntersection(laserOrientation, mirrorDir);
								//set the mirrors incoming direction to the orientation of the ray coming into the mirror
								(objects[(i * 7) + 6])[3] = (objects[(id*7)+6])[0];
								(objects[(i * 7) + 6])[4] = id;
								addRay(x, y, (objects[(id * 7) + 6])[1], dir);
								PS.audioPlay( "boom-kick", { path: "audio/" } );
								return;
							}
						}
					}
					var offsetX = 0;
					var offsetY = 0;
					if(laserOrientation == 1){
						offsetY = 1;
					}
					if(laserOrientation == 2){
						offsetX = -1;
					}
					if(laserOrientation == 3){
						offsetY = -1;
					}
					if(laserOrientation == 4){
						offsetX = 1;
					}
					if((x + offsetX)<0|| (y + offsetY)<0||(x + offsetX)>(gridSize-1)|| (y + offsetY)>(gridSize-1)){}else {
						if (PS.color((x + offsetX), (y + offsetY)) == wallColor) {
							if ((x + offsetX) != 0 &&  (y + offsetY) != 0) {
								if ((objects[(id * 7) + 6])[5] == true) {
									(objects[(id * 7) + 6])[5] = false;
									return;
								}
							}
						}
					}
				}
			}
		}
	}
}

var calculateIntersection = function(laserOrientation, mirrorDir){
	var dir = 1;
	if (laserOrientation == 4 && mirrorDir == 4) {
		dir = 3;
	}
	if (laserOrientation == 4 && mirrorDir == 3) {
		dir = 1;
	}
	if (laserOrientation == 4 && mirrorDir == 2) {
		dir = 3;
	}
	if (laserOrientation == 4 && mirrorDir == 1) {
		dir = 1;
	}
	//3
	if (laserOrientation == 3 && mirrorDir == 4) {
		dir = 4;
	}
	if (laserOrientation == 3 && mirrorDir == 3) {
		dir = 2;
	}
	if (laserOrientation == 3 && mirrorDir == 2) {
		dir = 4;
	}
	if (laserOrientation == 3 && mirrorDir == 1) {
		dir = 2;
	}
	//2
	if (laserOrientation == 2 && mirrorDir == 4) {
		dir = 1;
	}
	if (laserOrientation == 2 && mirrorDir == 3) {
		dir = 3;
	}
	if (laserOrientation == 2 && mirrorDir == 2) {
		dir = 1;
	}
	if (laserOrientation == 2 && mirrorDir == 1) {
		dir = 3;
	}
	//1
	if (laserOrientation == 1 && mirrorDir == 4) {
		dir = 2;
	}
	if (laserOrientation == 1 && mirrorDir == 3) {
		dir = 4;
	}
	if (laserOrientation == 1 && mirrorDir == 2) {
		dir = 2;
	}
	if (laserOrientation == 1 && mirrorDir == 1) {
		dir = 4;
	}
	return dir;
}

var removePath = function(id, mirrorDir){
	//stop all timers
	var path = findNextRay(id, []);
	var parent = findParent(id);

	//PS.debug(path+"\n");

	for(var i = path.length; i>0; i--){
		if((objects[((path[i] - i) * 7) + 1]) == "ray") {
			//PS.debug("Removing:"+path[i]+"\n");
			removeObject(path[i]);
		}
	}

	//countAllRays();

	//addRay((objects[(parent * 7) + 6])[3], (objects[(parent * 7) + 6])[4], (objects[(parent * 7) + 6])[1], calculateIntersection((objects[(parent * 7) + 6])[0], mirrorDir));
	(objects[(id * 7) + 6])[5] = true;
	(objects[(id * 7) + 6])[0] = calculateIntersection((objects[(parent * 7) + 6])[0], mirrorDir);
	clearAllRaysWithoutParrents();
	repaint(0, 0);
}

var levelGenerator = function(level){
	var mirrors = 0;
	var level_layout = [[]];

	// Determines how many mirrors will be placed on the screen based on which level the player is currently on
	if(level > 5 && level <= 10){
		mirrors = 12;
	} else if(level > 10 && level <= 15){
		mirrors = 15;
	} else if(level > 15 && level <= 20){
		mirrors = 18;
	} else{
		mirrors = 22;
	}

	level_layout[0][0] = "addEmitter"

	// Determines which position the emitter will start in based on the previous receptacle's position
	if(((levels[c-1])[1])[2] == 2 && levels[c-1][1][3] == 27){
		level_layout[0][1] = 2;
		level_layout[0][2] = 2;
	} else if(levels[c-1][1][2] == 30 && levels[c-1][1][3] == 27){
		level_layout[0][1] = 2;
		level_layout[0][2] = 27;
	} else if(levels[c-1][1][2] == 26 && levels[c-1][1][3] == 30){
		level_layout[0][1] = 26;
		level_layout[0][2] = 2;
	} else if(levels[c-1][1][2] == 1 && levels[c-1][1][3] == 27){
		level_layout[0][1] = 32;
		level_layout[0][2] = 27;
	}

	level_layout[0][3] = 16711680;
	level_layout[0][4] = 1;

	return level_layout;
}



var findParent = function(id){
	if(objects[(id * 7) + 1] != "ray"){
		return;
	}
	var rayColor = (objects[(id * 7) + 6])[1];
	var rayStartX = (objects[(id * 7) + 2]);
	var rayStartY = (objects[(id * 7) + 3]);

	var parent = -1;

	for(var i = 0; i< objects.length/7; i++) {
		//find a ray
		if (objects[(i * 7) + 1] == "ray") {
			if (i != id) {
				//get vars for new ray
				var newRayColor = (objects[(i * 7) + 6])[1];
				var newRayEndX = (objects[(i * 7) + 6])[3];
				var newRayEndY = (objects[(i * 7) + 6])[4];
				//make sure everything is the same
				if (rayColor == newRayColor) {
					if (newRayEndX == rayStartX) {
						if (newRayEndY == rayStartY) {
							parent = i;
							break;
						}
					}
				}
			}
		}
	}

	return parent;
}

var findNextRay = function(id, checked){
	//check to see that object[id] is a ray
	if(objects[(id * 7) + 1] != "ray"){
		return;
	}
	var rayColor = (objects[(id * 7) + 6])[1];
	//var rayStartX = (objects[(id * 7) + 2]);
	//var rayStartY = (objects[(id * 7) + 3]);
	var rayEndX = (objects[(id * 7) + 6])[3];
	var rayEndY = (objects[(id * 7) + 6])[4];

	var child;

	for(var i = 0; i< objects.length/7; i++){
		//find a ray
		if(objects[(i * 7) + 1] == "ray"){
			//ray cant be this ray's id, or infinate recursion will ensue
			var proceed = true;
			for(var j = 0; j < checked.length; j++){
				if(checked[j] == i){
					proceed = false;
				}

			}
			if(proceed == true) {
				if (i != id) {
					//get vars for new ray
					var newRayColor = (objects[(i * 7) + 6])[1];
					var newRayStartX = (objects[(i * 7) + 2]);
					var newRayStartY = (objects[(i * 7) + 3]);
					//make sure everything is the same
					if (rayColor == newRayColor) {
						if (rayEndX == newRayStartX) {
							if (rayEndY == newRayStartY) {
								child = i;
								checked[checked.length] = i;
								break;
							}
						}
					}
				}
			}
		}
	}

	if(child == undefined){
		var proceed = true;
		for(var j = 0; j < checked.length; j++){
			if(checked[j] == i){
				proceed = false;
			}

		}
		if(proceed == true) {
			return id;
		}
	}
	var proceed = true;
	for(var j = 0; j < checked.length; j++){
		if(checked[j] == i){
			proceed = false;
		}

	}
	if(proceed == true) {
		return [id].concat(findNextRay(child, checked));
	}else{
		return(findNextRay(child, checked));
	}
}

var clearAllRaysWithoutParrents= function(){
	for (var i = 1; i < objects.length / 7; i++) {
		if ((objects[(i * 7) + 1]) == "ray") {
			if ((objects[((i-1) * 7) + 1]) != "emitter") {
				var childX = (objects[(i * 7) + 2]);
				var childY = (objects[(i * 7) + 3]);
				var childColor = (objects[(i * 7) + 6])[1];
				loop:{
					for (var j = 1; j < objects.length / 7; j++) {
						if ((objects[(j * 7) + 1]) == "ray") {
							var parentX = (objects[(j * 7) + 6])[3];
							var parentY = (objects[(j * 7) + 6])[4];
							var parentColor = (objects[(j * 7) + 6])[1];
							if (childX == parentX) {
								if (childY == parentY) {
									if (childColor == parentColor) {
										//if the parrent id = this id -1 break
										if((i-1) == j) {
											break loop;
										}
										////if the parrent id
										if ((objects[((j-1) * 7) + 1]) == "emitter") {
											break loop;
										}
									}
								}
							}
						}
					}

					removeObject(i);
					i = 0;
				}
			}
		}
	}
	//get the last and first rays
	var last = (objects.length / 7)-1;
	var first = null;
	var count = 0;
	//find first ray
	for(var i = 0; i < objects.length / 7; i++){
		if ((objects[(i * 7) + 1]) == "ray") {
			if(first == null) {
				first = i;
			}
			count++;
		}
	}
	//make sure that their is at least 2 mirrors on the screen
	if(count > 2) {
		//chack that the last object is a ray
		if ((objects[(last * 7) + 1]) == "ray") {
			for (var j = 1; j < objects.length / 7; j++) {
				//find a mirror
				if ((objects[(j * 7) + 1]) == "mirror") {
					//get the mirrors x and y position
					var X = (objects[(j * 7) + 2]);
					var Y = (objects[(j * 7) + 3]);
					//if the x and y match the start of the last ray
					if (X == (objects[(last * 7) + 2])) {
						if (Y == (objects[(last * 7) + 3])) {
							//if the x and y match the end of the first ray
							if (X == (objects[(first * 7) + 6])[3]) {
								if (Y == (objects[(first * 7) + 6])[4]) {
									removeObject(last);
									return;
								}
							}
						}
					}
				}
			}
		}
	}
}

var countAllRays = function(){
	var out = 0;
	for(var i = 0; i< objects.length/7; i++){
		if(objects[(i * 7) + 1] == "ray"){
			out++;
		}
	}
	PS.debug(out+"\n");
}


/*
	Code for adding specific objects to the scene
 */
var addEmitter= function(x, y, color, orientation){
	var id = objects.length / 7;
	addObject("emitter", x, y, 0, 0, [orientation, color]);
	addRay(x, y, color, orientation);
}

var addRay = function(x, y, color, orientation){
	var id = objects.length / 7;
	//PS.debug("rayAdded");
	addObject("ray", x, y, 0, 0, [orientation, color, 0, 0, y, true]);
}

var addMirror= function(x, y, orientation){
	var id = objects.length / 7;
	addObject("mirror", x, y, 0, 0, [orientation, 0, 0, 0, 0]);
}

var addReceptacle= function(x, y, color, orientation){
	var id = objects.length / 7;
	addObject("receptacle", x, y, 0, 0, [orientation, color, 0]);
}

var addWall = function(x1, y1, x2, y2){
	var id = objects.length / 7;
	addObject("wall", x1, y1, 0, 0, [x1, y1, x2, y2]);
}


var addCrystal = function(x, y, color){
	var id = objects.length / 7;
	addObject("crystal", x, y, 0, 0, [color]);
}

//this function returns the distance between two points in space using the 2point distance formula.
var distance = function(x, y, xx, yy) {
	return Math.sqrt(Math.pow((x - xx), 2)+Math.pow((y - yy), 2));
};

//This function retunrs the RGB value of a decimal color.
var printRGB = function(color) {
	var b = color%256;
	var g = ((color%65536)-b)/256;
	var r = (color-g)/65536;
	b = (Math.round(b));
	g = (Math.round(g));
	r = (Math.round(r));
	PS.debug("R"+r+",G"+g+",B"+b+"\n");
};

//this function attinuates a color to black based on the scale, a scale of 1 reurns the color, a scale of 0 returns black.
var scaleColor = function(color, scale) {
	if(scale>1){
		scale = 1;
	}
	if(scale<0){
		scale = 0;
	}
	var b = color%256;
	var g = ((color%65536)-b)/256;
	var r = (color-g)/65536;
	b = (Math.round(b*scale)*1);
	g = (Math.round(g*scale)*256);
	r = (Math.round(r*scale)*65536);
	//b = 255-b;
	//g = 65280-g;
	//r = 16711680-r;
	return (r+g+b);
};

//this function takes in two colors and returns a perfectly averaged version of those two colors.
var averageColor = function(color1, color2) {
	var b1 = color1%256;
	var g1 = ((color1%65536)-b1)/256;
	var r1 = (color1-g1)/65536;

	var b2 = color2%256;
	var g2 = ((color2%65536)-b2)/256;
	var r2 = (color2-g2)/65536;

	var r = r1 + r2;
	var g = g1 + g2;
	var b = b1 + b2;


	var largest = 0;
	if(r>largest){
		largest = r;
	}
	if(g>largest){
		largest = g;
	}
	if(b>largest){
		largest = b;
	}
	r = Math.round(255 * (r/largest));
	g = Math.round(255 * (g/largest));
	b = Math.round(255 * (b/largest));

	b = (Math.round(b)*1);
	g = (Math.round(g)*256);
	r = (Math.round(r)*65536);


	var out = 0;
	if((r+g+b) <= 16777215){
		out = (r+g+b);
	}
	if((r+g+b) >= 0){
		out = (r+g+b);
	}

	return out;
};



//This function adds a light to the scene of objects, and returns the hash representing the position of the light in the array of objects.
var addObject = function(type, x, y, width, height, data){
	var id = objects.length / 7;
	objects[(id * 7) + 0] = id;
	objects[(id * 7) + 1] = type;
	objects[(id * 7) + 2] = x;
	objects[(id * 7) + 3] = y;
	objects[(id * 7) + 4] = width;
	objects[(id * 7) + 5] = height;
	objects[(id * 7) + 6] = data;
	return id;
}

//removes the light at index:hash from the array of objects
var removeObject = function(hash){
	if(hash >= 0 && hash < objects.length/7) {
		var id = hash;
		var oldObjects = objects;
		oldObjects[(id * 7) + 0] = null;
		oldObjects[(id * 7) + 1] = null;
		oldObjects[(id * 7) + 2] = null;
		oldObjects[(id * 7) + 3] = null;
		oldObjects[(id * 7) + 4] = null;
		oldObjects[(id * 7) + 5] = null;
		oldObjects[(id * 7) + 6] = null;
		//
		var index = 0;
		var i;
		var newObjects = [];
		for (i = 0; i < objects.length / 7; i++) {
			if (oldObjects[i * 7] != null) {
				newObjects[(index * 7) + 0] = index;
				newObjects[(index * 7) + 1] = oldObjects[(i * 7) + 1];
				newObjects[(index * 7) + 2] = oldObjects[(i * 7) + 2];
				newObjects[(index * 7) + 3] = oldObjects[(i * 7) + 3];
				newObjects[(index * 7) + 4] = oldObjects[(i * 7) + 4];
				newObjects[(index * 7) + 5] = oldObjects[(i * 7) + 5];
				newObjects[(index * 7) + 6] = oldObjects[(i * 7) + 6];
				index++;
			}
		}
		objects = newObjects;
	}

	for (i = 0; i < objects.length / 7; i++) {
		newObjects[(i * 7) + 0] = i;
	}

	repaint(0, 0);
}


//This function cycles through all objects and draws each of them individually.
var drawAllObjects = function(){
	var i;
	for(i = 0; i<objects.length/7; i++){
		var objectType = objects[(i * 7) + 1];
		//Light
		if(objectType == "light"){
			light(objects[(i*7)+2],objects[(i*7)+3],(objects[((i*7)+6)])[0],(objects[((i*7)+6)])[1]);
		}
		//Emitter
		if(objectType == "emitter"){
			drawEmitter(objects[(i*7)+0],objects[(i*7)+2],objects[(i*7)+3],(objects[((i*7)+6)])[0],(objects[((i*7)+6)])[1]);
		}
		//Receptacle
		if(objectType == "receptacle"){
			drawReceptacle(objects[(i*7)+2],objects[(i*7)+3],(objects[((i*7)+6)])[0],(objects[((i*7)+6)])[1],(objects[((i*7)+6)])[1]);
		}
		//Ray
		if(objectType == "ray"){
			drawRay(objects[(i*7)+0],objects[(i*7)+2],objects[(i*7)+3],(objects[((i*7)+6)])[0],(objects[((i*7)+6)])[1],(objects[((i*7)+6)])[2]);
		}
		//Mirror
		if(objectType == "mirror"){
			drawMirror(objects[(i*7)+2],objects[(i*7)+3],(objects[((i*7)+6)])[0]);
		}
		//Wall
		if(objectType == "wall"){
			drawWall((objects[(i*7)+6])[0], (objects[(i*7)+6])[1], (objects[(i*7)+6])[2], (objects[(i*7)+6])[3]);
		}
		//Crystal
		if(objectType == "crystal"){
			drawCrystal((objects[(i*7)+2]), (objects[(i*7)+3]));
		}
	}
}

var loadLevel = function(level){
	countDown = (30+initialTimeConstant) * 30;
	numLines = 0;
	//stop all timers
	for(i = 0; i<objects.length/7; i++){
		for(var j = 0; j<(objects[(i*7)+6]).length; j++){
			if(typeof (objects[(i * 7) + 6])[j] == "string") {
				if (((objects[(i * 7) + 6])[j]).indexOf("timer_") > -1) {
					PS.timerStop((objects[(i * 7) + 6])[j]);
				}
			}
		}
	}
	////reset shadow
	//PS.gridShadow( true, PS.COLOR_BLACK);
	//clear the objects
	objects = [];
	repaint(0, 0);

	//load new objects
	for(var i = 0; i<level.length; i++){
		if((level[i])[0] == "addEmitter"){
			addEmitter((level[i])[1],(level[i])[2],(level[i])[3],(level[i])[4]);
		}
		if((level[i])[0] == "addMirror"){
			addMirror((level[i])[1],(level[i])[2],(level[i])[3]);
		}
		if((level[i])[0] == "addReceptacle"){
			addReceptacle((level[i])[1],(level[i])[2],(level[i])[3],(level[i])[4]);
		}
		if((level[i])[0] == "addWall"){
			addWall((level[i])[1],(level[i])[2],(level[i])[3],(level[i])[4]);
		}
		if((level[i])[0] == "addCrystal"){
			addCrystal((level[i])[1],(level[i])[2],(level[i])[3]);
		}
		if((level[i])[0] == "setText"){
			PS.statusText((level[i])[1]);
			numLines++;
		}
	}

}

var getLevelText = function(index){
	var count = 0;
	for(var i = levels[c-1].length-1; i>0; i--){
		if(((levels[c-1])[i])[0] == "setText"){
			count++;
			if(count == index){
				PS.statusText(((levels[c-1])[i])[1]);
			}
		}
	}
}

var loadNextLevel = function(levels){
	//Check if the current level is the last level
	if(c >= levels.length){
		PS.statusText("YOU WON!!!!");
		//stop all timers
		for(i = 0; i<objects.length/7; i++){
			for(var j = 0; j<(objects[(i*7)+6]).length; j++){
				if(typeof (objects[(i * 7) + 6])[j] == "string") {
					if (((objects[(i * 7) + 6])[j]).indexOf("timer_") > -1) {
						PS.timerStop((objects[(i * 7) + 6])[j]);
					}
				}
			}
		}
		//clear the objects
		objects = [];
	}
	else{
		loadLevel(levels[c]);
	}
	stepBGColor();
	c++;

}

var captureBG = function(){
	bgBeads = [];
	for(var i = 0; i<gridSize; i++){
		for(var j = 0; j<gridSize; j++){
			bgBeads[(i+(j * gridSize))] = PS.color(i, j);
		}
	}
}

var renderBG = function(dir, steps){
	var x = 0;
	var y = 0
	//1 = -y
	if(dir == 1){
		y = -stps;
	}
	//2 = +x
	if(dir == 2){
		x = +stps;
	}
	//3 = +y
	if(dir == 3){
		y = +stps;
	}
	//4 = -x
	if(dir == 4){
		x = -stps;
	}
	for(var i = 0; i<gridSize; i++){
		for(var j = 0; j<gridSize; j++){
			drawPixel(i+x, j+y, bgBeads[(i+(j * gridSize))]);
		}
	}
	if(steps >= gridSize){
		bgBeads = null;
	}
}

var stepBGColor = function(){
	var newColor = bgColor;
	if(c<=5) {
		newColor = scaleColor(startColor, ((5 - c) / 5));
	}else{
		newColor = scaleColor(startColor, ((c - 5) / (levels.length-5)));
	}
	bgColor = newColor
	lightColor = newColor;
	webPageColor = newColor;
	//PS.debug(bgColor+"\n");
	PS.gridColor( webPageColor);
	repaint(0, 0);
}

// Function to draw all objects on the screen.
var repaint = function(x, y) {
	//draw all of the objects in a scene.
	drawAllObjects();
	var i;
	var j;
	var constantColor = 0;
	for(i = 0; i<gridSize; i++){
		for(j = 0; j<gridSize; j++){
			//if(PS.color(i,j)!=bgColor){}else {
			//	if (alphaData[i + (j * gridSize)] > constantColor) {
			//		PS.color(i, j, scaleColor(averageColor(beadData[i + (j * gridSize)], lightData[i + (j * gridSize)]), alphaData[i + (j * gridSize)])); // set color
			//	} else {
			//		//the constant here is the transparancy of the bg, 0 is full, 1 is none
			//		PS.color(i, j, scaleColor(averageColor(beadData[i + (j * gridSize)], lightColor), constantColor));
			//	}
				PS.color(i, j,lightData[i + (j * gridSize)]); // set color
			//}
		}
	}
	drawAllObjects();
	//PS.gridColor(PS.color(gridSize/2, gridSize/2)); // Set the color of the Background to the color of the center of the grid
	//reset lighting;
	var k;
	for(k = 0; k < (gridSize * gridSize); k++){
		lightData[k]=lightColor;
		alphaData[k]=0;
		beadData[k]=bgColor;
	}

};




