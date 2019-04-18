let languageName        = '';
let FUNCTIONS           = {};
let VARIABLE_KEYWORDS   = [];
let TYPES               = [];
let fileAssociation     = '';

let comment_head        = '';
let comment_tail        = '';

//Any characters within the array determine where a token break should occur.
let tokenConstraints = [' ', '=', ';', ',', '[', ']', '(', ')'];
//When the parser passes the character at [0] a scope is defined, the scope will exist until the corresponding character [1] is found.
//If an additional scope-opening character is found a sub-scope will be created recursively. This way infinitely many scopes can be defined within each other.
let scopeConstraints = ['{', '}'];
let SCOPE_SET = [];

//File specific suggestions
let FILE_VARS = {};
let FILE_FUNCTIONS = [];

//Store all of the data associated with this file in this object.
let FILE_DATA;

//Start of new CSS overriding system, we can add cool css effects to the document dynamically, we just need to register input.
let INTERESTING_TOKENS = []; //This is an array of objects, the structure is as follows
//key(s): The key that we are interested in looking for and finding.
//An array or single token that bust be contained within a line.
//callback: this is the callback that is executed when the keyword is found.
//If a line contains the key that is desired, the entire line is passed to the callback function
//A line must contain all desired tokens in order to trigger the callback function.

class languageParser{
    /**
     * The language parser class allows for quick indexing and predictive searching of user defined functions.
     * @param {Object} languageInformation - This is the key to a language, all aspects of the language such as functions, primitive types, and commenting information are defined within this object.
     * @constructor
     * @returns {languageParser} Returns a new language parser ready to parse the language defined by <languageInformation>
     */
    constructor(languageInformation){
        languageName = languageInformation.LANGUAGE.NAME;
        console.log("Language:", languageName);

        //Hold onto the input function data for easy reference.
        let functionData = languageInformation.LANGUAGE.FUNCTIONS;
        //Parse the object passed into this function and create language objects and type objects.
        let functionKeySet = Object.keys(functionData);
        //Load keywords into this file, so the lexer can determine what variables to add to intelligence.
        VARIABLE_KEYWORDS = languageInformation.LANGUAGE.VARIABLE_KEYWORDS;

        comment_head = languageInformation.LANGUAGE.COMMENT_HEAD;
        comment_tail = languageInformation.LANGUAGE.COMMENT_TAIL;

        //Loop through all of the passed functions and generate objects out of them. Essentially a local wrapper of remote json data.
        for(let i = 0; i < functionKeySet.length; i++){
            let key = functionKeySet[i];
            let toAdd = this.createFunction(functionData[key].NAME, functionData[key].PARAMETERS, functionData[key].RETURNS);
            this.addFunction(toAdd);
        }

        //At this point FUNCTIONS is a hashMap mapping the name of the function to the object representing the function.
        //

    }

    /**
     * This function takes in data from a file and generate a tree structure for this file representing the scopes of this file. This scoping information is used to determine local variables.
     * @param {String} fileData - This is a string of all lines of a file, with each line delimited with the \n character.
     */
    loadFileSpecificData(fileData){
        this.FILE_DATA = fileData;
        // this.findAllScopes(fileData);
        this.clearLocalSuggestions();
        let fileLines = fileData.split('\n');
        let index = 0;
        //Scope creation can be a stack, every time a new open character is found a scope is pushed onto the stack
        //this scope is parented to the previous top of stack. Every time an end character is found, a scope is
        //popped off of the stack. This creates a tree that can be reversed
        SCOPE_SET = [];
        SCOPE_SET.push(this.createScope('uuid', [], null));
        for(let i = 0; i < fileLines.length; i++){
            let line = fileLines[i];
            while(line.startsWith(' ') || line.startsWith('\t')){
                line = line.substr(1, line.length);
            }
            for(let j = 0; j < line.length; j++){ //Look for scope start characters
                if(line[j] === scopeConstraints[0]){
                    //Open
                    index++;
                    var newScope = this.createScope('uuid', [], null);
                    //I == Line
                    //J == Character
                    newScope.setStart(i, j);
                    newScope.setParent(SCOPE_SET[SCOPE_SET.length-1]);
                    SCOPE_SET.push(newScope);
                }
                if(line[j] === scopeConstraints[1]){
                    //Close
                    index--;
                    SCOPE_SET[SCOPE_SET.length-1].setEnd(i, j);
                    SCOPE_SET.pop();
                }
            }
            let lineTokens = this.tokeniseString(line);
            for(let j = 0; j < VARIABLE_KEYWORDS.length; j++) {
                let hasToken = this.hasToken(lineTokens, VARIABLE_KEYWORDS[j]);
                //Only variables defined within the first scope are globally visible.
                if (hasToken != false) {
                    let varToken = this.getTokenAtIndex(lineTokens, hasToken.index + 1);
                    console.log(VARIABLE_KEYWORDS[j],":", varToken, " is inside scope:" + index);
                    let suggestion = this.createFunction(varToken, [], {});
                    FILE_VARS[suggestion.getNAME()] = suggestion;
                    SCOPE_SET[SCOPE_SET.length-1].addVar(suggestion);
                }
            }

            // //Look through the line tokens to detect css Overrides
            for(let k_criteria in INTERESTING_TOKENS) {
                let criteria = INTERESTING_TOKENS[k_criteria];
                let satisfies = {};
                //Build the satisfaction object
                for (let k_token in criteria.tokens) {
                    let token = criteria.tokens[k_token];
                    satisfies[token] = false;
                    for(let k_lineToken in lineTokens){
                        if(lineTokens[k_lineToken].toLowerCase().includes(token.toLowerCase())){
                            satisfies[token] = true;
                        }
                    }
                }

                let isSatisfied = true;

                for(let k_satisfies in satisfies){
                    if(!satisfies[k_satisfies]){
                        isSatisfied = false;
                        break;
                    }
                }

                if(isSatisfied){//IF this line satisfies
                    console.log("Satisfaction:",satisfies);
                    criteria.function({n:i, lineTokens:lineTokens});
                }
            }

        }

        console.log("Scope Set:",SCOPE_SET);
        console.log("FILE_VARS:",FILE_VARS);
        console.log("getSubScope", this.getSubScope(SCOPE_SET[0]));
    }

