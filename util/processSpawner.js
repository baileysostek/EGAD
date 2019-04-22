const EXEC = require('child_process').execFile;

class processSpawner {
    /**
     * Creates a processSpawner. This class allows a user to spawn a native process and acces the stdin and stdout streams spawned from the process.
     * @constructor
     * @class
     */
    constructor(){

    }

    /**
     * This function allows a developer to spawn an arbatrary process on the host pc, and subscribe to various events the spawned process emits.
     * @param {String} cmd - The command to execute.
     * @param {String[]} args - Command line arguments to pass into the command.
     * @param {function} stdIN - Function to execute whenever data is written to stdin of the process.
     * @param {function} stdOUT - Function to execute whenever the process sends data to stdOut
     * @param {function} onCLOSE - Function to execute when the process terminates.
     * @return {Promise<any>} Returns a promise that will resolve once the process has spawned and is running.
     */
    spawn(cmd, args, stdIN = (data)=>{console.log(data)}, stdOUT = (data)=>{console.log(data)}, onCLOSE = (data)=>{console.log(data)}){
        return new Promise((resolve, reject) => {
            let my_process = exec(cmd, args, { maxBuffer: 1024 * 1024, pipeOutput: true}, (err, data) => {
                if (err){
                    reject(err);
                } else {
                    resolve(data);
                };
            });
            my_process.stdout.on('data', (data) => {
                stdOUT(data);
            });

            my_process.stderr.on('data', (data) => {
                stdIN(data);
            });

            my_process.on('exit', (code) => {
                onCLOSE(code);
            });
        });
    }

}

module.exports = processSpawner;