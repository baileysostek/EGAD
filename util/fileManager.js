//Created by Bailey Sostek 9/5/2018

//Path is the path to the root directory
let PATH = '';
let fs = require('fs');


//This information can be modified, by default the root folder is the project directory / root and the configuration file is called config.json
const SAVE_PATH = 'root/';
const CONFIG_FILE = 'config.json';

//This is the contents of the config.json file.
let configurationData   = {};
let projectData         = {DATA:{}};

class FileManager{
    /**
     * Creates a file manager. This class can read and write files.
     * @constructor
     * @class
     */
    constructor(){

    }

    /**
     * @typedef {Object} Ignore
     * @property {String[]}  IGNORE - An array of strings to add to the blacklist. The '*' character can be used as a wildcard opperator. For example 'IGNORE':['*.txt'], will ignore all .txt files. Another example 'IGNORE':['test.*'] will ignore any file named text with any extension.
     */


    /**
     * This function is used to initialize this file manager. When this function is called, a promise is returned. The promise will resolve once the file defined by 'SAVE_PATH/CONFIG_FILE' has been read and parsed into a JSON object.
     * @return {Promise<any>}
     */
    initialize(){
        return new Promise( (resolve, reject) => {
            fs.readFile(SAVE_PATH+CONFIG_FILE, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                if(data.length <= 0){
                    this.configurationData = {DATA:[]};
                } else {
                    this.configurationData = JSON.parse(data);
                }
                this.PATH = SAVE_PATH;
                this.INITIALIZED = true;
                resolve(this.configurationData);
            });
        });
    }

    /**
     * This function allows a user to load a file relative to the 'SAVE_PATH' for example, if the user were to pass 'sampleLanguage.json' to this file, the framework would try to load the file 'root/sampleLanguage.json'
     * Once the file has been found, the contents will be read as utf8 text and returned as a promise. This promise resolves once all lines of the file have been read and are contained within the 'data' object.
     * @param fileName
     * @return {Promise<any>}
     */
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

    /**
     * This function allows a developer to esaily write to the config json object. This object is persisted between instances of the application running.
     * @param {String} field - This is the field on the config object that you want to set.
     * @param {Object} data - This is the value that 'field' should be set to.
     * @return {Promise<any>} This function returns a promise which resolves if the write was successful, or rejects if there was an error.
     */
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

    /**
     * This function is the inverse of 'writeToProperties' It allows a user to read the field 'fieldName' off of the properties object.
     * @param fieldName - The field to read.
     * @return {Promise<any>} This function returns a promise that resolves when the data is read off of the field, and rejects when their is an error reading that specific field.
     */
    async readFromProperties(fieldName){
        if(!this.INITIALIZED){
            console.error('getProjectData was called before the FS was initialized.');
            return;
        }

        if(!this.projectData) {
            return await new Promise( (resolve, reject) => {
                console.log(this.PATH);
                console.log(CONFIG_FILE);
                fs.readFile(this.PATH + CONFIG_FILE, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    if(data) {
                        console.log(JSON.parse(data));
                        this.projectData = JSON.parse(data);
                        if (this.projectData[fieldName]) {
                            resolve(this.projectData[fieldName]);
                        } else {
                            console.error('Field:', fieldName, " is not on the project configuration object.");
                            reject(data);
                        }
                    }else{
                        console.error('File:', this.PATH , CONFIG_FILE , 'does not exist, or is empty.');
                        reject(data);
                    }
                });
            });
        }else{
            return await new Promise(function (resolve, reject) {
                if (this.projectData[fieldName]) {
                    resolve(this.projectData[fieldName]);
                } else {
                    console.error('Field:', fieldName, " is not on the project configuration object.");
                    reject(data);
                }
            });
        }
    }


    /**
     * This function allows a user to write data to an arbitrary file. The user can specify the file in 'fileName' and the contents of that file in the 'data' object.
     * The file refrenced by file name will be in the path defined by 'SAVE_PATH/fileName'.
     * @param fileName - The name of the file to write to.
     * @param data - The data to write to the file.
     * @return {Promise<any>}
     */
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


    /**
     * This is a helper function which allows the user to read the contents of a directory and represent said directory as a JSON object hierarchy. ignore is an object similar to a .gitignore file and will blacklist certain file types from appearing in the returned object.
     * @description This function is a recursive call, it will propogate through all subdirectories of 'subdir' until all child directories have been traversed.
     * @param {String} subdir - The directory to open and convert to a JSON object.
     * @param {Ignore} ignore - This is the blacklist information to reference when generating this object.
     * @return {Promise<any>} This promise will resolve once all subdirectories have been traversed and a valid save object is generated.
     */
    getProjectFiles(subdir, ignore = {}){
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

                if(!subdir) {
                    console.log("Ignored files:", ignore);
                }
                let ignoreObject = {};

                for(var i = 0; i < ignore.length; i++) {
                    let fileName = ignore[i].split('.')[0];
                    let extension = ignore[i].split('.')[1];
                    if (ignoreObject[extension]) {
                        ignoreObject[extension].push(fileName);
                    }else{
                        ignoreObject[extension] = []; //Initialize the array
                        ignoreObject[extension].push(fileName);
                    }
                }

                if(files) {
                    files.forEach(file => {
                        let fileName = file.split('.')[0];
                        let extension = file.split('.')[1];
                        //Is this file extension in the list of ignored file extensions?
                        if (extension) {
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
                            this.convertFileToFolderObject(subdir, file).then((result) => {
                                outputFiles.push(result);
                            }, (err) => {
                                console.error(err);
                            });
                        }

                    });
                }

                resolve(outputFiles);
            })
        });
    }

    /**
     * Helper function for the 'getProjectFiles' function, simply converts a string name, into an object indicating that this file is an endpoint, not a directory.
     * @param fileName - File name to convert to an object.
     * @return {{folder: boolean, title: *}}
     */
    convertFileToObject(fileName){
        return{
            title:fileName,
            folder: false
        }
    }

    /**
     * Helper function for the 'getProjectFiles' function, This function converts directories to directory endpoints, then recursively calls the getProjectFiles function to add children endpoints to itself.
     * @param subdir - Directory name to convert to an object.
     * @param fileName - File name to convert to an object.
     * @return {Promise<any>} Returns an object representing this directory and all children of this directory.
     */
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
};

module.exports = FileManager;