    /**
     * This function returns which scope the cursor is currently in. A cursor object contains a line number and a character.
     * @param {Cursor} cursor - An object representing a cursors position inside of this file.
     * @return {*} Returs the scope that the cursor is inside of.
     */
    cursorToScope(cursor){
        let SCOPE = this.getSubScope(SCOPE_SET[0]);
        for (let i = SCOPE.length - 1; i > 0; i--){
            let thisScope = SCOPE[i];
            if(this.cursorInScope(cursor, thisScope)){
                return thisScope;
            }
        }
        return SCOPE_SET[0];
    }

    /**
     * This function takes a cursor and a scope and returns true if the cursor is inside of the scope.
     * @param cursor - cursor object
     * @param scope - scope to check cursor against.
     * @return {boolean} If cursor 'cursor' is inside of scope 'scope'
     */
    cursorInScope(cursor, scope){
        if (cursor.line == scope.start.line) {
            if (cursor.ch > scope.start.ch) {
                if(cursor.line < scope.end.line){
                    return true;
                }else if(cursor.line = scope.end.line){
                    if(cursor.ch < scope.end.ch){
                        return true;
                    }
                }
            }
        }else if(cursor.line < scope.end.line){
            if(cursor.line > scope.start.line) {
                return true;
            }
        }else if (cursor.line == scope.end.line) {
            if (cursor.ch < scope.end.ch) {
                if(cursor.line > scope.start.line){
                    return true;
                }else if(cursor.line == scope.start.line){
                    if(cursor.ch > scope.start.ch){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * This function returns all child scopes of a desired scope.
     * @param {Scope} scope - The scope to get the children of.
     * @return {Scope[]} Returns the array of child scopes parented to 'scope'.
     */
    getSubScope(scope){
        let out = [scope];
        for(let i = 0; i < scope.children.length; i++){
            out = out.concat(this.getSubScope(scope.children[i]));
        }
        return out;
    }

    /**
     * When code is added to or removed from a document at a position, scopes need to be offset by that ammount. Example, if there is a scope which starts on line 42, but lines 5-10 are deleted, then the scope starting on 42 will now start on 36. This function updates all scopes so they are still in the correct place.
     * @param {Integer} delta - Number of lines to offset scopes by, either positive for new lines, or negative for deletions.
     * @param {Cursor} cursor - The position of the cursor, so we know where these lines were inserted or deleted relative to.
     */
    offsetScopes(delta, cursor){
        let lastCursorPosition = {line:cursor.line, ch:cursor.ch};
        lastCursorPosition.line -= delta;
        let scopes = this.getSubScope(SCOPE_SET[0]); //Get all scopes
        for(let i = 0 ; i< scopes.length; i++){
            let scope = scopes[i];
            if(scope.start.line > lastCursorPosition.line){
                scope.start.line += delta;
            }
            if(scope.end.line > lastCursorPosition.line){
                scope.end.line += delta;
            }
        }
    }

    /**
     * This function is used when reading the language description. This function generates a hashmap of functions defined within this languages domain. These functions are looked up when generating IntelliSence
     * @param {l_function} l_function - The language specific function to add to this languages registered functions.
     */
    addFunction(l_function){
        if(l_function) {
            if(!FUNCTIONS[l_function.getNAME()]) {
                FUNCTIONS[l_function.getNAME()] = l_function;
            }else{
                console.error("Tried to add function:"+l_function.getNAME()+" but a function with that name already exists.");
            }
        }
    }

    /**
     * This function returs an array of l_functions which the user could be typing. This function performs a fuzzy search through the list of defined functions and generates a subset of functions that are similar to 'string'
     * @param {String} string - String to search
     * @param {Cursor} cursor - position in the file
     * @return {l_function[]} Returns an array of l_functions which the user could be trying to type.
     */
    getSuggestion(string, cursor){
        console.log("FUNCTIONS",FUNCTIONS," FILE_VARS",FILE_VARS);
        console.log("SCOPE:", this.cursorToScope(cursor), "Cursor:",cursor);
        let keys = Object.keys(FUNCTIONS);
        let scopedVariables = this.cursorToScope(cursor);
        let scopedVariablesObject = {};
        for(let i = 0; i < scopedVariables.vars.length; i++){
            scopedVariablesObject[scopedVariables.vars[i].getNAME()] = scopedVariables.vars[i];
        }
        console.log("Scoped Variables:",scopedVariablesObject);
        keys = keys.concat(Object.keys(scopedVariablesObject));
        let suggestionSet = [];

        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            if(key.toLowerCase().includes(string.toLowerCase())){
                if(scopedVariablesObject[key]){
                    suggestionSet.push(scopedVariablesObject[key]);
                }
                if(FUNCTIONS[key]) {
                    suggestionSet.push(FUNCTIONS[key]);
                }
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

    /**
     * This function takes in a string and turns it into an array of string tokens.
     * @param {String} string - String to tokenise
     * @return {String[]} - Array of string tokens
     */
    tokeniseString(string){
        let tokens = [];
        let workingStrings = [string];
        for(let i = 0; i < tokenConstraints.length; i++){
            let toAdd = [];
            for(let j = 0; j < workingStrings.length; j++){
                var splitToken = workingStrings[j].split(tokenConstraints[i]);
                if(splitToken.length > 1) {
                    let filteredTokens = []; // Tokens that are not empty
                    for(let k = 0; k < splitToken.length; k++){
                        if(splitToken[k].length > 0){
                            filteredTokens.push(splitToken[k]);
                        }
                    }
                    toAdd = toAdd.concat(filteredTokens);
                    workingStrings.splice(j, 1);
                }
            }
            workingStrings = workingStrings.concat(toAdd);
        }
        tokens = workingStrings;
        return tokens;
    }

    /**
     * Returns the last token of a line
     * @param tokenArrayg
     * @return {*}
     */
    getLastToken(tokenArray){
        if(tokenArray.length > 1) {
            return tokenArray[tokenArray.length - 1];
        }else{
            return tokenArray[0];
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

    createScope(uuid, vars, parentScope){
        return {
            uuid:uuid,
            vars:vars,
            parentScope:parentScope,
            children:[],
            start:{
              line:0,
              char:0
            },
            end:{
                line:Infinity,
                char:Infinity
            },
            addVar(varName){
                this.vars.push(varName);
            },
            setParent(scope){
                this.parentScope = scope;
                this.parentScope.children.push(this);
            },
            getVars(){
                let outVars = {};
                for(let i = 0; i < this.vars.length; i++){
                    outVars[this.vars[i].getNAME()] = this.vars[i];
                }
                let parent = this.parentScope;
                while(parent){
                    for(let i = 0; i < parent.vars.length; i++){
                        outVars[parent.vars[i].getNAME()] = parent.vars[i];
                    }
                    parent = parent.parentScope;
                }
                return outVars;
            },
            setStart(line, char){
                this.start.line = line;
                this.start.char = char;
            },
            setEnd(line, char){
                this.end.line = line;
                this.end.char = char;
            }
        }
    }

    removeFrontSpacing(string){
        while(string.startsWith(' ') || string.startsWith('\t')){
            if(string.length > 1){
                string = string.substring(1, string.length);
            }else{
                return "";
            }
        }
        return string;
    }

    clearLocalSuggestions(){
        this.FILE_VARS = [];
        this.FILE_FUNCTIONS = [];
    }

    registerInterestInTokens(tokens, f_callback){
        let i_tokens = [tokens];
        if(Array.isArray(tokens)){
            i_tokens = tokens;
        }
        INTERESTING_TOKENS.push({tokens:i_tokens, function:f_callback});
    }

    getCommentHead(){
        return comment_head;
    }

    getCommentTail(){
        return comment_tail;
    }

    lookForInterestingTokens(){
        let fileLines = this.FILE_DATA.split('\n');
        for(let i = 0; i < fileLines.length; i++) {
            let line = fileLines[i];
            while(line.startsWith(' ') || line.startsWith('\t')){
                line = line.substr(1, line.length);
            }
            let lineTokens = this.tokeniseString(line);
            //Look through the line tokens to detect css Overrides
            for(let k_criteria in INTERESTING_TOKENS) {
                let criteria = INTERESTING_TOKENS[k_criteria];
                let satisfies = {};
                //Build the satisfaction object
                for (let k_token in criteria.tokens) {
                    let token = criteria.tokens[k_token];
                    satisfies[token] = false;
                    for(let k_lineToken in lineTokens){
                        if(lineTokens[k_lineToken].toLowerCase().includes(token.toLowerCase())){
                            satisfies[token] = true;
                        }
                    }
                }

                let isSatisfied = true;

                for(let k_satisfies in satisfies){
                    if(!satisfies[k_satisfies]){
                        isSatisfied = false;
                        break;
                    }
                }

                if(isSatisfied){//IF this line satisfies
                    console.log("Satisfaction:",satisfies);
                    criteria.function({n:i, lineTokens:lineTokens});
                }
            }
        }
    }
}

module.exports = languageParser;