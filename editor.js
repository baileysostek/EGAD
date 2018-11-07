const jqueryUI = require('jquery-ui');
const fancyTree = require('jquery.fancytree');


let myFileManager;
let myFileBrowser;
let myGrid;
let language;

let version = '18w39a';

//This is the perlenspeil instance
let Perlenspeil;

let editor;

let clipboard = '';
let suggestions = [];

//deboucer
let lastSize = 0;

function init() {
    //Initialize JQuery

    //Include all needed modules
    const grid = require('./grid');
    const fileManager = require('./fileManager');
    const fileBrowser = require('./fileBrowser');
    const languageParser = require('./languageParser');

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
            editor.setValue(result);
            language.loadFileSpecificData(result);
            lastSize = editor.doc.size;
            editor.on('change', function () {
                let newSize = editor.doc.size;
                let value = $('textArea').val();
                console.log(value);
                console.log("lastSize:",lastSize,"new Size:",newSize);
                if(!(newSize == lastSize)){
                    let delta = newSize - lastSize;
                    if(delta > 0){
                        console.log("Added ", delta, " lines.");
                    }
                    if(delta < 0){
                        console.log("Removed ", Math.abs(delta), " lines.");
                    }
                    language.offsetScopes(delta, editor.getCursor());
                }
                lastSize = newSize;
                let l_function = language.getSuggestion(language.getLastToken(language.tokeniseString(value)), editor.getCursor());
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
        outputConsole.innerText = 'Console';
        outputConsole.style.color = '#a9b7c6';
        let column2 = myGrid.addColumn(myGrid.createColumn([editorDiv, outputConsole], {'color':'#232323'}));
        // column2.registerCallback(editorDiv, function (data) {
        //     // console.log("Callback for this editorDiv being resized:",data);
        //     editor.setSize('auto', (((parseFloat(data.style.height)-3)/100)*screen.height));
        // });
        editor.setSize('auto', 'auto');

        let column3 = myGrid.addColumn(myGrid.createColumn("test", {'color':'#414141'}));
        // myGrid.addColumn(myGrid.createColumn("Test" , '#004106'));
        // myGrid.addColumn(myGrid.createColumn("test", '#002341'));


        let psTest = document.createElement("webview");
        // psTest.setAttribute("src", "http://users.wpi.edu/~bhsostek/Assignment13/game.html");
        psTest.setAttribute("src", 'Projects/'+myFileManager.loadedProject+'/game.html');
        psTest.style.height = 100+'%';
        psTest.addEventListener('console-message', (e) => {
            outputConsole.innerText += JSON.stringify(e) +'\n';
            $("#outputConsole").parent().scrollTop($("#outputConsole").parent().scrollHeight);
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
    myFileManager.writeToFile('game.js', editor.getValue()).then(function(result) {
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
        console.log(language.getSuggestion(language.getLastToken(language.tokeniseString(value)), editor.getCursor()));
    }
    console.log(editor.getCursor());
}

function paste(){
    let value = '';
    if(process.platform == 'darwin') {
        let proc =  require('child_process').spawn('pbpaste');
        proc.stdout.on('data', function(data) {
            value = data.toString();
            editor.replaceRange(value, editor.getCursor(), editor.getCursor());
        });
    }
}

function suggest(){
    if(suggestions){
        console.log("Suggesting@",editor.getCursor());
        console.log("Line:",editor.getLine(editor.getCursor().line));
        console.log("Token:",language.getLastToken(language.tokeniseString(editor.getLine(editor.getCursor().line))));
        console.log("Token Length:", language.getLastToken(language.tokeniseString(editor.getLine(editor.getCursor().line))).length);

        let lastToken = language.getLastToken(language.tokeniseString(editor.getLine(editor.getCursor().line)));
        let startPos = {
            line:editor.getCursor().line,
            ch:editor.getCursor().ch - lastToken[0].length
        };
        console.log("Start Pos:", startPos);
        editor.replaceRange(suggestions[0].getNAME(), startPos, editor.getCursor());
    }
}