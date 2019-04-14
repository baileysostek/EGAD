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
     * @returns {canvasWidget} Returns a canvasWidget, an instance of the Widget class which allows a user to draw on an html canvas.
     */
    constructor(x, y){
        super({
            name:"Canvas",
            col:x,
            row:y,
            textScale:18
        }, {});
    }

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

    log(message){
        if(!message.includes('\n')){
            outputConsole.innerText += message + '\n';
        }else{
            outputConsole.innerText += message;
        }
        outputConsole.parentNode.scrollTop = outputConsole.parentNode.scrollHeight;
    }

    postinit(){

    }

    save(){

    }

    subscribe(observer){
        observers.push(observer);
    }
};

module.exports = consoleWidget;