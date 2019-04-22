//This is an object that represents the file dropdown menu for this application, customise it fit your applications specific needs.
let MENU = [];

class menuBuilder{
    /**
     * Creates a menuBuilder. This class provides utilites which helps a user build a menu bar for their application
     * @constructor
     * @class
     */
    constructor(){

    }

    /**
     * This function is simply a getter for this classes MENU object. The MENU object hold all configuration data needed to create the menu at the top of the window.
     * @return{Object} An object representing all menu tabs, and their sub functions.
     **/
    getMenu(){
        return MENU;
    }

    /**
     * This function will create a new tab in the menu, such as File, Edit, Project... etc.
     * @param {String} name
     * @name is the title of the new tab bar that you want to create. For Example, if your project requires a tab in the menu called 'Projects' call this function with the string 'Projects'
     * @return{Object} a reference to the JSON object representing this menu tab.
     **/
    addMenuDropDown(name){
        let drop_down = this.findMenuDropDown(name);
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

    /**
     * This function allows a user to create menu elements to trigger events on the Electron BrowserWindow object defined in app.js.
     * @param menu - The tab of the menu to add this functionality to.
     * @param name - The name of this event
     * @param character - The character to associate this functionality with, Example S for save would map the hotkey ctrl+S to this function.
     * @param function_name - The textual name of the function to call on the BrowserWindow object. Example, 'toggleDevTools' will open the devTools.
     */
    registerWindowCallback(menu, name, character, function_name){
        menu.submenu.push(
            {
                label:name,
                accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
                mainWindow_dot:function_name
            }
        );
    }

    /**
     * This function allows a user to create menu elements to trigger events on the main electron app object.
     * @param menu - The tab of the menu to add this functionality to.
     * @param name - The name of this event
     * @param character - The character to associate this functionality with, Example S for save would map the hotkey ctrl+S to this function.
     * @param function_name - The textual name of the function to call on the app. Example, 'quit' will call app.quit() to close the application.
     */
    registerAppCallback(menu, name, character, function_name){
        menu.submenu.push(
            {
                label:name,
                accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
                app_dot:function_name
            }
        );
    }

    /**
     * This function allows a user to create menu elements to trigger events on the editor.js class.
     * @param menu - The tab of the menu to add this functionality to.
     * @param name - The name of this event
     * @param character - The character to associate this functionality with, Example S for save would map the hotkey ctrl+S to this function.
     * @param function_name - The textual name of the function to call on the editor.js object. Example, 'save' will call the editor.save() function.
     */
    registerFunctionCallback(menu, name, character, function_name){
        menu.submenu.push(
            {
                label:name,
                accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
                this_dot:function_name
            }
        );
    }

    /**
     * This function creates a new drop down tab on the menu. Example, 'file' will create a new tab called 'file'
     * @param name - The name of the tab to add to the menyu.
     * @return {*} Returns a reference to the menu object [name] this object is passed into the registerCallback functions to correctly add functionality to tabs.
     */
    findMenuDropDown(name) {
        for (let i = 0; i < MENU.length; i++) {
            if (MENU[i].label === name) {
                return MENU[i];
            }
        }
        return false;
    }
};

module.exports = menuBuilder;