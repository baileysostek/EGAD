const Widget = require('./widget');

class canvasWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} x - This is the Column that this widget should be added to.
     * @param {Integer} y - This is the row of of the Column that this widget should be added to.
     * @param {Integer} width - This is the width in pixels that this canvas element should take up.
     * @param {Integer} height - This is the height in pixels that this canvas element should take up.
     * @returns {canvasWidget} Returns a canvasWidget, an instance of the Widget class which allows a user to draw on an html canvas.
     */
    constructor(x, y, width, height){
        super({
            name:"Canvas",
            col:x,
            row:y,
            width:width,
            height:height
        }, {});

        this.x_pos = 0;
        this.y_pos = 0;
    }

    async init(){
        return await new Promise((resolve, reject) => {
            this.element = document.createElement("canvas");
            this.element.setAttribute('id', 'glCanvas');
            this.element.setAttribute("width", super.getConfigData()['width']);
            this.element.setAttribute("height", super.getConfigData()['height']);
            super.getConfigData()['gl'] = this.element.getContext("gl");


            const canvas = this.element;
            // Initialize the GL context
            const gl = canvas.getContext("webgl");

            // Only continue if WebGL is available and working
            if (gl === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }

            resolve(this);
        });
    }


    postinit(){
        let count = 0;
        //Put g2d on this
        this['gl'] = super.getConfigData()['gl'];
        window.setInterval(() => {
            count++;
            // Set clear color to black, fully opaque
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            // Clear the color buffer with specified clear color
            gl.clear(gl.COLOR_BUFFER_BIT);
        }, 1);
        window.setInterval(() => {
            console.log("count",count);
            count = 0;
        }, 1000);
    }

    save(){

    }

    subscribeToDraw(observer){
        if(!this.observers){
            this.observers = [];
        }else{
            this.observers.push(observer);
        }
    }

    draw(){
        if(this.observers){
            for(let i = 0; i < this.observers.length; i++){
                this.observers[i](this.g2d);
            }
        }
    }

};

module.exports = canvasWidget;