//Created by Bailey Sostek 9/5/2018
let WIDTH = 0;
let HEIGHT = 0;

let COLUMNS = [];
let DRAGS = [];

const COLUMN_TAG = 'column';
const DRAG_TAG = 'drag';
const ROW_TAG = 'row';

const COLUMN_MIN_WIDTH = 5;
const DRAG_WIDTH = 9  ;

/**
 * Creates a new Grid, this contains columns and drag elements.
 * @class
 */
module.exports = class Grid{
    /**
     * The Grid class takes in the window width and height, passed in to establish a basic window size.
     * @param {Number, Number} width, height
     * @returns {Grid} Returns an instance of the Grid class.
     */
    constructor(width, height){
        WIDTH = width;
        HEIGHT = height;
        console.log("Initializing Perlenspeil IDE Version 0.1");
        console.log("Width:"+width);
        console.log("Height:"+height);
        let that = this;
        window.addEventListener('resize', function(e){
            e.preventDefault();
            that.resize();
        })
    }

    /**
     * Creates a Column. A column is a resizable container for data.
     * @class
     * @param {String, String} name, color
     * @returns {String, Element} Returns a json object representing a Column.
     */
    createColumn(name, color){
        let column = document.createElement(COLUMN_TAG);
        column.style.backgroundColor = color;
        column.style.height = 100+'%';
        column.style.position = "absolute";

        if(name instanceof HTMLElement) {
            column.appendChild(name);
            name.style.height = 100+'%';
        }

        for(var i = 0; i < 3; i++) {
            let row = document.createElement(ROW_TAG);
            row.style.width  = 100+'%';
            row.style.height = (1 / 3 * 100)+'%';
            row.style.top    = (i / 3 * 100)+'%';
            // row.style.backgroundColor = 'rgb('+23+','+ 132+','+11+')';
            row.style.position = "absolute";
            column.appendChild(row);
        }

        return {
            name:name,
            element:column,
            index:0,
            vDrags:[]
        }
    }

    /**
     * Creates a Drag. A drag is a small element conjoining two Columns. Clicking and dragging on a Drag will change the
     * relative scale of the linked columns.
     * @class
     * @param {COLUMN, COLUMN} col1, col2
     * @returns {String, Element} Returns a json object representing a Column.
     */
    createDrag(col1, col2){
        let drag = document.createElement(DRAG_TAG);
        drag.style.backgroundColor = "#212121";
        drag.style.position = "absolute";
        drag.style.height = 100+'%';
        drag.style.width = DRAG_WIDTH+'px';
        drag.style.cursor = 'col-resize';
        var that = this;
        drag.addEventListener("drag", function( event) {
            that.onDrag(event, col1.index, col2.index);
        }, false);
        drag.addEventListener("dragend", function() {
            that.onDragEnd();
        }, false);
        drag.setAttribute("draggable", true);
        return{
            offset:0,
            column1:col1,
            column2:col2,
            element:drag,
            width:function () {
                return (DRAG_WIDTH / WIDTH) * 100; //%
            }
        }
    }

    addColumn(column){
        if(column['element']) {
            document.body.appendChild(column.element);
            column.index = COLUMNS.length;
            COLUMNS.push(column);
            /*
                If there are more than one columns in the world, then we need to add the dragging functionality.
                A Drag element is created, it references two columns.
             */
            if(COLUMNS.length > 1){
                //Link the column at (n) to the column at (n-1)
                this.addDrag(this.createDrag(COLUMNS[COLUMNS.length-2], COLUMNS[COLUMNS.length-1]));
            }
            let count = COLUMNS.length;
            for(var i = 0; i < count; i++){
                COLUMNS[i].element.style.width = ((1.0/count) * 100)+'%';
                COLUMNS[i].element.style.left = ((i / count) * 100)+ '%';
            }
        }else{
            console.log("Tried to add a column that was not a column element.",column);
        }
    }

    addDrag(drag){
        if(drag['element']) {
            document.body.appendChild(drag.element);
            DRAGS.push(drag);
        }else{
            console.log("Tried to add an object that was not a drag element.",drag);
        }
    }

    refresh(){
        for(var i = 0; i < DRAGS.length; i++){
            DRAGS[i].element.style.left = (parseFloat(DRAGS[i].column2.element.style.left)-(DRAGS[i].width()/2))+'%';
        }
    }


    onDrag(event, index1, index2){
        let screenPersentPos = ((event.screenX / WIDTH) * 100);
        if(screenPersentPos > (parseFloat(COLUMNS[index1].element.style.left) + COLUMN_MIN_WIDTH) && screenPersentPos < (parseFloat(COLUMNS[index2].element.style.left) + parseFloat(COLUMNS[index2].element.style.width) - COLUMN_MIN_WIDTH)) {
            //Index 1 Left is never Going to change
            let col1X = (parseFloat(COLUMNS[index1].element.style.left)/100) * WIDTH; //PX coords of the start of this column
            let col2X = (parseFloat(COLUMNS[index2].element.style.left)/100) * WIDTH; //PX coords of the start of this column
            let dragX = event.screenX;
            let col2Width = col2X + ((parseFloat(COLUMNS[index2].element.style.width)/100) * WIDTH);
            // console.log('COL1',((dragX - col1X)/WIDTH * 100));
            // console.log('COL2',((col2Width - dragX)/WIDTH * 100));
            COLUMNS[index1].element.style.width = ((dragX - col1X)/WIDTH * 100)+'%';
            COLUMNS[index2].element.style.width = ((col2Width - dragX)/WIDTH * 100) +'%';
            COLUMNS[index2].element.style.left = (dragX / WIDTH * 100) + '%';
        }
    }

    onDragEnd(){
        for(var i = 0; i < DRAGS.length; i++){
            //col2 x - drag.width/2
            DRAGS[i].element.style.left = (parseFloat(DRAGS[i].column2.element.style.left)-(DRAGS[i].width()/2))+'%';
        }
    }

    resize(){
        WIDTH = document.body.clientWidth;
        HEIGHT = document.body.clientHeight;

    }

    initializeWidths(widthArray){
        if(widthArray.length != COLUMNS.length){
            console.error(widthArray.length + ' widths passed into column initialize. Expected '+COLUMNS.length+" to be passed.");
        }else{
            //Initialize the columns to be the saved size from the last time the editor was closed.
            let runningLeftWidth = 0;
            for(var i = 0; i < widthArray.length; i++){
                COLUMNS[i].element.style.width = (widthArray[i])+'%';
                COLUMNS[i].element.style.left = (runningLeftWidth)+ '%';
                runningLeftWidth += widthArray[i];
            }
            this.refresh();
        }
    }

    getColumnWidths(){
        let widths = [];
        for(var i = 0; i < COLUMNS.length; i++){
            widths.push(parseFloat(COLUMNS[i].element.style.width));
        }
        return widths;
    }

};