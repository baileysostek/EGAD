const electron = require('electron');
const url = require('url');
const path = require('path');


const {app, BrowserWindow, Menu} = electron;

let mainWindow;

// Listen for app to be ready;

app.on('ready', function(){
    //Create window
    mainWindow = new BrowserWindow({
        show:false
    });
    mainWindow.maximize();
    mainWindow.show();
    //Load html into the window

    //Building a url string the fancy way
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'editor.html'),
        protocol:'file:',
        slashes:true
    }));

    //Build Menu from template
    // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // //Insert the menu
    // Menu.setApplicationMenu(mainMenu);
});

//Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add Item'
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            },
        ]
    },
    {
        label:'Pile',
        submenu:[
            {
                label:'Add Item'
            },
            {
                label:'Click',
                click(){
                    console.log("Message2");
                }
            },
        ]
    }
];