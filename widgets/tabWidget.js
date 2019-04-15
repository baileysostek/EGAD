const Widget = require('./widget');

let OPEN_TABS = [];
let FILE_TYPES = [];

let tabClass = 'tab'; //CSS class for this tab
let selectedClass = 'selected'; //CSS class for this tab

class tabWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} x - This is the Column that this widget should be added to.
     * @param {Integer} y - This is the row of of the Column that this widget should be added to.
     * @param {FileTreeWidget} fileTreeWidget - Reference to a FileTree.
     * @returns {canvasWidget} Returns a tabWidget, an instance of the Widget class which creates a new tab every time a file in the file tree is double clicked on.
     */
    constructor(x, y, fileTreeWidget){
        super({
            name:"Canvas",
            col:x,
            row:y
        }, {
            tree:fileTreeWidget
        });

        //Add a subscriber to the passed fileTree
        fileTreeWidget.subscribe((event, data)=>{
            console.log("Event:", event);
            console.log("Data:", data);
            this.openFile(data);
        });
    }

    /** This function overrides the parent widget initialize function and creates a tab bar to be displayed within this widget.
     * @return {Promise<any>}
     */
    async init(){
        return await new Promise((resolve, reject) => {
            this.element = document.createElement('div');
            this.element.setAttribute('id', 'tabs');
            this.element.style.backgroundColor = '#53ffff';
            this.element.style.width = '100%';
            this.element.style.height = '100%';

            resolve(this);
        });
    }


    /**
     * This lets you register a callback to trigger when a file of a specifc type is opened Callback must contain {extension:"the file extension", callback:function()}
     * @param {String} extension - This is the file extension that you want to register a callback for, ie '.png'
     * @param {Function} callback - This is the function you want to execute when a file of type 'extension' is clicked on.
     */
    registerFiletype(extension, callback){
        FILE_TYPES[extension] = {
            extension:extension,
            callback:callback
        }
    }

    /**
     * This function takes a filePath, and adds a new tab to the tab bar, as well as calls the callback function defined for this file type if it is known.
     * @param {String} filePath - The Path to a file to open. Perform the callback function registered for this file type.
     */
    openFile(filePath){
        if(filePath.node.folder){ //Do not open a tab for a folder
            return;
        }
        console.log("Opening:",filePath);
        let pathName = this.getPath(filePath.node);
        this.selectedPath = pathName;
        if(!OPEN_TABS[pathName]) {//Not found
            let tab = document.createElement('div');
            tab.className += ' '+tabClass;
            tab.style.height = '100%';
            tab.style.position = 'absolute';
            tab.innerText = pathName;
            tab.addEventListener("click",() => {
                for(let openTab in OPEN_TABS){
                    OPEN_TABS[openTab].element.classList.remove(selectedClass);
                }
                tab.className += ' '+selectedClass;
                this.performCallbackForFileType(pathName);
            });
            this.element.appendChild(tab);
            OPEN_TABS[pathName] = {
                element:tab,
                filePath:pathName
            };
        }
        for(let openTab in OPEN_TABS){
            OPEN_TABS[openTab].element.classList.remove(selectedClass);
        }
        (OPEN_TABS[pathName].element).className += ' '+selectedClass;
        this.resizeTabs();
        this.performCallbackForFileType(pathName);
    }

    /**
     * Getter for this widgets tab element. Used to append child nodes to the base tab bar element.
     * @return {HTMLElement | *}
     */
    getElement(){
        return this.element;
    }

    /**
     * This function is called whenever this widget is resized, it will automatically set each widget to be the correct size.
     */
    resizeTabs(){
        let index = 0;
        for(let openTab in OPEN_TABS){
            OPEN_TABS[openTab].element.style.width = (100.0 / Object.keys(OPEN_TABS).length) + '%';
            OPEN_TABS[openTab].element.style.left = ((100.0 / Object.keys(OPEN_TABS).length) * index) + '%';
            index++;
        }
    }

    /**
     *  This function determines if any callbacks for the passed file extension are known. If they are known they will be performed.
     * @param {String} title - This is the name of a file. The file extension is stripped from the file.
     */
    performCallbackForFileType(title) {
        if(title.includes(".")){ //This is not a directory
            let extension = title.split('.')[1];
            for(let fileType in FILE_TYPES){
                if(fileType.includes(extension)){
                    //print the file type
                    console.log(title+" is a "+fileType+" file.");
                    //Execute the callback
                    FILE_TYPES[fileType].callback(title);
                }
            }
        }else{
            //is directory
        }
    }

    /**
     * This function is used to get an absolute path for a specific file from a FancyTree node element.
     * @param {FancytreeNode} node - This is a fancy tree node, a path is generated from this call.
     * @return {String} The file path to the root directory of this node.
     */
    getPath(node){
        if(node.parent){
            if(node.parent.title === 'root'){
                return node.title;
            }
            return (this.getPath(node.parent) +'/'+ node.title);
        }else{
            return node.title;
        }
    }

    /**
     * This is simply a wrapper to the parent widget save function.
     * @return {{configData, message}}
     */
    save() {
        return super.save();
    }
}
module.exports = tabWidget;