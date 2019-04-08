//Initialize jquery and FancyTree
const jqueryUI = require('jquery-ui');
const fancyTree = require('jquery.fancytree');

//create references to subclasses so that we can interface with them.
//These are the modules that are loaded and specific to Perlenspeil IDE
let myFileManager;
let myGrid;

//This is an object that represents the file dropdown menu for this application, customise it fit your applications specific needs.
let MENU = [];

//Version number of this project.
const version = '1.0';

//---------------------------------------------------------------------------
//     Include all widget classes to be referenced by the grid here.
//---------------------------------------------------------------------------
const grid              = require('./grid');
const fileManager       = require('./fileManager');
const fileBrowser       = require('./fileBrowser');
const webviewWidget     = require('./webviewWidget');
const transfromWidget   = require('./transformWidget');
const canvasWidget      = require('./canvasWidget');

/**
 * The init function is executed by the main.js file after the Electron BrowserWindow hosting this file has finished initializing.
 **/
function init() {

    //---------------------------------------------------------------------------
    //                              Build Menu here
    //---------------------------------------------------------------------------
    let file_dd = addMenuDropDown("File");
    registerAppCallback(file_dd, 'Quit', 'Q', 'quit');
    registerFunctionCallback(file_dd, 'Save', 'S', 'save');
    registerFunctionCallback(file_dd, 'New', 'N', 'newWidget');
    registerWindowCallback(file_dd, 'Developer Console', 'I', 'toggleDevTools');
    let help_dd = addMenuDropDown("Help");
    let test_dd = addMenuDropDown("Test");
    let project_dd = addMenuDropDown("Project");


    //Initialize the file manager, and load the configuration file.
    myFileManager = new fileManager();

    //---------------------------------------------------------------------------
    // Initialize the File Manager, when this function returns create your grid
    //---------------------------------------------------------------------------
    myFileManager.initialize().then(function(saveData) {
        //Initialize the Grid API with the screen width and height. This will create a responsive grid that will hold all of your widget elements.

        myGrid = new grid(screen.width, screen.height, 2, 1, saveData);
        myGrid.init([
            // new canvasWidget(0, 0, screen.width, screen.height),
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
    console.log(myGrid.getCell(1,1));
    myFileManager.writeToProperties('DATA', myGrid.generateSaveObject().data);
}

function newWidget(){
    myGrid.addWidget(new transfromWidget(1,0));
}


//---------------------------------------------------------------------------
//
//---------------------------------------------------------------------------


/**
 * Callback function executed when the window's close button is pressed.
 * The code below is a blocking call that must terminate before the window can be closed.
 **/
function onCloseRequested(){
    myFileManager.writeToProperties('WIDTHS', myGrid.getGridSize());
}

/**
 * This function is simply a getter for this classes MENU object. The MENU object hold all configuration data needed to create the menu at the top of the window.
 * @return{Object} An object representing all menu tabs, and their sub functions.
 **/
function getMenu(){
    return MENU;
}

/**
 * This function will create a new tab in the menu, such as File, Edit, Project... etc.
 * @param {String} name
 * @name is the title of the new tab bar that you want to create. For Example, if your project requires a tab in the menu called 'Projects' call this function with the string 'Projects'
 * @return{Object} a reference to the JSON object representing this menu tab.
 **/
function addMenuDropDown(name){
    let drop_down = findMenuDropDown(name);
    if(!drop_down) {
        let new_menu = {
            label: name,
            submenu: []
        };
        MENU.push(new_menu);
        return new_menu;
    }
    return drop_down;
}

function registerWindowCallback(menu, name, character, function_name){
    menu.submenu.push(
        {
            label:name,
            accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
            mainWindow_dot:function_name
        }
    );
}

function registerAppCallback(menu, name, character, function_name){
    menu.submenu.push(
        {
            label:name,
            accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
            app_dot:function_name
        }
    );
}

function registerFunctionCallback(menu, name, character, function_name){
    menu.submenu.push(
        {
            label:name,
            accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
            this_dot:function_name
        }
    );
}

function findMenuDropDown(name){
    for(let i = 0; i < MENU.length; i++){
        if(MENU[i].label === name){
            return MENU[i];
        }
    }
    return false;
}