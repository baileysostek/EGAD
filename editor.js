//Initialize jquery and FancyTree
const jqueryUI = require('jquery-ui');
const fancyTree = require('jquery.fancytree');

//create references to subclasses so that we can interface with them.
//These are the modules that are loaded and specific to Perlenspeil IDE
let myFileManager;
let myGrid;

//Version number of this project.
const version = '1.0';

//---------------------------------------------------------------------------
//     Include all widget classes to be referenced by the grid here.
//---------------------------------------------------------------------------
const grid              = require('./grid/grid');
const fileManager       = require('./util/fileManager');
const fileBrowser       = require('./widgets/fileTreeWidget');
const webviewWidget     = require('./widgets/webviewWidget');
const transfromWidget   = require('./widgets/transformWidget');
const canvasWidget      = require('./widgets/canvasWidget');
const consoleWidget     = require('./widgets/consoleWidget');
const codeEditorWidget  = require('./widgets/codeEditorWidget');
const tabWidget         = require('./widgets/tabWidget');

//---------------------------------------------------------------------------
//                    Include Utility Classes here
//---------------------------------------------------------------------------
const menuBuilder       = require('./util/menuBuilder');
//Initialize the menu here.
let menu = new menuBuilder();

/**
 * The init function is executed by the main.js file after the Electron BrowserWindow hosting this file has finished initializing.
 **/
function init() {

    //---------------------------------------------------------------------------
    //                              Build Menu here
    //---------------------------------------------------------------------------
    // let file_dd = menu.addMenuDropDown("File");
    // menu.registerAppCallback(file_dd, 'Quit', 'Q', 'quit');
    // menu.registerFunctionCallback(file_dd, 'Save', 'S', 'save');
    // menu.registerFunctionCallback(file_dd, 'New', '=', 'newWidget');
    // menu.registerFunctionCallback(file_dd, 'Remove', '-', 'removeWidget');
    // menu.registerWindowCallback(file_dd, 'Developer Console', 'I', 'toggleDevTools');
    // let help_dd = menu.addMenuDropDown("Help");
    // let test_dd = menu.addMenuDropDown("Test");
    // let project_dd = menu.addMenuDropDown("Project");


    //Initialize the file manager, and load the configuration file.
    myFileManager = new fileManager();

    //---------------------------------------------------------------------------
    // Initialize the File Manager, when this function returns create your grid
    //---------------------------------------------------------------------------
    myFileManager.initialize().then(function(saveData) {
        //Initialize the Grid API with the screen width and height. This will create a responsive grid that will hold all of your widget elements.

        // myGrid = new grid(screen.width, screen.height, 3, 1, saveData);
        // let fileTree = new fileBrowser(1, 0, "", myFileManager, {});
        // let dev_console =  new consoleWidget(0,0);
        // dev_console.subscribe((message) => {
        //     dev_console.log(message);
        // });
        // myGrid.init([
        //     fileTree,
        //     dev_console,
        //     new transfromWidget(1, 0),
        //     new canvasWidget( 2, 0, screen.width, screen.height)
        // ]);

        // myGrid = new grid(screen.width, screen.height, 1, 1, saveData);
        // myGrid.init([
        //     new webviewWidget(0, 0, "root/webviewExample/game.html"),
        // ]);

        myGrid = new grid(screen.width, screen.height, 5, 5, saveData);
        myGrid.init([
            new webviewWidget(0, 0, "root/documentation/index.html"),
            new webviewWidget(0, 0, "http://imgur.com"),
            new fileBrowser(1, 0, "~", myFileManager, ['*.json']),//Brows the root directory
            new fileBrowser(0, 1, "", myFileManager),
            new fileBrowser(0, 2, "", myFileManager),
            new fileBrowser(0, 3, "", myFileManager),
            new fileBrowser(0, 4, "", myFileManager),
            new fileBrowser(1, 0, "", myFileManager),
            new fileBrowser(1, 1, "", myFileManager),
            new fileBrowser(1, 2, "", myFileManager),
            new fileBrowser(1, 3, "", myFileManager),
            new fileBrowser(1, 4, "", myFileManager),
            new fileBrowser(2, 0, "", myFileManager),
            new fileBrowser(2, 1, "", myFileManager),
            new fileBrowser(2, 2, "", myFileManager),
            new fileBrowser(2, 3, "", myFileManager),
            new fileBrowser(2, 4, "", myFileManager),
            new fileBrowser(3, 0, "", myFileManager),
            new fileBrowser(3, 1, "", myFileManager),
            new fileBrowser(3, 2, "", myFileManager),
            new fileBrowser(3, 3, "", myFileManager),
            new fileBrowser(3, 4, "", myFileManager),
            new fileBrowser(4, 0, "", myFileManager),
            new fileBrowser(4, 1, "", myFileManager),
            new fileBrowser(4, 2, "", myFileManager),
            new fileBrowser(4, 3, "", myFileManager),
            new fileBrowser(4, 4, "", myFileManager),
            new transfromWidget(1,0),
            new transfromWidget(1,0),
            new transfromWidget(1,0),
        ]);

    }, function(err) {
        //If there was an error initializing the grid, print the error here.
        console.error(err);
    });
}


//---------------------------------------------------------------------------
//     Define helper functions needed by your application here
//---------------------------------------------------------------------------

function save(){//This function is refrenced by the menu on line #37 'registerFunctionCallback(file_dd, 'Save', 'S', 'save');' The last parameter with the string 'save' is a reference to this function.
    // myGrid.setWidget(0,0, new transfromWidget(0,0));
    let saveData = myGrid.generateSaveObject().data;
    console.log("SaveData",saveData);
    myFileManager.writeToProperties('DATA', saveData);
}

function newWidget(){

}

function removeWidget() {

}


//---------------------------------------------------------------------------
//
//---------------------------------------------------------------------------

function getMenu () {
    return menu.getMenu();
}

/**
 * Callback function executed when the window's close button is pressed.
 * The code below is a blocking call that must terminate before the window can be closed.
 **/
function onCloseRequested(){
    save();
}