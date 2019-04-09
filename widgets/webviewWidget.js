const Widget = require('./widget');

class WebviewWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} url - This is the Column that this widget should be added to.
     * @returns {WebviewWidget} Returns a WebviewWidget, an instance of the Widget class which allows a user to display a remote webpage, or a local html file.
     */
    constructor(x, y, url){
        super({name:"Web View", col:x, row:y, url:url}, {});
    }

    async init(){
        return await new Promise((resolve, reject) => {
            if(navigator.onLine || !this.configData.url.includes('http:')) {
                this.element = document.createElement("webview");
                this.element.setAttribute("src", this.configData.url);
                resolve(this);
            }else{
                //Offline, so show a grey screen
                this.element = document.createElement("div");
                this.element.style.backgroundColor = '#343434';
                this.element.innerHTML = "<h1>Not Connected to Internet!</h1>"
                resolve(this);
            }
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