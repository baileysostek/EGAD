const Widget = require('./widget');
let observers = [];
let fileManager;

class FileTreeWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} x - This is the Column that this widget should be added to.
     * @param {Integer} y - This is the row of of the Column that this widget should be added to.
     * @param {String} path - This is a string representing the path to the directory this file tree should display. Paths relative to the root folder are denoted with '~/folderName'.
     * @param {FileManager} fileManager - This is a reference to the fileManager class which provides this widget with access to the computers File System.
     * @returns {FileTreeWidget} Returns a FileTreeWidget, an instance of the Widget class.
     */
    constructor(x, y, path, fileManager, ignore = {}){
        super({
            name:"File Browser",
            col:x,
            row:y,
            path:path,
            ignore:ignore
        },
        {});
        this.fileManager = fileManager;
    }

    /**
     * This function recursively opens subdirectories from the given path, and then produces a file-tree object
     * to be displayed within this file browser widget.
     * @returns {Promise} Returns an asynchronous promise that will resolve on tree generation.
     */
    async init(){
        return await new Promise(async (resolve, reject) => {
            this.fileManager.getProjectFiles(this.translateRelative(),  this.configData['ignore']).then(async (result) => {
                let elm = document.createElement('div');
                await setTimeout(() => {
                    // console.log("result:",JSON.stringify(result));
                    $(elm).fancytree({
                        checkbox: false,
                        selectMode: 3,
                        source: {children:result},
                        activate: function(event, data) {
                            $("#statusLine").text(event.type + ": " + data.node);
                        },
                        select: function(event, data) {
                            $("#statusLine").text(
                                event.type + ": " + data.node.isSelected() + " " + data.node
                            );

                        },
                        dblclick:(event, data) => {
                           this.doubleClick(event, data);
                        },
                    });
                    this.isLoaded = true;
                }, 0);
                super.setElement(elm);
                resolve(this);
            }, function(err) {
                reject(err);
            });
        });
    }

    /**
     * This function converts the '~' character into a path to the fileManger.PATH value. This value can be configured in the fileManager configuration file, therefore ~ will always point to that variable.
     * This allows users to use realtive pathing by simply putting '~' in front of their path.
     * @returns {String} Returns the path to a folder relative to root.
     */
    translateRelative(){
        if(this.configData['path'].startsWith('~')) {
            this.configData['path'] = this.configData['path'].replace('~', this.fileManager.PATH);
        }
        console.log("Path:", this.configData['path']);
        return this.configData['path'];
    }

    /**
     * This function is the callback method injected into this fileTreeWidget. Whenever a user double clicks on a file inside of the file tree, this function is called. This function should be modified to a specific developers needs.
     * @param {Object} event - The event object contains information about what node was clicked as well as the specific DOM element that was interacted with.
     * @param {Object} data - Data holds all of the data for that FileTree node.
     */
    doubleClick(event, data){
        for(let observer_key in observers){
            let observer = observers[observer_key];
            observer(event, data);
        }
    }

    subscribe(observer){
        observers.push(observer);
    }
};

module.exports = FileTreeWidget;
