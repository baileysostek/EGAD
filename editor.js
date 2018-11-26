//Initialize jquery and FancyTree
const jqueryUI = require('jquery-ui');
const fancyTree = require('jquery.fancytree');

//create references to subclasses so that we can interface with them.
//These are the modules that are loaded and specific to Perlenspeil IDE
let myFileManager;
let myFileBrowser;
let myGrid;
let language;

//Version number of this project.
let version = '18w39';

//This is the perlenspeil instance
let Perlenspeil;

//This is the reference to the codeMirror editor.
let editor;

//This is the set of all current suggestions
//TODO encapsulate this
let suggestions = [];

//TODO encapsulate this as a 'lineResize' event
let lastSize = 0;

function init() {
    //Include all needed modules
    const grid              = require('./grid');
    const fileManager       = require('./fileManager');
    const fileBrowser       = require('./fileBrowser');
    const languageParser    = require('./languageParser');

    //Initialize the file manager, and load the configuration file.
    myFileManager = new fileManager();
    myFileBrowser = new fileBrowser();
    myFileManager.initialize().then(function(result) {
        //Print out version information and Author information.
        console.log("Perlenspeil IDE Version:", version);
        console.log("Created by Bailey Sostek with the help of Professor Brian Moriarty in 2018");

        //Initialize the Grid API with the screen width and height. This will create a reasponsive grid that can hold the rest of the editor elements.
        myGrid = new grid(screen.width, screen.height);

        //Create the Editor and set up preliminary configuration data.
        let editorDiv = document.createElement('div');
        editorDiv.setAttribute('id', 'editor');
        editor = CodeMirror(editorDiv, {
            mode: "javascript",
            theme: "darcula",
            autofocus:true,
            lineNumbers: true,
            autoCloseBrackets: true,
            autoMatchBrackets: true,
            gutters: ["CodeMirror-linenumbers", "breakpoints"],
        });

        //Initialize the language from the language configuration file.
        language = new languageParser(result);

        // let titleBar = document.createElement('div');
        // titleBar.setAttribute('id', 'titleBar');
        // titleBar.innerText='HEy This is a test of the title bar.';
        // document.body.appendChild(titleBar);

        let testDiv4 = document.createElement('div');
        testDiv4.style.overflow = 'auto';
        testDiv4.innerText = '';

        //Set the Editor data to be the game.js of the current project.
        myFileManager.loadFile('game.js').then(function(result) {
            getEditor().setValue(result);
            language.loadFileSpecificData(result);
            lastSize = getEditor().doc.size;
            getEditor().on('change', function () {
                let newSize = getEditor().doc.size;
                let value = language.removeFrontSpacing(getEditor().getLine(getEditor().getCursor().line));

                console.log("lastSize:",lastSize,"new Size:",newSize);
                if(!(newSize == lastSize)){
                    let delta = newSize - lastSize;
                    if(delta > 0){
                        console.log("Added ", delta, " lines.");
                    }
                    if(delta < 0){
                        console.log("Removed ", Math.abs(delta), " lines.");
                    }
                    language.offsetScopes(delta, getEditor().getCursor());
                }

                console.log("Value:"+value);
                let l_function = language.getSuggestion(language.getLastToken(language.tokeniseString(value)), getEditor().getCursor());
                if(l_function){
                    console.log(l_function);
                    let tableText = '<table>';
                    for(let i = 0; i < l_function.length; i++){
                        tableText += '<tr>';
                        tableText += '<td>';
                        tableText += 'Suggestion:'+l_function[i].getNAME();
                        tableText += '</td>';
                        tableText += '</tr>';
                    }
                    tableText += '</table>';
                    testDiv4.innerHTML = tableText;
                }
                suggestions = l_function;
            });
        }, function(err) {
            console.log(err);
        });

        // editor.setSize('auto', 'auto');

        let testDiv3 = document.createElement('div');
        testDiv3.setAttribute('id', 'tree');

        let column1 = myGrid.addColumn(myGrid.createColumn([testDiv3, testDiv4] , {'color':'#414141'}));
        myFileManager.getProjectFiles().then(function(result) {
            $("#tree").fancytree({
                checkbox: true,
                selectMode: 3,
                source: result,
                // lazyLoad: function(event, data) {
                //     data.result = {url: "https://cdn.rawgit.com/mar10/fancytree/72e03685/demo/ajax-sub2.json"};
                // },

                activate: function(event, data) {
                    $("#statusLine").text(event.type + ": " + data.node);
                },
                select: function(event, data) {
                    $("#statusLine").text(
                        event.type + ": " + data.node.isSelected() + " " + data.node
                    );
                }
            });

        }, function(err) {
            console.log(err);
        });

        let outputConsole = document.createElement('div');
        outputConsole.setAttribute('id', 'outputConsole');
        outputConsole.style.color = '#a9b7c6';

        let inputConsole = document.createElement('input');
        inputConsole.setAttribute('type', 'text');

        let tabs = document.createElement('div');

        let column2 = myGrid.addColumn(myGrid.createColumn([tabs, editorDiv, outputConsole,inputConsole], {'color':'#232323'}));
        // column2.registerCallback(editorDiv, function (data) {
        //     // console.log("Callback for this editorDiv being resized:",data);
        //     editor.setSize('auto', (((parseFloat(data.style.height)-3)/100)*screen.height));
        // });
        editor.setSize('auto', 'auto');

        getEditor().on("gutterClick", function(cm, n) {
            var info = cm.lineInfo(n);
            cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
            console.log("Clicked on :",info);
            //Then determine if there are variables on that line
            console.log("vars in scope:",language.cursorToScope({line:info.line, ch:0}).getVars());
        });

        function makeMarker() {
            var marker = document.createElement("div");
            marker.style.color = "#822";
            marker.innerHTML = "●";
            return marker;
        }

        language.registerInterestInTokens(['var', 'color'], function(data){
            editor.setGutterMarker(data.n, "breakpoints", makeMarker());
        });

        let column3 = myGrid.addColumn(myGrid.createColumn("test", {'color':'#414141'}));
        // myGrid.addColumn(myGrid.createColumn("Test" , '#004106'));
        // myGrid.addColumn(myGrid.createColumn("test", '#002341'));


        let psTest = document.createElement("webview");
        // psTest.setAttribute("src", "http://users.wpi.edu/~bhsostek/Assignment13/game.html");
        psTest.setAttribute("src", 'Projects/'+myFileManager.loadedProject+'/game.html');
        psTest.style.height = 100+'%';
        psTest.addEventListener('console-message', (e) => {
            outputConsole.innerText += e.message;
            outputConsole.parentNode.scrollTop = outputConsole.parentNode.scrollHeight;
        });

        inputConsole.addEventListener("keyup", function(event) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Trigger the button element with a click
                psTest.executeJavaScript("PS.debug("+inputConsole.value+"\n);");
            }
        });

        Perlenspeil = psTest;

        let watchedVariables = document.createElement("webview");
        // psTest.setAttribute("src", "http://users.wpi.edu/~bhsostek/Assignment13/game.html");
        watchedVariables.setAttribute("src", 'http://users.wpi.edu/~bmoriarty/ps/api.html');
        watchedVariables.style.height = 100+'%';


        column3.addChild(psTest);
        column3.addChild(watchedVariables);

        myFileManager.getProjectData('WIDTHS').then(function(result) {
            //This is an array of arrays.
            myGrid.initializeGrid(result);
        }, function(err) {
            console.log(err);
        });

        myGrid.refresh();
        editor.refresh();



    }, function(err) {
        console.log(err);
    });
}

