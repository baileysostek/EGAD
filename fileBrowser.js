const Widget = require('./widget');
let fileManager;

class FileBrowser extends Widget{
    /**
     * @constructor
     * @augments Widget
     * @param {Integer} x - This is the Column that this widget should be added to.
     * @param {Integer} y - This is the row of of the Column that this widget should be added to.
     * @param {FileManager} fileManager - This is a reference to the fileManager class.
     * @returns {FileBrowser} Returns a FileBrowser, an instance of the Widget class.
     */
    constructor(x, y, path, fileManager){
        super({name:"File Browser", col:x, row:y, path:path}, {});
        this.fileManager = fileManager;
    }

    /**
     * This function recursively opens subdirectories from the given path, and then produces a file-tree object
     * to be displayed within this file browser widget.
     * @abstract
     * @returns {Promise} Returns an asynchronous promise that will resolve on tree generation.
     */
    async init(){
        return await new Promise(async (resolve, reject) => {
            this.fileManager.getProjectFiles(this.translateRelative()).then(async (result) => {
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

    translateRelative(){
        if(this.configData['path'].startsWith('~')) {
            this.configData['path'] = this.configData['path'].replace('~', this.fileManager.PATH);
        }
        console.log("Path:", this.configData['path']);
        return this.configData['path'];
    }

    doubleClick(event, data){
        console.log("Event:", event);
        console.log("Data:", data)
    }
};

module.exports = FileBrowser;
