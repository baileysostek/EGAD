const Widget = require('./widget');

class WebviewWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} x - the Column to add this widget to.
     * @param {Integer} y - the Row to add this widget to.
     * @param {String} url - This is the URL of the document to display in a webview. It can be remote or a local path.
     * @returns {WebviewWidget} Returns a WebviewWidget, an instance of the Widget class which allows a user to display a remote webpage, or a local html file.
     */
    constructor(x, y, url){
        super({name:"Web View", col:x, row:y, url:url}, {});
    }

    /**
     * This function overrides the parent widget initialization call and creates a webview element with the desired document displayed inside.
     * @return {Promise<any>}
     */
    async init(){
        return await new Promise((resolve, reject) => {
            if(navigator.onLine || !this.configData.url.includes('http:')) {
                this.element = document.createElement("webview");
                this.element.setAttribute("src", this.configData.url);
                this.element.addEventListener('dom-ready', resolve(this));
                this.element.addEventListener('did-fail-load', reject(this));
            }else{
                //Offline, so show a grey screen
                this.element = document.createElement("div");
                this.element.style.backgroundColor = '#343434';
                this.element.innerHTML = "<h1>Not Connected to Internet!</h1>"
                resolve(this);
            }
        });
    }

    /**
     * This function is called after initialization has occurred on this widget, by this time all fields this widget references should be initialized.
     */
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


    /**
     * This function reloads the body of the WebView, it is the same as if you refreshed a webpage in a traditional browser.
     */
    reload(){
        this.element.reload();
    }

    executeJavaScript(code, ){
        this.element.executeJavaScript();
    }

};

module.exports = WebviewWidget;