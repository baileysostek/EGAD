const Widget = require('./widget');

class codeMirrorWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} url - This is the Column that this widget should be added to.
     * @returns {WebviewWidget} Returns a WebviewWidget, an instance of the Widget class which allows a user to display a remote webpage, or a local html file.
     */
    constructor(x, y,language){
        super({
            name:"CodeMirror",
            col:x,
            row:y,
            language:language,
            value:'\n\n\n\n\n\n'
        }, {});
    }

    async init(configData){
        return await new Promise((resolve, reject) => {
            console.log("Passed:",configData);
            //Load the data passed into this function, and set the sliders correctly
            if(configData['language']){
                this.getConfigData()['language'] = configData['language'];
            }
            if(configData['value']){
                this.getConfigData()['value'] = configData['value'];
            }
            //Create the Editor and set up preliminary configuration data.
            this.element = document.createElement('div');
            this.element.setAttribute('id', 'editor');
            this['editor'] = CodeMirror(this.element, {
                mode: this.getConfigData()['language'],
                theme: "darcula",
                autofocus:true,
                lineNumbers: true,
                autoCloseBrackets: true,
                autoMatchBrackets: true,
                value:this.getConfigData()['value'],
                gutters: ["CodeMirror-linenumbers", "breakpoints"],
            });
            this.editor.setSize('auto', 'auto');
            this.editor.refresh();
            resolve(this);
        });
    }


    postinit(){
        this.editor.setSize('auto', 'auto');
        this.editor.refresh();
    }

    save(){
        return {
            language:super.getConfigData()['language'],
            value:this.editor.getValue()
        };
    }

};

module.exports = codeMirrorWidget;