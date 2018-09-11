//Created by Bailey Sostek 9/5/2018
let WIDTH = 0;
let HEIGHT = 0;

let COLUMNS = [];
let DRAGS = [];

const COLUMN_TAG = 'column';
const DRAG_TAG = 'drag';
const ROW_TAG = 'row';

const DRAG_PRIORITY = {
    PRIMARY:0,
    SECONDARY:1
};

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
        column.innerText = name;
        return {
            dragPriority:DRAG_PRIORITY.PRIMARY,
            delta:0,
            name:name,
            element:column,
            index:0,
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
        // drag.style.backgroundColor = "#ffffff00";
        drag.style.backgroundColor = "#212121";
        drag.style.position = "absolute";
        drag.style.height = 100+'%';
        drag.style.width = 3+'px';
        var that = this;
        drag.addEventListener("drag", function( event) {
            that.onDrag(event, col1.index, col2.index);
        }, false);
        drag.setAttribute("draggable", true);
        return{
            offset:0,
            column1:col1,
            column2:col2,
            element:drag
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
        let count = COLUMNS.length;
        for(var i = 0; i < count; i++){
            COLUMNS[i].element.style.width = ((Math.ceil((1.0/count) * 100))+(COLUMNS[i].delta))+'%';
            COLUMNS[i].element.style.left = ((i / count) * 100) + '%';
        }
    }


    onDrag(event, index1, index2){
        console.log(event);
        //Determine sum of previous segments
        let preColumnOffset = 0;
        for(var i = 0; i < index1; i++){
            preColumnOffset += parseFloat(COLUMNS[i].element.style.width);
        }
        if(event.screenX > 0) {
            // console.log("Event",event);
            COLUMNS[index1].delta = (((parseFloat(DRAGS[index1].element.style.left) / WIDTH) - (event.screenX / WIDTH) + (1.0 / COLUMNS.length)) * -100);
            COLUMNS[index1].dragPriority = DRAG_PRIORITY.PRIMARY;
            COLUMNS[index2].delta = (((parseFloat(DRAGS[index1].element.style.left) / WIDTH) - (event.screenX / WIDTH) + (1.0 / COLUMNS.length)) * 100);
            COLUMNS[index2].dragPriority = DRAG_PRIORITY.SECONDARY;
            COLUMNS[index1].element.style.width = ((COLUMNS[index1].delta) + (1.0 / COLUMNS.length * 100))+'%';
            COLUMNS[index2].element.style.width = ((COLUMNS[index2].delta) + (1.0 / COLUMNS.length * 100))+'%';
            COLUMNS[index2].element.style.left = (parseFloat(COLUMNS[index1].element.style.left) + parseFloat(COLUMNS[index1].element.style.width)) + '%';
        }else{
            /*
                Since each Drag links two columns, the size of our Drag array is (COLUMNS.length - 1)
                because of this we need to only access the drag array when n < length-1
             */
            DRAGS[index1].element.style.left = ((parseFloat(COLUMNS[index1].element.style.left) + parseFloat(COLUMNS[index1].element.style.width)) - preColumnOffset) + '%';
        }
    }

    resize(){
        WIDTH = document.body.clientWidth;
        HEIGHT = document.body.clientHeight;
        console.log("WIDTH:",WIDTH,"HEIGHT:",HEIGHT);
        this.refresh();
    }

};