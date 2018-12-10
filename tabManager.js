let OPEN_TABS = [];
let FILE_TYPES = [];

let tabClass = 'tab'; //CSS class for this tab
let selectedClass = 'selected'; //CSS class for this tab

let TAB_ELEMENT; //DOM element for this class

module.exports = class tabs{
    constructor(){
        TAB_ELEMENT = document.createElement('div');
        TAB_ELEMENT.setAttribute('id', 'tabs');
        TAB_ELEMENT.style.backgroundColor = '#53ffff';
        TAB_ELEMENT.style.width = '100%';
        TAB_ELEMENT.style.height = '100%';
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
        console.log("Opening:",filePath);
        if(!OPEN_TABS[filePath.node.title]) {//Not found
            let tab = document.createElement('div');
            tab.className += ' '+tabClass;
            tab.style.height = '100%';
            tab.style.position = 'absolute';
            tab.innerText = filePath.node.title;
            tab.addEventListener("click",() => {
                for(let openTab in OPEN_TABS){
                    OPEN_TABS[openTab].element.classList.remove(selectedClass);
                }
                tab.className += ' '+selectedClass;
                this.performCallbackForFileType(filePath.node.title);
            });
            TAB_ELEMENT.appendChild(tab);
            OPEN_TABS[filePath.node.title] = {
                element:tab,
                filePath:filePath.node.title
            };
        }
        for(let openTab in OPEN_TABS){
            OPEN_TABS[openTab].element.classList.remove(selectedClass);
        }
        (OPEN_TABS[filePath.node.title].element).className += ' '+selectedClass;
        this.resizeTabs();
        this.performCallbackForFileType(filePath.node.title);
    }

    getElement(){
        return TAB_ELEMENT;
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
}