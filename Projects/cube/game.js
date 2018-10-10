// game.js for Perlenspiel 3.2
// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

//Pointers to Timers and Databases that need to be started/stopped or initialized/destroyed
var goalsID;
var tickID;
var renderID;

//Game state stuff
var OVER = false;

//the tutorial Highlight Color
var COLOR_STATUS = PS.COLOR_BLACK;
//the color of the web page
var COLOR_WEB_PAGE = PS.COLOR_WHITE;

//If the mouse is pressed
var MOUSE_IN_GRID = false;
var PRESSED=false;
var LAST_X = 0;
var LAST_Y = 0;


//The grid variable representing the size of the PS grid
//The data field is auto-initialized on INIT
var grid = {
	width : 32, height : 32,
	//this stores if the data is fadeing in or out
	data : []
};

//all faces in the world
var FACES = [];
var TO_ADD = [];
var TO_REMOVE = [];

//Directional pts
var START_POINT = {'x':0, 'y':0};
var END_POINT   = {'x':0, 'y':0};
var DELTA = {'x':0, 'y':0};

//Prefabs for models
//CUBE

// PS.init( system, options )
// Initializes the game
PS.init = function( system, options ) {
	"use strict";
	init();
};


var init = function(){
	// Preload & lock sounds
	// PS.audioLoad( SOUND_PING, { lock : true, path:"sound/"} );

	// PS.debug("Init\n");
	goalsID = PS.dbInit("goals",{ discard : true });
	tickID = PS.timerStart(1, tick);
	renderID = PS.timerStart(1, render);

	//set the game up
	PS.gridSize( grid.width, grid.height );
	PS.gridColor(COLOR_WEB_PAGE); // grid background color

	//Initalize grid
	for(var j = 0; j < grid.height; j++){
		for(var i = 0; i < grid.width; i++){
			PS.data(i,j,0.0);
			grid.data[i+(j * grid.width)] = true;
			PS.border ( i, j, 0);
		}
	}

	//set status line stuff
	PS.statusText("");
	PS.statusColor(COLOR_STATUS);

	//COMMENT THIS BACK IN
	// PS.audioPlay( SOUND_BG_MUSIC, { lock : true, path:"sound/",loop:true});
	// addFace("test", [[16,2,6072443],[28,28,4478406],[2,28,8193143]]);

	addCube([16,16,0],"cube", 18);
}

var tick = function(){
	rotateY(getFace("cubef"), -DELTA.y);
	rotateY(getFace("cubeb"), -DELTA.y);
	rotateY(getFace("cubel"), -DELTA.y);
	rotateY(getFace("cuber"), -DELTA.y);
	rotateY(getFace("cubet"), -DELTA.y);
	rotateY(getFace("cubeo"), -DELTA.y);
	//
	rotateZ(getFace("cubef"), DELTA.x);
	rotateZ(getFace("cubeb"), DELTA.x);
	rotateZ(getFace("cubel"), DELTA.x);
	rotateZ(getFace("cuber"), DELTA.x);
	rotateZ(getFace("cubet"), DELTA.x);
	rotateZ(getFace("cubeo"), DELTA.x);

	DELTA.x = DELTA.x * 0.95;
	DELTA.y = DELTA.y * 0.95;

	// PS.debug("Before clean up Faces:"+FACES.length+" Add:"+TO_ADD.length+"remove:"+TO_REMOVE.length+"\n");
cleanupFaces();
	// PS.debug("After clean up Faces:"+FACES.length+" Add:"+TO_ADD.length+"remove:"+TO_REMOVE.length+"\n");
}

var render = function(){
	//reset the background
	for(var j = 0; j < grid.height; j++){
		for(var i = 0; i < grid.width; i++){
			PS.color(i,j,PS.COLOR_WHITE);
		}
	}
	//draw all faces from the face buffer
	drawAllFaces();
}

var insideGrid = function(x,y){
	if(x >= 0 && x < grid.width){
		if(y >= 0 && y < grid.height){
			return true;
		}
	}
	return false;
}


// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
PS.touch = function( x, y, data, options ) {
	"use strict";
	if(!OVER) {
		if(!PRESSED){
			START_POINT.x = x;
			START_POINT.y = y;
		}
		PRESSED = true;
		LAST_X = x;
		LAST_Y = y;
	}
};

// All event functions must be present to prevent startup errors,
// even if they don't do anything

