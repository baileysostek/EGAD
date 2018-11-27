//Created by Bailey Sostek 9/5/2018
let WIDTH = 0;
let HEIGHT = 0;

let COLUMNS = [];
let DRAGS = [];

const COLUMN_TAG = 'column';
const DRAG_TAG = 'drag';
const V_DRAG_TAG = 'vdrag';
const ROW_TAG = 'row';

const COLUMN_MIN_WIDTH = 5;
const DRAG_WIDTH = 9 ;

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
        this.WIDTH = width;
        this.HEIGHT = height;
        console.log("Initializing Columns API");
        console.log("Width:"+this.WIDTH);
        console.log("Height:"+this.HEIGHT);
        let that = this;
        window.addEventListener('resize', function(e){
            e.preventDefault();
            that.resize();
        })
    }

    /**
     * Creates a Column. A column is a resizable container for data.
     * Columns contain an index (left to right) starting at 0, a list of children
     * representing which column they are numerically on the screen.
     * @class
     * @param {Array, Object} elements, properties
     * @param {String} properties.color - A hexedecimal color to apply to the background of this column.
     * @returns {String, Element} Returns a json object representing a Column.
     */
    createColumn(elements, properties){
        let column = document.createElement(COLUMN_TAG);
        if(properties['color']) {
            column.style.backgroundColor = properties.color;
        }
        if(properties['id']) {
            column.id = properties.id;
        }
        column.style.height = 100+'%';
        column.style.position = "absolute";

        //Object attributes initialized here.
        let rows = [];
        let vDrags = [];

        //Determine if the passed elements are an array
        if(elements instanceof HTMLElement) {    //Pass a single element.
            let row = document.createElement(ROW_TAG);
            row.style.width  = 100+'%';
            row.style.height = (1 / 1 * 100)+'%';
            row.style.top    = (0 / 1 * 100)+'%';
            row.style.overflow = 'auto';
            row.style.position = "absolute";
            row.appendChild(elements);
            rows.push(row);
            column.appendChild(row);
        }else if(elements.constructor === Array){//Pass an array of elements.
            let elementCount = elements.length;
            for(var i = 0; i < elementCount; i++){
                if(elements[i] instanceof HTMLElement) {
                    //Create our row element
                    let row = document.createElement(ROW_TAG);
                    row.style.width  = 100+'%';
                    row.style.height = (1 / elementCount * 100)+'%';
                    row.style.top    = (i / elementCount * 100)+'%';
                    row.style.position = "absolute";
                    row.style.overflow = 'auto';
                    //Append the htmlElement to this row. This parents the content to the row, so that the elements content can be resized to the divs dimensions.
                    row.appendChild(elements[i]);
                    rows.push(row);
                    //
                    column.appendChild(row);

                    if(rows.length > 1) {
                        let vDrag = this.createVDrag(rows[rows.length-2], rows[rows.length-1]);
                        column.appendChild(vDrag.element);
                        vDrags.push(vDrag);
                    }
                }
            }
        }

        return {
            element:column,
            index:0,
            ROWS:rows,
            V_DRAGS:vDrags,
            onDragEnd:this.onDragEnd,
            onVDrag:this.onVDrag,
            createVDrag:this.createVDrag,
            callbacks:[],
            executeElementsCallback:function(element, data){
                for (var i = 0; i < this.ROWS.length; i++) {
                    if (this.ROWS[i].childNodes[0] === element || this.ROWS[i] === element) { //IF this row element is exactly the callback element OR a row contained within this column is passed.
                        if(this.callbacks[i]){ //If the element has a registered callback execute it.
                            this.callbacks[i](data);
                        }
                    }
                }
            },
            registerCallback: function(element, callback){
                findLoop:{
                    //Look for the passed in element, to regester a callback
                    for (var i = 0; i < this.ROWS.length; i++) {
                        if (this.ROWS[i].childNodes[0] === element) { //IF this row element is exactly this element.
                            this.callbacks[i] = callback;
                            console.log("Callback registered.");
                            break findLoop;
                        }
                    }
                    //This is reached if
                    console.log("Wlement not found; Callback was not registered.");
                }
            },
            //TODO build a row here.
            addChild: function(child){
                //Create our row element
                let row = document.createElement(ROW_TAG);
                //TODO replace the 33% with a re-allocated piece of the 100% screenspace
                row.style.width  = 100+'%';
                row.style.height = (33)+'%';
                row.style.top    = (33)+'%';
                row.style.position = "absolute";
                row.style.overflow = 'auto';
                //Append the htmlElement to this row. This parents the content to the row, so that the elements content can be resized to the divs dimensions.
                row.appendChild(child);
                this.ROWS.push(row);
                //
                this.element.appendChild(row);

                if(this.ROWS.length > 1) {
                    let vDrag = this.createVDrag(this.ROWS[this.ROWS.length-2], this.ROWS[this.ROWS.length-1]);
                    this.element.appendChild(vDrag.element);
                    this.V_DRAGS.push(vDrag);
                }
            }
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
        drag.style.backgroundColor = "#b8b8b8";
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

    createVDrag(row1, row2){
        let drag = document.createElement(V_DRAG_TAG);
        drag.style.backgroundColor = "#b8b8b8";
        drag.style.position = "absolute";
        drag.style.height = DRAG_WIDTH+'px';
        drag.style.width = 100+'%';
        drag.style.cursor = 'row-resize';
        var that = this;
        drag.addEventListener("drag", function( event) {
            that.onVDrag(event, row1, row2);
        }, false);
        drag.addEventListener("dragend", function() {
            that.onDragEnd();
        }, false);
        drag.setAttribute("draggable", true);
        return{
            offset:0,
            row1:row1,
            row2:row2,
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
            return column;
        }else{
            console.log("Tried to add a column that was not a column element.",column);
            return null;
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
        for(var i = 0; i < COLUMNS.length; i++){
            for(var j = 0; j < COLUMNS[i].V_DRAGS.length; j++){
                COLUMNS[i].V_DRAGS[j].element.style.top = (parseFloat(COLUMNS[i].V_DRAGS[j].row2.style.top)-(COLUMNS[i].V_DRAGS[j].width()/2))+'%';
            }
        }
    }


    onDrag(event, index1, index2){
        let screenPercentPos = ((event.screenX / this.getWIDTH()) * 100);
        if(screenPercentPos > (parseFloat(COLUMNS[index1].element.style.left) + COLUMN_MIN_WIDTH) && screenPercentPos < (parseFloat(COLUMNS[index2].element.style.left) + parseFloat(COLUMNS[index2].element.style.width) - COLUMN_MIN_WIDTH)) {
            //Index 1 Left is never Going to change
            let col1X = (parseFloat(COLUMNS[index1].element.style.left)/100) * this.getWIDTH(); //PX coords of the start of this column
            let col2X = (parseFloat(COLUMNS[index2].element.style.left)/100) * this.getWIDTH(); //PX coords of the start of this column
            let dragX = event.screenX;
            let col2Width = col2X + ((parseFloat(COLUMNS[index2].element.style.width)/100) * this.getWIDTH());
            // console.log('COL1',((dragX - col1X)/WIDTH * 100));
            // console.log('COL2',((col2Width - dragX)/WIDTH * 100));
            COLUMNS[index1].element.style.width = ((dragX - col1X)/this.getWIDTH() * 100)+'%';
            COLUMNS[index2].element.style.width = ((col2Width - dragX)/this.getWIDTH() * 100) +'%';
            COLUMNS[index2].element.style.left = (dragX / this.getWIDTH() * 100) + '%';
        }
    }

    onVDrag(event, row1, row2){
        if(!this.getHEIGHT){
            console.log("This is wrong",this);
        }
        if(event.screenY > 0) {
            let screenPercentPos = ((event.screenY / this.getHEIGHT()) * 100);
            //Index 1 Left is never Going to change
            let row1Y = (parseFloat(row1.style.top) / 100) * this.getHEIGHT(); //PX coords of the start of this column
            let row2Y = (parseFloat(row2.style.top) / 100) * this.getHEIGHT(); //PX coords of the start of this column
            let dragY = event.screenY;
            let row2Height = row2Y + ((parseFloat(row2.style.height) / 100) * this.getHEIGHT());
            row1.style.height = ((dragY - row1Y) / this.getHEIGHT() * 100) + '%';
            row2.style.height = ((row2Height - dragY) / this.getHEIGHT() * 100) + '%';
            row2.style.top = (dragY / this.getHEIGHT() * 100) + '%';
            for(var i = 0; i < COLUMNS.length; i++){
                let column = COLUMNS[i];
                column.executeElementsCallback(row1, row1);
                column.executeElementsCallback(row2, row2);
            }
        }
    }

    executeCallbacks(){
        for(var i = 0; i < COLUMNS.length; i++){
            let column = COLUMNS[i];
            for(var j = 0; j < column.ROWS.length; j++) {
                let element = column.ROWS[j];
                column.executeElementsCallback(element, element);
            }
        }
    }

    onDragEnd(){
        for(var i = 0; i < DRAGS.length; i++){
            //col2 x - drag.width/2
            DRAGS[i].element.style.left = (parseFloat(DRAGS[i].column2.element.style.left)-(DRAGS[i].width()/2))+'%';
        }
        for(var i = 0; i < COLUMNS.length; i++){
            for(var j = 0; j < COLUMNS[i].V_DRAGS.length; j++){
                COLUMNS[i].V_DRAGS[j].element.style.top = (parseFloat(COLUMNS[i].V_DRAGS[j].row2.style.top)-(COLUMNS[i].V_DRAGS[j].width()/2))+'%';
            }
        }
    }

    resize(){
        WIDTH = document.body.clientWidth;
        HEIGHT = document.body.clientHeight;
    }

    initializeGrid(widthArray){
        if(widthArray.length != COLUMNS.length){
            console.error(widthArray.length + ' widths passed into column initialize. Expected '+COLUMNS.length+" to be passed.");
        }else{
            //Initialize the columns to be the saved size from the last time the editor was closed.
            let runningLeftWidth = 0;
            for(var i = 0; i < widthArray.length; i++){
                COLUMNS[i].element.style.width = (widthArray[i][0])+'%';
                COLUMNS[i].element.style.left = (runningLeftWidth)+ '%';
                runningLeftWidth += widthArray[i][0];
                let runningTopHeight = 0;
                for(var j = 0; j < COLUMNS[i].ROWS.length; j++){
                    COLUMNS[i].ROWS[j].style.height = (widthArray[i][1+j])+'%';
                    COLUMNS[i].ROWS[j].style.top = (runningTopHeight)+ '%';
                    runningTopHeight += widthArray[i][1+j];
                    if(runningTopHeight > 100){
                        console.log("Running height is too big:"+runningLeftWidth);
                        let offsetAmmount = (runningLeftWidth - 100.0);
                        COLUMNS[i].ROWS[j].style.height = ((widthArray[i][1+j])-offsetAmmount)+'%';
                    }
                }
            }
            this.refresh();
            this.executeCallbacks();
        }
    }

    getGridSize(){
        let out = [];
        console.log(COLUMNS);
        for(var i = 0; i < COLUMNS.length; i++){
            let column = [];
            console.log(COLUMNS[i]);
            column.push(parseFloat(COLUMNS[i].element.style.width));
            for(var j = 0; j < COLUMNS[i].ROWS.length; j++){
                column.push(parseFloat(COLUMNS[i].ROWS[j].style.height));
            }
            out.push(column);
        }
        console.log(out);
        return out;
    }

    getWIDTH(){
        return this.WIDTH;
    }

    getHEIGHT(){
        return this.HEIGHT
    }

};