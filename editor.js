const jqueryUI = require('jquery-ui');
const fancyTree = require('jquery.fancytree');


let myFileManager;
let myFileBrowser;
let myGrid;

let version = '18w39a';

//This is the perlenspeil instance
let Perlenspeil;

let editor;

function init() {
    //Initialize JQuery

    //Include all needed modules
    const grid = require('./grid');
    const fileManager = require('./fileManager');
    const fileBrowser = require('./fileBrowser');

    //Initialize the file manager, and load the configuration file.
    myFileManager = new fileManager();
    myFileBrowser = new fileBrowser();
    myFileManager.initialize().then(function(result) {

        console.log("Perlenspeil IDE Version:", version);
        console.log("Created by Bailey Sostek with the help of Professor Brian Moriarty in 2018");

        myGrid = new grid(screen.width, screen.height);

        let editorDiv = document.createElement('div');
        editorDiv.setAttribute('id', 'editor');
        editor = CodeMirror(editorDiv, {
            mode: "javascript",
            theme: "darcula",
            lineNumbers: true,
        });


        //Set the Editor data to be the game.js of the current project.
        myFileManager.loadFile('game.js').then(function(result) {
            editor.setValue(result);
        }, function(err) {
            console.log(err);
        });

        editor.setSize('auto', 1200+'px');

        let column1 = myGrid.addColumn(myGrid.createColumn("Test" , {'color':'#414141', 'id':'tree'}));
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

        let column2 = myGrid.addColumn(myGrid.createColumn([editorDiv, document.createElement('div')], {'color':'#232323'}));
        let column3 = myGrid.addColumn(myGrid.createColumn("test", {'color':'#414141'}));
        // myGrid.addColumn(myGrid.createColumn("Test" , '#004106'));
        // myGrid.addColumn(myGrid.createColumn("test", '#002341'));


        let psTest = document.createElement("webview");
        // psTest.setAttribute("src", "http://users.wpi.edu/~bhsostek/Assignment13/game.html");
        psTest.setAttribute("src", 'Projects/'+myFileManager.loadedProject+'/game.html');
        psTest.style.height = 100+'%';

        Perlenspeil = psTest;

        column3.setChildren(psTest);

        myFileManager.getProjectData('WIDTHS').then(function(result) {
            console.log("WIDTHS", result);
            myGrid.initializeWidths(result);
        }, function(err) {
            console.log(err);
        });

        myGrid.refresh();
        editor.refresh();

    }, function(err) {
        console.log(err);
    });
}

function onCloseRequested(){
    myFileManager.writeToProperties('WIDTHS', myGrid.getColumnWidths());
}

function save(){
    console.log("Save");
    myFileManager.writeToFile('game.js', editor.getValue()).then(function(result) {
        Perlenspeil.setAttribute("src", 'Projects/'+myFileManager.loadedProject+'/game.html');
    }, function(err) {
        console.log(err);
    });
}