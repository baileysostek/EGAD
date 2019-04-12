const Widget = require('./widget');

let OPEN_TABS = [];
let FILE_TYPES = [];

let tabClass = 'tab'; //CSS class for this tab
let selectedClass = 'selected'; //CSS class for this tab

class tabWidget extends Widget{
    constructor(x, y, fileTreeWidget){
        super({
            name:"Canvas",
            col:x,
            row:y
        }, {
            tree:fileTreeWidget
        });

        //Pass to tree widgetf

        fileTreeWidget.subscribe((event, data)=>{
            console.log("Event:", event);
            console.log("Data:", data);
            this.openFile(data);
        });
    }

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

    postinit() {

    }

    //This lets you register a callback to trigger when a file of a specifc type is opened
    //Callback must contain {extension:"the file extension", callback:function()}
    registerFiletype(extension, callback){
        FILE_TYPES[extension] = {
            extension:extension,
            callback:callback
        }
    }

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

    getElement(){
        return this.element;
    }

    resizeTabs(){
        let index = 0;
        for(let openTab in OPEN_TABS){
            OPEN_TABS[openTab].element.style.width = (100.0 / Object.keys(OPEN_TABS).length) + '%';
            OPEN_TABS[openTab].element.style.left = ((100.0 / Object.keys(OPEN_TABS).length) * index) + '%';
            index++;
        }
    }

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

    getSelectedFilePath(){
        return this.selectedPath;
    }

    save() {
        return super.save();
    }
}
module.exports = tabWidget;