function getEditor() {
    return editor;
}


/**
 * Callback function executed when the windows close button is pressed.
 * The code below is a blocking call that must terminate before the window can be closed.
 **/
function onCloseRequested(){
    myFileManager.writeToProperties('WIDTHS', myGrid.getGridSize());
}

/**
 * Function to execute when the open project option is selected from the menu.
 * @param {Object} path
 * @path is the relative path to the currently opened project. It is a stringified json object that must be
 **/
function open(path){
    //Makes sure that a valid path was passed into this function, not undefined.
    if(path) {
        //Print the selected path
        console.log("Opening:" + path);
        //Turn Path from an object into a string that can be manipulated.
        //Replace all quote characters with nothing.
        path = JSON.stringify(path).replace(new RegExp('"', 'g'), '');
        //Break this path into its component directories by splitting the string into a string array on each '/' character.
        let brokenPath = path.split('\\');
        let cleanPath = [];
        //Take out unwanted characters.
        for (var i = 0; i < brokenPath.length; i++) {
            brokenPath[i] = brokenPath[i].replace('[', '').replace(']', '');
            if (brokenPath[i]) {
                cleanPath.push(brokenPath[i]);
            }
        }
        //Print our cleaned path.
        console.log("Clean Path:"+cleanPath);
        //Reload the editor with the new data.
        Perlenspeil.setAttribute("src", 'Projects/' + cleanPath[cleanPath.length - 1] + '/game.html');
    }else{ //When no path is selected this portion of the function triggers.
        console.log("No Directory Selected.");
    }
}

function save(){
    console.log("Save");
    myFileManager.writeToFile('game.js', getEditor().getValue()).then(function(result) {
        Perlenspeil.setAttribute("src", 'Projects/'+myFileManager.loadedProject+'/game.html');
    }, function(err) {
        console.log(err);
    });
    console.log(myGrid.getGridSize());
}

function copy(){
    //This is the OSX copy function
    if(process.platform == 'darwin') {
        let proc = require('child_process').spawn('pbcopy');
        let value = $('textArea').val();
        proc.stdin.write(value);
        proc.stdin.end();
        console.log(language.getSuggestion(language.getLastToken(language.tokeniseString(value)), getEditor().getCursor()));
    }
    console.log(getEditor().getCursor());
}

function paste(){
    let value = '';
    if(process.platform == 'darwin') {
        let proc =  require('child_process').spawn('pbpaste');
        proc.stdout.on('data', function(data) {
            value = data.toString();
            getEditor().replaceRange(value, getEditor().getCursor(), getEditor().getCursor());
        });
    }
}

function suggest(){
    if(suggestions){
        // console.log("Suggesting@",getEditor().getCursor());
        // console.log("Line:",getEditor().getLine(getEditor().getCursor().line));
        // console.log("Token:",language.getLastToken(language.tokeniseString(language.removeFrontSpacing(getEditor().getLine(getEditor().getCursor().line)))));
        // console.log("Token Length:", language.getLastToken(language.tokeniseString(getEditor().getLine(getEditor().getCursor().line))).length);

        let lastToken = language.getLastToken(language.tokeniseString(getEditor().getLine(getEditor().getCursor().line)));
        let startPos = {
            line:getEditor().getCursor().line,
            ch:getEditor().getCursor().ch - language.getLastToken(language.tokeniseString(getEditor().getLine(getEditor().getCursor().line))).length
        };
        console.log("Start Pos:", startPos);
        getEditor().replaceRange(suggestions[0].getNAME(), startPos, getEditor().getCursor());
    }
}