//Config data passed into this object
let configData = {};
//A map of other Widgets that this object needs.
let dependencies = {};
//If this Widget has been initialized yet.
let isLoaded = false;
//The dom element for this widget.
let element;

//The textual name of this widget
let name = 'EmptyWidget';
//the x index of this widget.
let colIndex = 0;
//the y index of this widget.
let rowIndex = 0;
/**
 * There is a collection of built in widgets tailored to making editor applications.
 * <pre>
 *      {@link FileBrowser} for information on built in widgets and how to create your own.
 */
class Widget{
    /**
     * The Widget class takes in configData about where to position this widget in the grid, as well as a list of dependencies.
     * @param {Object} configData - This is an object of config data, It will have the following fields as well as any custom fields that child classes require.
     * @param {String} configData.name - This is the name of this widget.
     * @param {Integer} configData.col - This is the Column that this widget should be added to.
     * @param {Integer} configData.row - This is the row of of the Column that this widget should be added to.
     * @param {Object} dependencies - This is a map of String Names to Widgets which this object relies on.
     * @constructor
     * @abstract
     * @returns {Widget} Returns an instance of the Widget class.
     */
    constructor(configData, dependencies){
        this.configData = configData;
        if(configData['name']){
            this.name = configData.name;
        }
        if(configData['col']){
            this.colIndex = configData.col;
        }
        if(configData['row']){
            this.rowIndex = configData.row;
        }
        configData['init_order'] = 0;
        this.dependencies = dependencies;

        this['save'] = this.save;
    }
    /**
     * This function is implemented by every child class of widget. Any initialization that needs to happen will be put inside of this function.
     * @abstract
     * @returns {Promise} Returns a promise that will be executed when an instance of this widget is generated.
     */
    init(savedData){
        console.log("Initing superclass, this should not be called, and rather return a promise from a child class.");
    }

    postinit(){
        console.log("added " + this.name + " to DOM.");
    }

    generateSaveObject(){
        return configData;
    }

    /**
     * Set the dom element that represents this widget.
     * @param {Element} element - The dom object for this widget.
     */
    setElement(element){
        if(this.element){
            this.element.remove();
        }
        this.element = element;
    }

    /**
     * Get the dom element that represents this widget.
     * @returns {Element} element - The dom object for this widget.
     */
    getElement(){
        return this.element;
    }

    /**
     * Get the position in columns(Left = 0 to Right = n) of this widget.
     * @returns {Integer} colIndex - The column index of this Widget.
     */
    getCol(){
        return this.colIndex;
    }

    /**
     * Get the position in rows(Top = 0 to Bottom = n) of this widget.
     * @returns {Integer} rowIndex - The row index of this Widget.
     */
    getRow(){
        return this.rowIndex;
    }

    getConfigData(){
        return this.configData;
    }

    save(){
        return {
            message:"This is the parent save call, please overwrite me.",
            configData:this.configData
        };
    }
}

module.exports = Widget;