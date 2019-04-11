//This is an object that represents the file dropdown menu for this application, customise it fit your applications specific needs.
let MENU = [];

class menuBuilder{
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

    registerWindowCallback(menu, name, character, function_name){
        menu.submenu.push(
            {
                label:name,
                accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
                mainWindow_dot:function_name
            }
        );
    }

    registerAppCallback(menu, name, character, function_name){
        menu.submenu.push(
            {
                label:name,
                accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
                app_dot:function_name
            }
        );
    }

    registerFunctionCallback(menu, name, character, function_name){
        menu.submenu.push(
            {
                label:name,
                accelerator: process.platform == 'darwin' ? 'Command+'+character : 'Ctrl+'+character,
                this_dot:function_name
            }
        );
    }

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