PS.release = function( x, y, data, options ) {
	"use strict";
	PRESSED = false;
	END_POINT.x = x;
	END_POINT.y = y;

	var delta = deltas(START_POINT, END_POINT);
	DELTA.x += delta.x;
	DELTA.y += delta.y;
};

PS.enter = function( x, y, data, options ) {
	"use strict";
    MOUSE_IN_GRID = true;
};

PS.exit = function( x, y, data, options ) {
	"use strict";
	if(PRESSED){
		END_POINT.x = x;
		END_POINT.y = y;
		var delta = deltas(START_POINT, END_POINT);
		DELTA.x += delta.x;
		DELTA.y += delta.y;
		START_POINT.x = x;
		START_POINT.y = y;
	}
};

PS.exitGrid = function( options ) {
	"use strict";
		if(PRESSED){
	    MOUSE_IN_GRID = false;
			PRESSED = false;

			var delta = deltas(START_POINT, END_POINT);
			DELTA.x += delta.x;
			DELTA.y += delta.y;
		}
};

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";
    if(key == 119){
        rotateY(getFace("cubef"), 10);
        rotateY(getFace("cubeb"), 10);
        rotateY(getFace("cubel"), 10);
        rotateY(getFace("cuber"), 10);
        rotateY(getFace("cubet"), 10);
        rotateY(getFace("cubeo"), 10);
    }
    if(key == 115){
        rotateY(getFace("cubef"), -10);
        rotateY(getFace("cubeb"), -10);
        rotateY(getFace("cubel"), -10);
        rotateY(getFace("cuber"), -10);
        rotateY(getFace("cubet"), -10);
        rotateY(getFace("cubeo"), -10);
    }
    if(key == 97){
        rotateZ(getFace("cubef"), -10);
        rotateZ(getFace("cubeb"), -10);
        rotateZ(getFace("cubel"), -10);
        rotateZ(getFace("cuber"), -10);
        rotateZ(getFace("cubet"), -10);
        rotateZ(getFace("cubeo"), -10);
    }
    if(key == 100){
        rotateZ(getFace("cubef"), 10);
        rotateZ(getFace("cubeb"), 10);
        rotateZ(getFace("cubel"), 10);
        rotateZ(getFace("cuber"), 10);
        rotateZ(getFace("cubet"), 10);
        rotateZ(getFace("cubeo"), 10);
    }
    if(key == 113){
        rotateX(getFace("cubef"), -10);
        rotateX(getFace("cubeb"), -10);
        rotateX(getFace("cubel"), -10);
        rotateX(getFace("cuber"), -10);
        rotateX(getFace("cubet"), -10);
        rotateX(getFace("cubeo"), -10);
    }
    if(key == 101){
        rotateX(getFace("cubef"), 10);
        rotateX(getFace("cubeb"), 10);
        rotateX(getFace("cubel"), 10);
        rotateX(getFace("cuber"), 10);
        rotateX(getFace("cubet"), 10);
        rotateX(getFace("cubeo"), 10);
    }

    cleanupFaces();
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
//------------------------- Polygon Functions ---------------------------

//add a new face to the world with the ID:id and the Points:pt
var addFace = function(origin, id, points){
	var initialPoints = [];
	for(var i = 0; i < points.length; i++){
		initialPoints[i] = [points[i][0],points[i][1],points[i][2]];
	}
	var face = {
		id:id,
		origin:origin,
		angleX:0,
		angleY:0,
		angleZ:0,
		length:points.length,
		points:points,
		initialPoints:initialPoints
	};
	TO_ADD[TO_ADD.length] = face;
}

var getFace = function(id){
	for (var i = 0; i < FACES.length; i++) {
		if(FACES[i] != 0) {
			if (FACES[i].id === id) {
				return FACES[i];
			}
		}
	}
}

var removeFace = function(id){
	var face = {
		id:id
	};
	TO_REMOVE[TO_REMOVE.length] = face;
}

//Rotation
var rotateX = function(face,angle){
	if(face==null){
		return;
	}
	var s = Math.sin((angle/180));
	var c = Math.cos((angle/180));
	for(var i = 0; i < face.points.length; i++){
		var xnew = (face.points[i][0] * c) - (face.points[i][1] * s);
		var ynew = (face.points[i][0] * s) + (face.points[i][1] * c);
		face.points[i][0] = xnew;
		face.points[i][1] = ynew;
	}
}

