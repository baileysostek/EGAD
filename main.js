const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

const MAIN_WEBPAGE = 'editor.html';

let mainWindow;

/**
 * Main entry point for the EGAD framework. This function creates a new webpage window inside of an electron window once it detects that the application is ready.
 * This function then creates a window the size of the target computers display and displays the contents of MAIN_WEBPAGE on the screen. Once the DOM of that webpage
 * is ready, the init function is called to start the application. This class also registers a callback for when the application is closed, and forwards this callback
 * to the file editor.js, by calling the 'onCloseRequested()' method.
 */
app.on('ready', function(){
    /**
     * Create a new Browser window to host the EGAD webpage.
     * @type {Electron.BrowserWindow}
     */
    mainWindow = new BrowserWindow({
        show:false
    });
    mainWindow.maximize();
    mainWindow.show();

    /**
     * Load the contents of the html file defined by 'MAIN_WEBPAGE' into the Electron window.
     */
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname, MAIN_WEBPAGE),
        protocol:'file:',
        slashes:true
    }));

    /**
     * Callback function which triggers when the dom is ready. This means that the file defined by 'MAIN_WEBPAGE' has been loaded into the window sucsessfully and we can start to
     */
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.executeJavaScript('console.log("Electron Grid of Aligned Data (EGAD) Version:", version); console.log("Created by Bailey Sostek with the help of Professor Brian Moriarty (2018 - 2019)");');
        mainWindow.webContents.executeJavaScript('init()');
        mainWindow.webContents.executeJavaScript('getMenu()').then((result) => {
            //Build Menu from template
            for(let i = 0; i < result.length; i++){
                if(result[i]['submenu']) {
                    for (let j = 0; j < result[i].submenu.length; j++) {
                        let menu_element = result[i].submenu[j];
                        if(menu_element['mainWindow_dot']) {//If the submenu element was specified
                            console.log("Overwriting Click Function for:",menu_element.label);
                            result[i].submenu[j] = {
                                label: menu_element['label'],
                                accelerator: menu_element['accelerator'],
                                click(){
                                    eval("mainWindow."+menu_element['mainWindow_dot']+"()");
                                }
                            };
                        }
                        if(menu_element['app_dot']) {
                            console.log("Overwriting Click Function for:",menu_element.label);
                            result[i].submenu[j] = {
                                label: menu_element['label'],
                                accelerator: menu_element['accelerator'],
                                click(){
                                    eval("app."+menu_element['app_dot']+"()");
                                }
                            };
                        }
                        if(menu_element['this_dot']) {
                            console.log("Overwriting Click Function for:",menu_element.label);
                            result[i].submenu[j] = {
                                label: menu_element['label'],
                                accelerator: menu_element['accelerator'],
                                click(){
                                    eval("mainWindow.webContents.executeJavaScript(\'"+menu_element['this_dot']+"()\');");
                                }
                            };
                        }
                    }
                }
            }
            const mainMenu = Menu.buildFromTemplate(result);

            //Insert the menu
            Menu.setApplicationMenu(mainMenu);
        });
    });

    mainWindow.on('close', (e) => {
        mainWindow.webContents.executeJavaScript('onCloseRequested()');
    });

});