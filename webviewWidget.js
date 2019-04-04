const Widget = require('./widget');

class WebviewWidget extends Widget{
    constructor(x, y, url){
        super({name:"Web View", col:x, row:y, url:url}, {});
    }

    async init(){
        return await new Promise((resolve, reject) => {
            this.element = document.createElement("webview");
            this.element.setAttribute("src", this.configData.url);
;           resolve(this);
        });
    }


    postinit(){
        //Set height correctly
        this.element.style.height = 100+'%';
        this.element.parentElement.style.height = 100+'%';
        this.element.ondragstart = function () {
            return false;
        };
        this.element.ondragenter = function () {
            return false;
        };
        this.element.ondragover = function () {
            return false;
        };
        this.element.ondrag = function () {
            return false;
        };
    }


};

module.exports = WebviewWidget;