var rotateY = function(face,angle){
	if(face==null){
		return;
	}
	var s = Math.sin((angle/180));
	var c = Math.cos((angle/180));
	for(var i = 0; i < face.points.length; i++){
		var ynew = (face.points[i][1] * c) - (face.points[i][2] * s);
		var znew = (face.points[i][1] * s) + (face.points[i][2] * c);
		face.points[i][1] = ynew;
		face.points[i][2] = znew;
	}
}

var rotateZ = function(face,angle){
	if(face==null){
		return;
	}
	var s = Math.sin((angle/180));
	var c = Math.cos((angle/180));
	for(var i = 0; i < face.points.length; i++){
		var znew = (face.points[i][2] * c) - (face.points[i][0] * s);
		var xnew = (face.points[i][2] * s) + (face.points[i][0] * c);
		face.points[i][2] = znew;
		face.points[i][0] = xnew;
	}
}


var cleanupFaces = function () {
	//hold out array in new Variable
	var out = [];
	//find and remove from existing FACES
	for(var j = 0; j < TO_REMOVE.length; j++) {
		for (var i = 0; i < FACES.length; i++) {
			if(FACES[i] != 0) {
				if (FACES[i].id === (TO_REMOVE[j].id)) {
					FACES[i] = 0;
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
	for (var i = 0; i < FACES.length; i++) {
		if (FACES[i]!=0) {
			out[index] = FACES[i];
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
	//set the FACES array to the clean array
	FACES = out;
}

var drawAllFaces = function(){
	//sort and Z index before this happens...
	for(var i = 0; i<FACES.length; i++){
		//if the face is facing forwards
		if(shoelace(FACES[i].points)>0) {
			//each face
			var pixelsPlaced = [];
			for (var j = 0; j < FACES[i].length; j++) {
				//the line for the polygon
				var line = [];
				var color1 = 0;
				var color2 = 0;
				if (j < FACES[i].length - 1) {
					line = PS.line(Math.floor(FACES[i].points[j][0]), Math.floor(FACES[i].points[j][1]), Math.floor(FACES[i].points[j + 1][0]), Math.floor(FACES[i].points[j + 1][1]));
					color1 = FACES[i].points[j][3];
					color2 = FACES[i].points[j + 1][3];
				} else {
					line = PS.line(Math.floor(FACES[i].points[j][0]), Math.floor(FACES[i].points[j][1]), Math.floor(FACES[i].points[0][0]), Math.floor(FACES[i].points[0][1]));
					color1 = FACES[i].points[j][3];
					color2 = FACES[i].points[0][3];
				}
				for (var l = 0; l < line.length; l++) {
					if (isPointOnGrid(line[l][0] + FACES[i].origin[0], line[l][1] + FACES[i].origin[1])) {
						PS.color(line[l][0] + FACES[i].origin[0], line[l][1] + FACES[i].origin[1], crossFadeColors(color1, color2, (l / line.length)));
						pixelsPlaced[pixelsPlaced.length] = [line[l][0], line[l][1]];
					}
				}
			}
			// PS.debug("Pixels:"+pixelsPlaced.length+"\n");
			//cell shader
			for (var j = 0; j < grid.height; j++) {
				var draw = -1;
				var flip_count = 0;
                var lastFlip = 0;
				for (var k = 0; k < grid.width; k++) {
					if(isPointInArray([k-FACES[i].origin[0],j-FACES[i].origin[1]], pixelsPlaced)){
                        if(lastFlip == 1){
                            draw *= 1;
                        }else {
                            draw *= -1;
                            flip_count++;
                            lastFlip = 1;
                        }
					}else{
                        lastFlip = 0;
                    }
				}
                var draw = -1;
                var count = 0;
                var lastColor = 0;
                var lastFlip = 0;
                for (var k = 0; k < grid.width; k++) {
                    if(isPointInArray([k-FACES[i].origin[0],j-FACES[i].origin[1]], pixelsPlaced)){
                        if(lastFlip == 1){
                            draw *= 1;
                        }else {
                            draw*=-1;
                            lastColor = PS.color(k,j);
                            count++;
                            lastFlip = 1;
                        }
                    }else{
                        lastFlip = 0;
                    }
                    if(count>=flip_count){
                        break;
                    }
                    if(draw>0){
                        // lastColor = PS.glyph(k,j,count);
                        PS.color(k,j, PS.COLOR_BLUE);
                    }
                }
			}

			// // //draw points
			// for (var j = 0; j < FACES[i].length; j++) {
			// 	if(isPointOnGrid(FACES[i].points[j][0]+ FACES[i].origin[0],FACES[i].points[j][1]+ FACES[i].origin[1])){
			// 		PS.color(FACES[i].points[j][0]+ FACES[i].origin[0],FACES[i].points[j][1]+ FACES[i].origin[1], PS.COLOR_GREEN);
			// 	}
			// }
		}
	}
}

//------------------------- Model Functions ---------------------------
var addCube = function(point, id, size){
	var CUBE_COLOR = PS.random(16777215)-1;
	var CUBE_VERTICES = [
		[.5 * size * -1, .5 * size * -1, .5 * size , PS.COLOR_RED],
		[.5 * size, .5 * size * -1, .5 * size, PS.COLOR_ORANGE],
		[.5 * size, .5 * size, .5 * size, PS.COLOR_YELLOW],
		[.5 * size * -1, .5 * size, .5 * size, PS.COLOR_GREEN],
		[.5 * size * -1, .5 * size * -1, .5 * size * -1, PS.COLOR_CYAN],
		[.5 * size, .5 * size * -1, .5 * size * -1, PS.COLOR_BLUE],
		[.5 * size, .5 * size, .5 * size * -1, PS.COLOR_BLACK],
		[.5 * size * -1, .5 * size, .5 * size * -1, PS.COLOR_MAGENTA]
	]
	// CUBE_VERTICES = setVerticesColors(CUBE_VERTICES, PS.COLOR_RED);
	addFace(point, id+"f",[CUBE_VERTICES[0],CUBE_VERTICES[1],CUBE_VERTICES[2],CUBE_VERTICES[3]]);
	// CUBE_VERTICES = setVerticesColors(CUBE_VERTICES, PS.COLOR_GREEN);
	addFace(point, id+"b",[CUBE_VERTICES[5],CUBE_VERTICES[4],CUBE_VERTICES[7],CUBE_VERTICES[6]]);
	// CUBE_VERTICES = setVerticesColors(CUBE_VERTICES, PS.COLOR_BLUE);
	addFace(point, id+"l",[CUBE_VERTICES[4],CUBE_VERTICES[0],CUBE_VERTICES[3],CUBE_VERTICES[7]]);
	// CUBE_VERTICES = setVerticesColors(CUBE_VERTICES, PS.COLOR_CYAN);
	addFace(point, id+"r",[CUBE_VERTICES[1],CUBE_VERTICES[5],CUBE_VERTICES[6],CUBE_VERTICES[2]]);
	// CUBE_VERTICES = setVerticesColors(CUBE_VERTICES, PS.COLOR_YELLOW);
	addFace(point, id+"t",[CUBE_VERTICES[4],CUBE_VERTICES[5],CUBE_VERTICES[1],CUBE_VERTICES[0]]);
	// CUBE_VERTICES = setVerticesColors(CUBE_VERTICES, PS.COLOR_ORANGE);
	addFace(point, id+"o",[CUBE_VERTICES[3],CUBE_VERTICES[2],CUBE_VERTICES[6],CUBE_VERTICES[7]]);
}

var setVerticesColors = function(vertices, color){
	var out = [];
	for(var i = 0; i < vertices.length; i++){
		out[i]=[];
		out[i][0] = vertices[i][0];
		out[i][1] = vertices[i][1];
		out[i][2] = vertices[i][2];
		out[i][3] = color;
	}
	return out;
}

//------------------------- Helper Functions ---------------------------

//2 point distance formula
var distance = function(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

var isPointOnGrid = function(x,y){
	return ((x>=0&&x<grid.width)&&(y>=0&&y<grid.height));
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

var isPointInArray= function(point, array){
	for(var i = 0; i < array.length; i++){
		if(array[i][0]==point[0]&&array[i][1]==point[1]){
			return true;
		}
	}
	return false;
}

var deltas = function(pt1, pt2){
		return {"x":(pt2.x - pt1.x),"y":(pt2.y - pt1.y)};
}

var shoelace = function(pts){
	var xPos = [];
	var yPos = [];
	for(var i = 0; i < pts.length; i++){
		xPos[i] = pts[i][0];
		yPos[i] = pts[i][1];
	}
	xPos[pts.length] = pts[0][0];
	yPos[pts.length] = pts[0][1];
	var xTotal = 0;
	var yTotal = 0;
	for(var i = 0; i < pts.length; i++){
		xTotal = xTotal + (xPos[i] * yPos[i+1]);
		yTotal = yTotal + (xPos[i+1] * yPos[i]);
	}
	return(xTotal - yTotal);
}
