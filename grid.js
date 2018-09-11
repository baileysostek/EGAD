//Created by Bailey Sostek 9/5/2018
let WIDTH = 0;
let HEIGHT = 0;

let COLUMNS = [];

const COLUMNS_TAG = 'columns';
const COLUMN_TAG = 'column';
const ROW_TAG = 'row';

module.exports = class Grid{
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

    createColumn(name, color){
        let column = document.createElement(COLUMN_TAG);
        column.style.backgroundColor = color;
        column.style.position = "absolute";
        column.innerText = name;
        return {
            name:name,
            element:column
        }
    }

    addColumn(column){
        if(column['element']) {
            document.body.appendChild(column.element);
            COLUMNS.push(column);
        }else{
            console.log("Tried to add a column that was not a column element.",column);
        }
    }

    refresh(){
        let count = COLUMNS.length;
        console.log("There are "+count+"columns");
        for(var i = 0; i < count; i++){
            COLUMNS[i].element.style.width = ((1.0/count) * 100)+'%';
            COLUMNS[i].element.style.left = (i/count)*WIDTH + 'px';
        }
    }

    resize(){
        WIDTH = document.body.clientWidth;
        HEIGHT = document.body.clientHeight;
        console.log("WIDTH:",WIDTH,"HEIGHT:",HEIGHT);
        this.refresh();
    }

};