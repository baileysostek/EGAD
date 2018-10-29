let languageName    = '';
let FUNCTIONS       = {};
let KEYWORDS        = [];
let TYPES           = [];
let fileAssociation = '';

let tokenConstraints = [' ', '.'];

module.exports = class languageParser{
    constructor(languageInformation){
        languageName = languageInformation.LANGUAGE.NAME;
        console.log("Language:", languageName);

        //Hold onto the input function data for easy reference.
        let functionData = languageInformation.LANGUAGE.FUNCTIONS;
        //Parse the object passed into this function and create language objects and type objects.
        let functionKeySet = Object.keys(functionData);

        //Loop through all of the passed functions and generate objects out of them. Essentially a local wrapper of remote json data.
        for(let i = 0; i < functionKeySet.length; i++){
            let key = functionKeySet[i];
            let toAdd = this.createFunction(functionData[key].NAME, functionData[key].PARAMETERS, functionData[key].RETURNS);
            this.addFunction(toAdd);
        }

        //At this point FUNCTIONS is a hashMap mapping the name of the function to the object representing the function.
    }

    addFunction(l_function){
        if(l_function) {
            if(!FUNCTIONS[l_function.getNAME()]) {
                FUNCTIONS[l_function.getNAME()] = l_function;
            }else{
                console.error("Tried to add function:"+l_function.getNAME()+" but a function with that name already exists.");
            }
        }
    }

    addKeyword(){

    }

    getSuggestion(string){
        let keys = Object.keys(FUNCTIONS);
        let suggestionSet = [];

        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            if(key.toLowerCase().includes(string)){
                suggestionSet.push(FUNCTIONS[key]);
            }
        }
        return suggestionSet;
    }

    getSuggestionFromType(type){

    }

    tokeniseString(string){
        let tokens = [];
        let workingStrings = [string];
        for(let i = 0; i < tokenConstraints.length; i++){
            let toAdd = [];
            for(let j = 0; j < workingStrings.length; j++){
                var splitToken = workingStrings[j].split(tokenConstraints[i]);
                if(splitToken.length > 1) {
                    toAdd = toAdd.concat(splitToken);
                    workingStrings.splice(j, 1);
                }
            }
            // console.log("toAdd:", toAdd);
            workingStrings = workingStrings.concat(toAdd);
        }
        tokens = workingStrings;
        return tokens;
    }

    getLastToken(tokenArray){
        if(tokenArray.length > 1) {
            return tokenArray[tokenArray.length - 1];
        }else{
            return tokenArray;
        }
    }

    createFunction(name, parameters, returns){
        let NAME        = name;
        let PARAMETERS  = parameters;
        let RETURNS     = returns;
        let TEXT        = '';

        return{
            getNAME:function(){
                return NAME;
            },
            getPARAMETERS:function(){
                return PARAMETERS;
            },
            getRETURNS:function(){
                return RETURNS;
            },
            getTEXT:function(){
                return TEXT;
            }
        }
    }

    inverse(n1, n2){
        let found = false;
        let itteration = 0;
        let wrongNumbers = {};
        while(!found){
            let result = (itteration * n1)%n2;
            if(result == 1){
                console.log("inverse of ",n1," is ",itteration);
                found = true;
            }else{
                if(!wrongNumbers[itteration+'']){
                    console.log("Adding", result, "to result set.");
                    wrongNumbers[itteration+''] = result;
                }else{
                    console.log("Number ",n1,"%",n2,"has no Inverse");
                    found = true;
                }
            }
            itteration++;
        }
    }
}