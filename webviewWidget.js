const Widget = require('./widget');

class WebviewWidget extends Widget{
    constructor(x, y, url){
        super({name:"Web View", col:x, row:y, url:url}, {});
    }

    async init(){
        return await new Promise((resolve, reject) => {
            this.element = document.createElement("webview");
            this.element.setAttribute("src", this.configData.url);
            resolve(this);
        });
    }


};

module.exports = WebviewWidget;