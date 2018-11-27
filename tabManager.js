let OPEN_FILES = [];

let tabClass = ''; //CSS class for this tab

let TAB_ELEMENT; //DOM element for this class

module.exports = class tabs{
    constructor(){
        TAB_ELEMENT = document.createElement('div');
        TAB_ELEMENT.style.backgroundColor = '#53ffff';
        TAB_ELEMENT.style.width = '100%';
        TAB_ELEMENT.style.height = '100%';
    }

    synchElement(){

    }

    openFile(){

    }

    getElement(){
        return TAB_ELEMENT;
    }
}