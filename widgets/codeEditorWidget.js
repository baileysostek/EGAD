const Widget = require('./widget');

class codeEditorWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} x - This is the Column that this widget should be added to.
     * @param {Integer} y - This is the row of of the Column that this widget should be added to.
     * @param {String} language - This is the language that CodeMirror should target when formatting the contents of this widget.
     * @param {String} [theme=darcula] - CodeMirror theme to use when formatting this editor. Any theme in the 'node_modules/codemirror/theme/' directory will work. Just pass the name of the css file and this does the rest.
     * @returns {WebviewWidget} Returns a WebviewWidget, an instance of the Widget class which allows a user to display a remote webpage, or a local html file.
     */
    constructor(x, y,language, theme = 'darcula'){
        super({
            name:"CodeMirror",
            col:x,
            row:y,
            language:language,
            value:'\n\n\n\n\n\n',
            theme:theme
        }, {});
    }

    /**
     * This function overrides the parent widget initialize function and creates a code editor to be displayed within this widget.
     * @param {Object} configData - This object contains important information about the state that this widget was in the last time the application closed. The exact value inside of the widget is passed back into it here. This object also contains information about what language this editor is editing.
     * @return {Promise<any>}
     */
    async init(configData){
        return await new Promise((resolve, reject) => {
            //Load the data passed into this function, and set the sliders correctly
            if(configData['language']){
                this.getConfigData()['language'] = configData['language'];
            }
            if(configData['value']){
                this.getConfigData()['value'] = configData['value'];
            }

            //CSS information
            let theme_css = document.createElement('link');
            theme_css.setAttribute('rel', 'stylesheet');
            theme_css.setAttribute('type', 'text/css');
            if(configData['theme']){
                this.getConfigData()['theme'] = configData['theme'];
                theme_css.setAttribute('href', 'node_modules/codemirror/theme/'+this.getConfigData()['theme']+'.css');
            }else{
                //Defualt to darcula
                this.getConfigData()['theme'] = 'darcula';
                theme_css.setAttribute('href', 'node_modules/codemirror/theme/darcula.css');
            }


            //Create the Editor and set up preliminary configuration data.
            this.element = document.createElement('div');
            this.element.appendChild(theme_css);
            this.element.setAttribute('id', 'editor');
            this['editor'] = CodeMirror(this.element, {
                mode: this.getConfigData()['language'],
                theme: this.getConfigData()['theme'],
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


    /**
     * This function is called after initialization has occurred on this widget, by this time all fields this widget references should be initialized.
     */
    postinit(){
        this.editor.setSize('auto', 'auto');
        this.editor.refresh();
    }

    /**
     * This function overrides the parent widget save function. The save object returned contians the language, theme, and content of the code editor.
     * @return {{language: *, theme: *, value: (*|*|*|string)}}
     */
    save(){
        return {
            language:super.getConfigData()['language'],
            theme:super.getConfigData()['theme'],
            value:this.editor.getValue()

        };
    }

};

module.exports = codeEditorWidget;