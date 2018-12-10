let OPEN_FILES = [];

let tabClass = ''; //CSS class for this tab

let TAB_ELEMENT; //DOM element for this class

module.exports = class tabs{
    constructor(){
        TAB_ELEMENT = document.createElement('div');
        TAB_ELEMENT.style.backgroundColor = '#53ffff';
        TAB_ELEMENT.style.width = '100%';
        TAB_ELEMENT.style.height = '100%';
        TAB_ELEMENT.innerHTML = "<div id='tabs'> <ul> <li><a href='#tab1'>#1</a></li> </ul> <div id='tab1'></div> </div>";
    }

    //This lets you register a callback to trigger when a file of a specifc type is opened
    //Callback must contain {extension:"the file extension", callback:function()}
    registerFiletype(callback){

    }

    synchElement(){

    }

    openFile(filePath){
        console.log("Opening:",filePath);
    }

    getElement(){
        return TAB_ELEMENT;
    }
}