//Initialize jquery and FancyTree
const jqueryUI = require('jquery-ui');
const fancyTree = require('jquery.fancytree');

//create references to subclasses so that we can interface with them.
//These are the modules that are loaded and specific to Perlenspeil IDE
let myFileManager;
let myGrid;

//Version number of this project.
let version = '1.0';

function init() {
    //Include all needed modules
    const grid              = require('./grid');
    const fileManager       = require('./fileManager');
    const fileBrowser       = require('./fileBrowser');
    const webviewWidget     = require('./webviewWidget');
    const transfromWidget   = require('./transformWidget');

    //Initialize the file manager, and load the configuration file.
    myFileManager = new fileManager();

    myFileManager.initialize().then(function(saveData) {
        //Print out version information and Author information.
        console.log("Electron Grid of Aligned Data (EGAD) Version:", version);
        console.log("Created by Bailey Sostek with the help of Professor Brian Moriarty (2018 - 2019)");

        //Initialize the Grid API with the screen width and height. This will create a responsive grid that can hold the rest of the editor elements.

        myGrid = new grid(screen.width, screen.height, 2, 1, saveData);
        myGrid.init([
            // new webviewWidget(0, 0, "http://users.wpi.edu/~bhsostek/CS4731/Project4/example.html"),
            // new webviewWidget(0, 1, "http://youtube.com"),
            // new webviewWidget(0, 2, "http://facebook.com"),
            // new webviewWidget(0, 3, "http://twitter.com"),
            // new webviewWidget(0, 0, "http://imgur.com"),
            // new fileBrowser(0, 0, "~Animations", myFileManager),
            // new fileBrowser(0, 1, "~Documentation", myFileManager),
            // new fileBrowser(0, 2, "~Font", myFileManager),
            // new fileBrowser(0, 3, "~Images", myFileManager),
            // new fileBrowser(0, 4, "~/jdk-11.0.1", myFileManager),
            // new fileBrowser(1, 0, "~Levels", myFileManager),
            // new fileBrowser(1, 1, "~Logs", myFileManager),
            // new fileBrowser(1, 2, "~Models", myFileManager),
            // new fileBrowser(1, 3, "~Natives", myFileManager),
            // new fileBrowser(1, 4, "~res", myFileManager),
            // new fileBrowser(2, 0, "~saves", myFileManager),
            // new fileBrowser(2, 1, "~Scripting", myFileManager),
            // new fileBrowser(2, 2, "~Shaders", myFileManager),
            // new fileBrowser(2, 3, "~Sounds", myFileManager),
            // new fileBrowser(2, 4, "~Web", myFileManager),
            // new fileBrowser(3, 0, "~", myFileManager),
            // new fileBrowser(3, 1, "~", myFileManager),
            // new fileBrowser(3, 2, "~", myFileManager),
            // new fileBrowser(3, 3, "~", myFileManager),
            // new fileBrowser(3, 4, "~", myFileManager),
            // new fileBrowser(4, 0, "~", myFileManager),
            // new fileBrowser(4, 1, "~", myFileManager),
            // new fileBrowser(4, 2, "~", myFileManager),
            // new fileBrowser(4, 3, "~", myFileManager),
            // new fileBrowser(4, 4, "~", myFileManager),
            // new transfromWidget(1,0),
            new transfromWidget(1,0),
            // new transfromWidget(1,0),
        ]);

    }, function(err) {
        console.error(err);
    });
}


/**
 * Callback function executed when the windows close button is pressed.
 * The code below is a blocking call that must terminate before the window can be closed.
 **/
function onCloseRequested(){
    myFileManager.writeToProperties('WIDTHS', myGrid.getGridSize());
}

/**
 * Function to execute when the open project option is selected from the menu.
 * @param {Object} path
 * @path is the relative path to the currently opened project. It is a stringified json object that must be
 **/
function open(path){

}

function save(){
    console.log(myGrid.generateSaveObject());
    myFileManager.writeToProperties('DATA', myGrid.generateSaveObject().data);
}

function copy(){

}

function paste(){

}

function suggest(){

}

function comment(){

}

function find(){

}

function replace(){

}

function getMenuData(){
    return this.mainMenuTemplate;
}

//Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Open Project',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click(){

                }
            }
        ]
    },
    {
        label:'Pile',
        submenu:[
            {
                label:'Open Project',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click(){

                }
            }
        ]
    },
    {
        label:'Smile',
        submenu:[
            {
                label:'Open Project',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click(){

                }
            }
        ]
    }
];
