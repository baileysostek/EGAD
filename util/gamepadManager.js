
let gamepads = [];

let deadzone = 0.1;

class gamepadManager{

    constructor(pollingDuration = (1000/144)){
        window.addEventListener("gamepadconnected", (e) => {
            this.registerController(e.gamepad);
        });


        window.setInterval(() => {
            navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            for(let controller in gamepads){
                for(let axis in controller.axes){
                    if(Math.abs(axis) < deadzone){
                        axis = 0;
                    }
                }
            }
        }, pollingDuration);

    }

    registerController(controller){
        gamepads[controller.index] = controller;
        console.log(controller);
    }

    isButtonPressed(index, button){
        console.log(gamepads[index].buttons[button]);
    }

    getGamepads(){
        return gamepads;
    }

}

module.exports = gamepadManager;