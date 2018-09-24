//Created by Bailey Sostek 9/5/2018

let PATH = '';
let fs = require('fs');

let INITIALIZED = false;

let loadedProject = "";
let configurationData;
let projectData;

/**
 * Creates a file manager. This class can read and write files.
 * @class
 */
module.exports = class FileManager{
    constructor(){

    }

    initialize(){
        let that = this;
        return new Promise(function (resolve, reject) {
            fs.readFile('Projects/config.json', function (err, data) {
                if (err) {
                    reject(err);
                }
                that.configurationData = JSON.parse(data);
                that.PATH = 'Projects/'+that.configurationData.MAIN_PROJECT+'/';
                that.loadedProject = that.configurationData.MAIN_PROJECT;
                that.INITIALIZED = true;
                resolve(data);
            });
        });
    }

    loadFile(fileName){
        if(!this.INITIALIZED){
            console.error('LoadFile was called before the FS was initialized.');
            return;
        }
        let that = this;
        return new Promise(function(resolve, reject) {
            fs.readFile(that.PATH+fileName, "utf8", function (err, data){
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    writeToProperties(field, data){
        if(!this.INITIALIZED){
            console.error('writeToProperties was called before the FS was initialized.');
            return;
        }
        let that = this;
        return new Promise(function(resolve, reject) {
            that.projectData[field] = data;
            fs.writeFile(that.PATH+'properties.json', JSON.stringify(that.projectData), 'utf8', function (err, data){
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
        let that = this;
        if(!this.projectData) {
            return new Promise(function (resolve, reject) {
                fs.readFile(that.PATH + 'properties.json', function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    console.log(data);
                    that.projectData = JSON.parse(data);
                    if (that.projectData[fieldName]) {
                        resolve(that.projectData[fieldName]);
                    } else {
                        console.error('Field:', fieldName, " is not on the project configuration object.");
                        reject(data);
                    }
                });
            });
        }else{
            return new Promise(function (resolve, reject) {
                if (that.projectData[fieldName]) {
                    resolve(that.projectData[fieldName]);
                } else {
                    console.error('Field:', fieldName, " is not on the project configuration object.");
                    reject(data);
                }
            });
        }
    }
};