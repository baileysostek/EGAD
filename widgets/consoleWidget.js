const Widget = require('./widget');

let observers = [];

let consoleCommands = [];
let consoleIndex = -1;

let outputConsole;

class consoleWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} x - This is the Column that this widget should be added to.
     * @param {Integer} y - This is the row of of the Column that this widget should be added to.
     * @param {Integer} [textSize=18] - The font size to use in the console.
     * @returns {canvasWidget} Returns a canvasWidget, an instance of the Widget class which allows a user to draw on an html canvas.
     */
    constructor(x, y, textSize = 18){
        super({
            name:"Console",
            col:x,
            row:y,
            textScale:textSize
        }, {});
    }

    /** This function overrides the parent widget initialize function and creates a console to be displayed within this widget.
     * @return {Promise<any>}
     */
    async init(){
        return await new Promise((resolve, reject) => {

            this.element = document.createElement('div');

            outputConsole = document.createElement('div');
            outputConsole.setAttribute('id', 'outputConsole');
            outputConsole.style.backgroundColor = '#a9b7c6';
            outputConsole.style.width = '100%';
            outputConsole.style.height = 'calc(100% - '+super.getConfigData()['textScale']+'px)';
            outputConsole.style.position = 'absolute';

            let inputConsole = document.createElement('input');
            inputConsole.setAttribute('type', 'text');
            inputConsole.style.top = outputConsole.style.height;
            inputConsole.style.width = '100%';
            inputConsole.style.height = super.getConfigData()['textScale']+'px';
            inputConsole.style.position = 'absolute';

            this.element.appendChild(outputConsole);
            this.element.appendChild(inputConsole);


            inputConsole.parentNode.style.overflow = 'visible';
            inputConsole.addEventListener("keydown", (event) => {
                loop:{
                    if (event.keyCode === 13) { //Enter
                        event.preventDefault();
                        if(inputConsole.value.length > 0) {
                            //Execute callbacks with this string passed
                            for(let observer_key in observers){
                                let observer = observers[observer_key];
                                observer(inputConsole.value);
                            }
                            if (consoleIndex == -1) {
                                if (consoleCommands.length > 0) {
                                    consoleCommands.splice(0, 0, inputConsole.value);
                                } else {
                                    consoleCommands.push(inputConsole.value);
                                }
                            }
                            inputConsole.value = '';
                            consoleIndex = -1;
                            break loop;
                        }
                    }
                    if (event.keyCode === 38) { //UP arrow
                        event.preventDefault();
                        if (consoleIndex < consoleCommands.length - 1) {
                            consoleIndex++;
                        } else {
                            //Noise maybe
                        }
                        if(consoleCommands[consoleIndex]) {
                            inputConsole.value = consoleCommands[consoleIndex];
                        }
                        // console.log('index',consoleIndex);
                        break loop;
                    }
                    if (event.keyCode === 40) { //Down arrow
                        event.preventDefault();
                        if (consoleIndex >= 0) {
                            consoleIndex--;
                        } else {
                            //Noise maybe
                        }
                        if (consoleIndex >= 0) {
                            inputConsole.value = consoleCommands[consoleIndex];
                        } else {
                            inputConsole.value = '';
                        }
                        // console.log('index',consoleIndex);
                        break loop;
                    }
                    //IF the editor text is changed then flag this new command to be pushed onto the command stack
                    consoleIndex = -1;
                }
            });

            resolve(this);
        });
    }

    /**
     * This function allows a string to be passed in to then be printed to the consoles output.
     * @param {String} message - This is the message to print to this consoles output area.
     */
    log(message){
        if(!message.includes('\n')){
            outputConsole.innerText += message + '\n';
        }else{
            outputConsole.innerText += message;
        }
        outputConsole.parentNode.scrollTop = outputConsole.parentNode.scrollHeight;
    }

    /**
     * This function allows developers to register function callbacks to be excuted whenever enter is pressed when text is inside the input field of this console. The text is passed into all callback functions.
     * @param {Function} observer - Function to be called whenever enter is pressed from the consoles input field.
     */
    subscribe(observer){
        observers.push(observer);
    }
};

module.exports = consoleWidget;