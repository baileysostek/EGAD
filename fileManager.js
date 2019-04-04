//Created by Bailey Sostek 9/5/2018

let PATH = '';
let fs = require('fs');

let INITIALIZED = false;


const SAVE_PATH = 'config/';
const CONFIG_FILE = 'config.json';

let configurationData   = {};
let projectData         = {DATA:{}};

/**
 * Creates a file manager. This class can read and write files.
 * @class
 */
class FileManager{
    constructor(){

    }

    initialize(){
        return new Promise( (resolve, reject) => {
            fs.readFile(SAVE_PATH+CONFIG_FILE, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                this.configurationData = JSON.parse(data);
                this.PATH = SAVE_PATH;
                this.INITIALIZED = true;
                resolve(this.configurationData);
            });
        });
    }

    switchProject(filePath){

    }

    loadFile(fileName){
        if(!this.INITIALIZED){
            console.error('LoadFile was called before the FS was initialized.');
            return;
        }
        return new Promise((resolve, reject) => {
            fs.readFile(this.PATH+fileName, "utf8", function (err, data){
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    async writeToProperties(field, data){
        if(!this.INITIALIZED){
            console.error('writeToProperties was called before the FS was initialized.');
            return;
        }
        return await new Promise((resolve, reject) =>  {
            console.log("ProjectData", projectData);
            projectData[field.toString()] = data;
            fs.writeFile(this.PATH+CONFIG_FILE, JSON.stringify(projectData), 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                console.log(data);
                resolve(data);
            });
        });
    }

    writeToFile(fileName, data){
        if(!this.INITIALIZED){
            console.error('writeToFile was called before the FS was initialized.');
            return;
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(this.PATH+fileName, data, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    getProjectData(fieldName){
        if(!this.INITIALIZED){
            console.error('getProjectData was called before the FS was initialized.');
            return;
        }

        if(!this.projectData) {
            return new Promise( (resolve, reject) => {
                fs.readFile(this.PATH + this.CONFIG_FILE, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    console.log(data);
                    this.projectData = JSON.parse(data);
                    if (this.projectData[fieldName]) {
                        resolve(this.projectData[fieldName]);
                    } else {
                        console.error('Field:', fieldName, " is not on the project configuration object.");
                        reject(data);
                    }
                });
            });
        }else{
            return new Promise(function (resolve, reject) {
                if (this.projectData[fieldName]) {
                    resolve(this.projectData[fieldName]);
                } else {
                    console.error('Field:', fieldName, " is not on the project configuration object.");
                    reject(data);
                }
            });
        }
    }

    getProjectFiles(subdir){
        if(!this.INITIALIZED){
            console.error('getProjectFiles was called before the FS was initialized.');
            return;
        }

        return new Promise((resolve, reject) => {
            fs.readdir(this.PATH+subdir, (err, files) => {
                console.log("Directory:",this.PATH+subdir);
                if (err) {
                    reject(err);
                }
                let outputFiles = [];
                this.getProjectData("IGNORE").then((result) => {
                    if(!subdir) {
                        console.log("Ignored files:", result);
                    }
                    let ignoreObject = {};

                    for(var i = 0; i < result.length; i++) {
                        let fileName = result[i].split('.')[0];
                        let extension = result[i].split('.')[1];
                        if (ignoreObject[extension]) {
                            ignoreObject[extension].push(fileName);
                        }else{
                            ignoreObject[extension] = []; //Initialize the array
                            ignoreObject[extension].push(fileName);
                        }
                    }

                    files.forEach(file => {
                        let fileName  = file.split('.')[0];
                        let extension = file.split('.')[1];
                        //Is this file extension in the list of ignored file extensions?
                        if(extension) {
                            if (ignoreObject[extension]) {
                                for (var i = 0; i < ignoreObject[extension].length; i++) {
                                    let ignoreIdentifier = ignoreObject[extension][i];
                                    if (ignoreIdentifier === fileName || ignoreIdentifier === '*') { //If this files name or '*' is listed as an ignored file, ignore this file.

                                    } else { //Add this file
                                        outputFiles.push(this.convertFileToObject(file));
                                    }
                                }
                            } else { //If not then there is no way this file is ignored, so push it.
                                outputFiles.push(this.convertFileToObject(file));
                            }
                        } else { //This is a directory because it does not have a file extension, we will recursivly load this directory
                            this.convertFileToFolderObject(subdir, file).then(function(result) {
                                outputFiles.push(result);
                            }, function(err) {
                                console.error(err);
                            });
                        }

                    });

                    resolve(outputFiles);
                }, function(err) {
                    reject(err);
                });
            })
        });
    }

    convertFileToObject(fileName){
        return{
            title:fileName,
            folder: false
        }
    }

    convertFileToFolderObject(subdir, fileName){
        return new Promise((resolve, reject) => {
            this.getProjectFiles(subdir + '/' + fileName).then(function (result) {
                resolve({
                    title: fileName,
                    folder: true,
                    children: result
                });
            }, function (err) {
                reject(err);
            });
        });
    }

    getProjectFiles(subdir){
        if(!this.INITIALIZED){
            console.error('getProjectFiles was called before the FS was initialized.');
            return;
        }

        return new Promise((resolve, reject) => {
            fs.readdir(subdir, (err, files) => {
                console.log("Directory:",subdir);
                if (err) {
                    reject(err);
                }
                let outputFiles = [];
                this.getProjectData("IGNORE").then((result) => {
                    if(!subdir) {
                        console.log("Ignored files:", result);
                    }
                    let ignoreObject = {};

                    for(var i = 0; i < result.length; i++) {
                        let fileName = result[i].split('.')[0];
                        let extension = result[i].split('.')[1];
                        if (ignoreObject[extension]) {
                            ignoreObject[extension].push(fileName);
                        }else{
                            ignoreObject[extension] = []; //Initialize the array
                            ignoreObject[extension].push(fileName);
                        }
                    }

                    files.forEach(file => {
                        let fileName  = file.split('.')[0];
                        let extension = file.split('.')[1];
                        //Is this file extension in the list of ignored file extensions?
                        if(extension) {
                            if (ignoreObject[extension]) {
                                for (var i = 0; i < ignoreObject[extension].length; i++) {
                                    let ignoreIdentifier = ignoreObject[extension][i];
                                    if (ignoreIdentifier === fileName || ignoreIdentifier === '*') { //If this files name or '*' is listed as an ignored file, ignore this file.

                                    } else { //Add this file
                                        outputFiles.push(this.convertFileToObject(file));
                                    }
                                }
                            } else { //If not then there is no way this file is ignored, so push it.
                                outputFiles.push(this.convertFileToObject(file));
                            }
                        } else { //This is a directory because it does not have a file extension, we will recursivly load this directory
                            this.convertFileToFolderObject(subdir, file).then(function(result) {
                                outputFiles.push(result);
                            }, function(err) {
                                console.error(err);
                            });
                        }

                    });

                    resolve(outputFiles);
                }, function(err) {
                    reject(err);
                });
            })
        });
    }
};

module.exports = FileManager;