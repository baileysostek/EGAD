//Local private variables to be retrieved through the getters and setters.

let NAME        = '';
let PARAMETERS  = [];
let RETURNS     = {};
let TEXT        = '';

/** Class representing a function in our language. */

module.exports = class Function{
    /**
     * Create a point.
     * @param {string}  name         - The name of this function.
     * @param {array}   parameters   - The input parameters to this function.
     * @param {object}  returns      - The return object of executing this function.
     */
    constructor(name, parameters, returns){
        NAME        = name;
        PARAMETERS  = parameters;
        RETURNS     = returns;
    }

    getNAME(){
        return NAME;
    }

    getPARAMETERS(){
        return PARAMETERS;
    }

    getRETURNS(){
        return RETURNS;
    }

    getTEXT(){
        return TEXT;
    }

}