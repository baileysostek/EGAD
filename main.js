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

    mainWindow.on('close', function(e){
        mainWindow.webContents.executeJavaScript('onCloseRequested()');
        // var choice = require('electron').dialog.showMessageBox(this,
        //     {
        //         type: 'question',
        //         buttons: ['Yes', 'No'],
        //         title: 'Confirm',
        //         message: 'Are you sure you want to quit?'
        //     });
        // if(choice == 1){
        //     e.preventDefault();
        // }
    });

    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert the menu
    Menu.setApplicationMenu(mainMenu);
});

//Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Open Project',
                click(){
                    const {dialog} = require('electron')
                    console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}));
                }
            },
            {
                label:'New Project',
                click(){

                }
            },
            {
                label:'Recent Projects',
                click(){

                }
            },
            {
                label:'Developer Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(){
                    mainWindow.toggleDevTools();
                }
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
        label:'Project',
        submenu:[
            {
                label:'Save',
                accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click(){
                    mainWindow.webContents.executeJavaScript('save()');
                }
            },
            {
                label:'Add File'
            },
            {
                label:'Change Theme',
                click(){
                    console.log("Message2");
                }
            },
            {
                label:'Change Language',
                click(){
                    console.log("Message2");
                }
            }
        ]
    }
];