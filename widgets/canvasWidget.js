const Widget = require('./widget');

let count = 0;

let delta = 0;

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
    constructor(x, y, width, height, fps = 60){
        super({
            name:"Canvas",
            col:x,
            row:y,
            width:width,
            height:height,
            fps:fps,
            draw_func:{}
        }, {});
    }

    setGamepadManager(gamepadManager){
        super.getConfigData()['gamepads'] = gamepadManager;
    }

    /**
     * This function overrides the parent widgets init function to create a new canvas widget.
     * @param {Object} configData - This is the save object passed back into the function, the only important field on this object is 'fps' which determines the target framerate of the canvas.
     * * @return {Promise<any>} - This promise resolves once this widget has initialized.
     */
    async init(configData){
        return await new Promise((resolve, reject) => {
            this.element = document.createElement("canvas");
            this.element.setAttribute('id', 'glCanvas');
            this.element.setAttribute("width", super.getConfigData()['width']);
            this.element.setAttribute("height", super.getConfigData()['height']);

            if(configData['fps']){
                this.element.setAttribute("fps", configData['fps']);
            }

            super.getConfigData()['gl'] = this.element.getContext("webgl");

            // Only continue if WebGL is available and working
            if (super.getConfigData()['gl']  === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }

            resolve(this);
        });
    }

    /**
     * This function triggers after the widget has initialized, at this point all fields should be able to be referenced. In the canvas widget this function registers a callback function to run 'fps' times per second.
     */
    postinit(){
        count = 0;
        //Put g2d on this
        let gl = super.getConfigData()['gl'];
        super.getConfigData()['draw_func'] = window.setInterval(() => {
            count++;
            // Set clear color to black, fully opaque
            if(super.getConfigData()['gamepads'].getGamepads()[0]){
                gl.clearColor(Math.abs(super.getConfigData()['gamepads'].getGamepads()[0].axes[1]), super.getConfigData()['gamepads'].getGamepads()[0].axes[0], -1 * super.getConfigData()['gamepads'].getGamepads()[0].axes[0], 1.0);
            }else{
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
            }
            // Clear the color buffer with specified clear color
            gl.clear(gl.COLOR_BUFFER_BIT);
            this.draw();
        }, (1000/super.getConfigData()['fps'])+delta );

        let fps = window.setInterval(() => {
            console.log("count",count);
            if(count > super.getConfigData()['fps']){
                delta++;
                this.setFameRate(super.getConfigData()['fps']);
            }
            count = 0;
        }, 1000);
    }

    /**
     * This function allows a user to subscribe to this widgets draw call, The passed function will have gl passed to it, and will be called 'fps' times per second.
     * @param {Function} observer - This is a callback function to execute fps times per second.
     */
    subscribeToDraw(observer){
        if(!this.observers){
            this.observers = [];
        }else{
            this.observers.push(observer);
        }
    }

    /**
     *
     */
    draw(){
        if(this.observers){
            for(let i = 0; i < this.observers.length; i++){
                this.observers[i](super.getConfigData()['gl']);
            }
        }
    }

    /**
     * This function allows a user to adjust the rate at which the screen refreshes. The parameter fps specifies the new target frame-rate.
     * @param {Integet} fps - The target frame rate for this canvas.
     */
    setFameRate(fps){
        let gl = super.getConfigData()['gl'];
        super.getConfigData()['fps'] = fps;
        clearInterval(super.getConfigData()['draw_func']);
        super.getConfigData()['draw_func'] = window.setInterval(() => {
            count++;
            // Set clear color to black, fully opaque
            if(super.getConfigData()['gamepads'].getGamepads()[0]){
                gl.clearColor(Math.abs(super.getConfigData()['gamepads'].getGamepads()[0].axes[1]), super.getConfigData()['gamepads'].getGamepads()[0].axes[0], -1 * super.getConfigData()['gamepads'].getGamepads()[0].axes[0], 1.0);
            }else{
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
            }
            // Clear the color buffer with specified clear color
            super.getConfigData()['gl'].clear(super.getConfigData()['gl'].COLOR_BUFFER_BIT);
            this.draw();
        }, (1000/super.getConfigData()['fps'])+delta);
    }

    /**
     * This function generates a save object so that this widget can initialize to the state which it is in the next time the application starts.
     * @return {{fps: *}}
     */
    save(){
        return {
            fps:super.getConfigData()['fps']
        };
    }

};
module.exports = canvasWidget;