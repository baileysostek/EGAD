const EXEC = require('child_process').execFile;

class processSpawner {
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