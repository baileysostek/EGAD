let languageName    = '';
let FUNCTIONS       = {};
let KEYWORDS        = [];
let TYPES           = [];
let fileAssociation = '';

//Any characters within array determine where a token break should occur.
let tokenConstraints = [' ', '.', '='];
//When the parser passes the character at [0] a scope is defined, the scope will exist until the corresponding character [1] is found.
//If an additional scope-opening character is found a sub-scope will be created recursively. This way infinitely many scopes can be defined within each other.
let scopeConstraints = ['{', '}'];

//File specific suggestions
let FILE_VARS = [];
let FILE_FUNCTIONS = [];

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

    loadFileSpecificData(fileData){
        // this.findAllScopes(fileData);
        this.clearLocalSuggestions();
        let fileLines = fileData.split('\n');
        let index = 0;
        for(let i = 0; i < fileLines.length; i++){
            let line = fileLines[i];
            let lineTokens = this.tokeniseString(line);
            let hasToken = this.hasToken(lineTokens, 'var');
            for(let j = 0; j < line.length; j++){
                if(line[j] === scopeConstraints[0]){
                    //Open
                    index++;
                }
                if(line[j] === scopeConstraints[1]){
                    //Close
                    index--;
                }
            }
            //Only variables defined within the first scope are globally visible.
            if(hasToken != false && index == 0){
                //TODO determine what block this variable is visible within.
                let varToken = this.getTokenAtIndex(lineTokens, hasToken.index+1);
                console.log("Var:", varToken," is inside scope:"+index);
                let suggestion = this.createFunction(varToken, [], {});
                this.addFunction(suggestion);
                FILE_VARS.push(suggestion)
            }
        }
    }

    findAllScopes(fileData){
        let index = 0;
        for(let i = 0; i < fileData.length; i++){
            if(fileData[i] === scopeConstraints[0]){
                //Open
                index++;
            }
            if(fileData[i] === scopeConstraints[0]){
                //Open
                index--;
            }
        }
    }

    cursorToScope(cursor){

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

        //Sort the array by probability of correctness rather than alphabetically.
        suggestionSet = suggestionSet.sort(function(a, b){
            let pos1 = a.getNAME().indexOf(string);
            let pos2 = b.getNAME().indexOf(string);
            return (pos2 - pos1);
        });

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

    hasToken(tokens, token){
        for(let i = 0; i < tokens.length; i++){
            if(tokens[i] === token){
                return {
                    "index":i,
                    "token":tokens[i]
                }
            }
        }
        return false;
    }

    getTokenAtIndex(tokens, index){
        return tokens[index];
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

    createScope(uuid, vars, uuids){
        return {
            uuid:uuid,
            vars:vars,
            uuids:uuids,
            addVar(varName){
                this.vars.push(varName);
            },
            addScope(scope){
                this.uuids.push(scope);
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

    clearLocalSuggestions(){
        this.FILE_VARS = [];
        this.FILE_FUNCTIONS = [];
    }
}