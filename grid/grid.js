//Created by Bailey Sostek 9/5/2018

//These are the width and height of the grid as a whole. This determines the relative size of the rest of the grid.
let WIDTH = 0;
let HEIGHT = 0;

let COLUMNS = [];
let DRAGS = [];

const GRID_TAG = 'grid';
const COLUMN_TAG = 'column';
const DRAG_TAG = 'drag';
const V_DRAG_TAG = 'vdrag';
const ROW_TAG = 'row';

const COLUMN_MIN_WIDTH = 5;
const DRAG_WIDTH = 9 ;

let gridContainer;
let loadingContainer;

//If this is true, the grid will display a grey screen while loading.
let BLOCKING_LOAD = false;

let SAVE_DATA = {};

/**
 * Creates a new Grid, this contains columns, rows, and drag elements.
 * Columns are vertical and can have n rows inside them.
 * Rows are containers for divs, as the rows are resided, the div content will also be resided to fit.
 */
class Grid{
    /**
     * The Grid class takes in the window width and height, passed in to establish a basic window size. The default grid has no rows or columns within it. To add content call the {@link Grid#createColumn} method.
     * @param {Number} width - This is the width of the grid in pixels.
     * @param {Number} height - This is the height of the grid in pixels.
     * @param {Number} columns - This is the number of columns that the grid should be initialized with.
     * @param {Number} rows - This is the number of rows that each column should have.
     * @returns {Grid} Returns an instance of the Grid class.
     */
    constructor(width, height, rows, columns, saveData = {}){
        this.WIDTH = width;
        this.HEIGHT = height;

        SAVE_DATA = saveData;

        console.log("Creating Grid [",rows,",",columns,']');
        console.log("Width:"+this.WIDTH);
        console.log("Height:"+this.HEIGHT);

        if(BLOCKING_LOAD) {
            //Create the basic background div to show while loading
            loadingContainer = document.createElement('div');
            loadingContainer.setAttribute('id', "loading");
            loadingContainer.style.width = this.WIDTH + 'px';
            loadingContainer.style.height = this.HEIGHT + 'px';
            loadingContainer.style.position = "absolute";
            loadingContainer.style.backgroundColor = "#191919";
            document.body.appendChild(loadingContainer);
        }

        //Create the gird and hide it
        gridContainer = document.createElement('div');
        gridContainer.setAttribute('id', GRID_TAG);
        if(BLOCKING_LOAD) {
            gridContainer.style.visibility = "hidden";
        }
        document.body.appendChild(gridContainer);


        //Capture the windows resize event, on resize the local grid resize function is called.
        window.addEventListener('resize', (e) => {
            e.preventDefault();
            this.resize();
        });

        this.resize();

        for(let i = 0; i < rows; i++) {
            let rows = [];
            for(let j = 0; j < columns; j++){
                rows.push(document.createElement('div'));
            }
            this.addColumn(this.createColumn(rows, {'color': '#002303'}));
        }

        this.onDragEnd();

    }

    //DEFINE ALL DATA-TYPES FOR THIS CLASS

    /**
     * @typedef {Object} Column
     * @property {Element}  element                 - The dom element for this column.
     * @property {Integer}  index                   - The numerical index for this column, the left-most column is zero and the index increases as more columns are added.
     * @property {Array}    ROWS                    - An array of Row Objects representing the content inside of this column.
     * @property {Array}    WIDGETS                 - An array of Widget objects, representing all widgets loaded in this column.
     * @property {Function} LAST                    - This function returns the widget in the last row of this column.
     * @property {Array}    V_DRAGS                 - An array of Vertical Drag dom elements, these elements have a drag watcher attached to them and a callback function resize two rows in this column.
     * @property {Function} onDragEnd               - A callback function that is executed whenever this column has been drug, and the mouse is released
     * @property {Function} onVDrag                 - A callback function that is executed whenever this column is in the process of being drug.
     * @property {Function} createVDrag             - A function to add a Vertical Drag to this column, the vertical drag will enable rows to be resided dynamically.
     * @property {Array}    callbacks               - An array of callback functions to be executed when this column is resided.
     * @property {Function} executeElementsCallback - This is the function which is executed whenever this column is resided, it then in part executes all of the functions defined in the callback array.
     * @property {Function} registerCallback        - This function is called to register interest in a specific row. A callback function is also passed, this callback will be executed when that specific element is resided.
     */

    /**
     * @typedef {Object} H_Drag
     * @property {Integer}  offset  - Im not sure what this dose
     * @property {Column}   column1 - The numerical index for this column, the left-most column is zero and the index increases as more columns are added.
     * @property {Column}   column2 - An array of Row Objects representing the content inside of this column.
     * @property {Element}  element - The dom element for this drag.
     * @property {Function} width   - The size of this drags dom element in terms of window%
     */

    /**
     * Creates a Column. A column is a resizable container for data.
     * Columns contain an index (left to right) starting at 0,
     * representing which column they are numerically on the screen.
     * Columns also contain  a list of children
     * @param {Array} elements - This is an array or a single html element. For every dom element passed, a new unique row will be created in this column
     * @param {Object} properties - These are additional configuration parameters that can be passed into a column.
     * @param {String} properties.color - A hexadecimal color to apply to the background of this column.
     * @param {String} properties.id - a string representing the ID that should be associated with this column
     * @returns {Column} A json object representing a Column.
     */
    createColumn(elements, properties){
        //Create an element with the configurable COLUMN_TAG tag type
        let column = document.createElement(COLUMN_TAG);

        //The following block of code defines what properties we are interested in on the passed configuration element.
        if(properties['color']) {
            column.style.backgroundColor = properties.color;
        }
        if(properties['id']) {
            column.id = properties.id;
        }

        //Initial css styling.
        column.style.height = 100+'%';
        column.style.position = "absolute";

        //Object attributes initialized here.
        let rows    = [];
        let vDrags  = [];
        let widgets = [];

        //Depending on if element is an arrary or not, we need to treat the object differently. This determines if 'element' is an array or not.
        if(elements instanceof HTMLElement) {    //Pass a single element.
            let row = document.createElement(ROW_TAG);
            row.style.width  = 100+'%';
            row.style.height = (1 / 1 * 100)+'%';
            row.style.top    = (0 / 1 * 100)+'%';
            row.style.overflow = 'auto';
            row.style.position = "absolute";
            row.appendChild(elements);
            rows.push(row);
            widgets.push({});
            column.appendChild(row);
        }else if(elements.constructor === Array){//Pass an array of elements.
            let elementCount = elements.length;
            //For each passed element create a unique row.
            for(let i = 0; i < elementCount; i++){
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
                    widgets.push({});
                    //
                    column.appendChild(row);

                    //The drag elements that we create take up a non-trivial ammount of space, any element that is created needs to have its margins offset such that it dose not overlap with the drag element.
                    // if(i > 0){
                    //     elements[i].style.paddingTop    = Math.ceil(DRAG_WIDTH/2)+'px';
                    // }
                    // if(i < elementCount){
                    //     elements[i].style.paddingBottom = Math.ceil(DRAG_WIDTH/2)+'px';
                    // }
                    // if(COLUMNS.length > 0){
                    //     elements[i].style.paddingLeft   = Math.ceil(DRAG_WIDTH/2)+'px';
                    //     elements[i].style.paddingRIGHT  = Math.ceil(DRAG_WIDTH/2)+'px';
                    // }

                    //Rows can be drug vertically, we need there to be n-1 vertical drag elements because each drag controlls 2 rows.
                    //We skip adding a drag to the very first row in a column because this drag would appear at the very top of the page, and would only have the first element to modify.
                    if(rows.length > 1) {
                        let vDrag = this.createVDrag(rows[rows.length-2], rows[rows.length-1]);
                        column.appendChild(vDrag.element);
                        vDrags.push(vDrag);
                    }
                }
            }
        }

        //This is the row object that is returned.
        return {
            element:column,
            index:0,
            ROWS:rows,
            WIDGETS:widgets,
            V_DRAGS:vDrags,
            onDragEnd:this.onDragEnd,
            onVDrag:this.onVDrag,
            createVDrag:this.createVDrag,
            callbacks:[],
            LAST:()=>{
                return widgets[widgets.length-1];
            },
            getHEIGHT:()=>{
                return this.HEIGHT;
            },
            executeElementsCallback:function(element, data){
                for (let i = 0; i < this.ROWS.length; i++) {
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
                    for (let i = 0; i < this.ROWS.length; i++) {
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
                //Scale our existing elements
                let scalar = (100.0/(this.ROWS.length+1));
                let runningHeight = 0;

                for(let i = 0; i < this.ROWS.length; i++){
                    this.ROWS[i].style.height = (scalar) + '%';
                    this.ROWS[i].style.top = runningHeight + '%';
                    runningHeight += (scalar);
                }

                //Create our row element
                let row = document.createElement(ROW_TAG);
                row.style.width  = 100+'%';
                row.style.height = (scalar)+'%';
                row.style.top    = (runningHeight)+'%';
                row.style.position = "absolute";
                row.style.overflow = 'auto';
                //Append the htmlElement to this row. This parents the content to the row, so that the elements content can be resized to the divs dimensions.
                row.appendChild(child);
                this.ROWS.push(row);
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
     * Creates a horizontal Drag. A horizontal drag is a small element conjoining two Columns. Clicking and dragging on a Drag will change the
     * relative scale of the linked columns.
     * @param {Column} col1 - The first column
     * @param {Column} col2 - The second column
     * @returns {H_Drag} Returns a json object representing a horizontal drag.
     */
    createDrag(col1, col2){
        let drag = document.createElement(DRAG_TAG);
        drag.style.backgroundColor = "#b8b8b8";
        drag.style.position = "absolute";
        drag.style.height = 100+'%';
        drag.style.width = DRAG_WIDTH+'px';
        drag.style.cursor = 'col-resize';
        drag.setAttribute('class', 'btn');
        drag.addEventListener("drag", (event) => {
            this.onDrag(event, col1.index, col2.index);
        }, false);
        drag.addEventListener("dragend", (event) => {
            this.onDragEnd();
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

    /**
     * @typedef {Object} V_Drag
     * @property {Integer}  offset  - Im not sure what this dose
     * @property {Element}  row1    - The first dom element, this drag will be positioned after this element.
     * @property {Element}  row2    - The second dom element, this drag will be positioned before this element.
     * @property {Element}  element - The dom element for this drag.
     * @property {Function} width   - The size of this drags dom element in terms of window%
     */

    /**
     * Creates a vertical Drag. A vertical drag is a small element conjoining two rows. Clicking and dragging on a vertical Drag will change the
     * relative scale of the linked rows.
     * @param {Element} row1
     * @param {Element} row2
     * @returns {V_Drag} Returns a json object representing a Column.
     */
    createVDrag(row1, row2){
        let drag = document.createElement(V_DRAG_TAG);
        drag.style.backgroundColor = "#b8b8b8";
        drag.style.position = "absolute";
        drag.style.height = DRAG_WIDTH+'px';
        drag.style.width = 100+'%';
        drag.style.cursor = 'row-resize';
        drag.setAttribute('class', 'btn');

        drag.addEventListener("drag", (event) =>  {
            this.onVDrag(event, row1, row2);
        }, false);
        drag.addEventListener("dragend", () => {
            this.onDragEnd();
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

    /**
     * This method can be called to add a column to the current grid. The grid is flexible, and has a constants size of 100%, when a new column is added, the default width of the column is (1/n)% where n is the number of columns in the grid.
     * This method can be called at any time to add a new column.
     * @param {Column} column - The Column that will be added.
     */
    addColumn(column){
        if(column['element']) {
            gridContainer.appendChild(column.element);
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
            //When a new column is added, resize the existing columns to fit this new column.
            let count = COLUMNS.length;
            for(let i = 0; i < count; i++){
                COLUMNS[i].element.style.width = ((1.0/count) * 100)+'%';
                COLUMNS[i].element.style.left = ((i / count) * 100)+ '%';
            }
            return column;
        }else{
            console.log("Tried to add a column that was not a column element.",column);
            return null;
        }
    }

    /**
     * This method lets the user register a new drag to appear on the window.
     * @param {H_Drag} drag - The Horizontal drag to add to the window.
     */
    addDrag(drag){
        if(drag['element']) {
            gridContainer.appendChild(drag.element);
            DRAGS.push(drag);
        }else{
            console.log("Tried to add an object that was not a drag element.",drag);
        }
    }

    /**
     * This function is called to reposition all of the drags and grid elements to proper positions after a drag has occurred, or any externalmovementt actions.
     */
    refresh(){
        for(let i = 0; i < DRAGS.length; i++){
            DRAGS[i].element.style.left = (parseFloat(DRAGS[i].column2.element.style.left)-(DRAGS[i].width()/2))+'%';
        }
        for(let i = 0; i < COLUMNS.length; i++){
            for(let j = 0; j < COLUMNS[i].V_DRAGS.length; j++){
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
        if(!this['getHEIGHT']){
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
            for(let i = 0; i < COLUMNS.length; i++){
                let column = COLUMNS[i];
                column.executeElementsCallback(row1, row1);
                column.executeElementsCallback(row2, row2);
            }
        }
    }

    executeCallbacks(){
        for(let i = 0; i < COLUMNS.length; i++){
            let column = COLUMNS[i];
            for(let j = 0; j < column.ROWS.length; j++) {
                let element = column.ROWS[j];
                column.executeElementsCallback(element, element);
            }
        }
    }

    onDragEnd(){
        for(let i = 0; i < DRAGS.length; i++){
            //col2 x - drag.width/2
            DRAGS[i].element.style.left = (parseFloat(DRAGS[i].column2.element.style.left)-(DRAGS[i].width()/2))+'%';
        }
        for(let i = 0; i < COLUMNS.length; i++){
            for(let j = 0; j < COLUMNS[i].V_DRAGS.length; j++){
                COLUMNS[i].V_DRAGS[j].element.style.top = (parseFloat(COLUMNS[i].V_DRAGS[j].row2.style.top)-(COLUMNS[i].V_DRAGS[j].width()/2))+'%';
            }
        }
    }

    resize(){
        WIDTH = document.body.clientWidth;
        HEIGHT = document.body.clientHeight;
    }

    /**
     * This method is called on editor load. It takes in an array of size configuration data. This data is used to position all grid elements such that they retain the positions they were in the last time the editor was closed.
     * @param {Array} sizes - The sizes of the grid elements.
     */
    loadGridSizes(widthArray){
        if(widthArray.length != COLUMNS.length){
            console.error(widthArray.length + ' widths passed into column initialize. Expected '+COLUMNS.length+" to be passed.");
        }else{
            //Initialize the columns to be the saved size from the last time the editor was closed.
            let runningLeftWidth = 0;
            for(let i = 0; i < widthArray.length; i++){
                COLUMNS[i].element.style.width = (widthArray[i][0])+'%';
                COLUMNS[i].element.style.left = (runningLeftWidth)+ '%';
                runningLeftWidth += widthArray[i][0];
                let runningTopHeight = 0;
                for(let j = 0; j < COLUMNS[i].ROWS.length; j++){
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

    /**
     * This method is called when the editor is saving the active configuration. All columns and rows report their widths and heights respectivly. A multi-dimensional array object is constructed. This array has all of the height data needed to recreacte the current editor spacing on the next editor load.
     * @returns {Object} sizes - The widths and heights of the current window configuration.
     */
    generateSaveObject(){
        let out = {
            size:[],
            data:[]
        };
        for(let i = 0; i < COLUMNS.length; i++){
            let column = [];
            column.push(parseFloat(COLUMNS[i].element.style.width));
            for(let j = 0; j < COLUMNS[i].ROWS.length; j++){
                column.push(parseFloat(COLUMNS[i].ROWS[j].style.height));
                loop:{
                    if(COLUMNS[i]){
                        if(COLUMNS[i].WIDGETS[j]){
                            if (COLUMNS[i].WIDGETS[j]['save']) {
                                let saveData = COLUMNS[i].WIDGETS[j];
                                out.data.push(saveData.save());
                                break loop;
                            }
                        }
                    }
                    // out.data.push({});
                }
            }
            out.size.push(column);
        }
        return out;
    }

    /**
     * Get the grid width.
     * @returns {Integer} WIDTH - The width of the window.
     */
    getWIDTH(){
        return this.WIDTH;
    }

    /**
     * Get the grid height.
     * @returns {Integer} HEIGHT - The height of the window.
     */
    getHEIGHT(){
        return this.HEIGHT;
    }

    getCOLUMNS(){
        return COLUMNS;
    }

    //This call wraps the widget promise constructor inside of another promise.
    //The return value of this function is awaited upon inside of the initialize method.
    initializeWidgit(test, saveData = {}) {
        return new Promise(resolve => {
            test.init(saveData).then(function(result) {
                resolve(result);
            }, function(err) {
                console.log(err);
                resolve(null);
            });
        });
    }

    //Synchronous loop that populates a cell with a widget.
    async initalize(widgets, COLUMNS, saveData) {
        let widget_index = 0;
        for(let i = 0; i < widgets.length; i++){
            let widget = widgets[i];
            let result = await this.initializeWidgit(widget, saveData[widget_index] ? saveData[widget_index] : {});
            if(result) {
                if (COLUMNS[result.configData.col]) {
                    //Check to see if we have an element at this location
                    if (COLUMNS[result.configData.col].ROWS[result.configData.row].children[0].childElementCount == 0) {
                        COLUMNS[result.configData.col].ROWS[result.configData.row].childNodes[0].appendChild(result.element);
                        COLUMNS[result.configData.col].WIDGETS[result.configData.row] = result;
                        result.postinit();
                    } else {
                        console.warn("Trying to add an element to cell [", result.configData.col, ",", result.configData.row, "] but there is already a widget there.");
                        COLUMNS[result.configData.col].addChild(result.getElement());
                        let widget_index = COLUMNS[result.configData.col].ROWS.length - 1;
                        COLUMNS[result.configData.col].WIDGETS[widget_index] = result;
                        this.onDragEnd();
                        result.postinit();
                    }
                } else {
                    console.error("Tried to access grid location [", result.configData.col, ",", result.configData.row, "] but that is outside of this grids bounds.");
                }
            }
            widget_index++;
        }
        console.log("Initialized.");
        for(let i = 0; i < COLUMNS.length; i++){
            for(let j= 0; j < COLUMNS[i].ROWS.length; j++){
                COLUMNS[i].ROWS[j].style.backgroundColor = '#442222';
            }
        }

        if(BLOCKING_LOAD) {
            gridContainer.style.visibility = "visible";
            loadingContainer.style.visibility = "hidden";
        }
    }

    /**
     * Initializes the grid with Widgets. A Widget is a synchronously spawned promise. This function will iterate through the widgets array and initialize one widget after another.
     * This way later widgets can have earlier widgets passed into them. Example [Document(requires:[]), Tab(requires:[Document])] In this example the Widget Document requires nothing
     * and is the first widget to be initialized in the program. Tab is the second widget to be initialized, and it requires Document. When Tab's initialize method is called, the value
     * of Document will be stable and usable. This chaining method can be propagated forwards to allow widgets to require previously initialized widgets.
     * <pre>
     * See {@link Widget} for information on built in widgets and how to create your own.
     * <pre>
     * @param {Array} widgets - This is an array of Widget elements that will be initialized in array order.
     */
    init(widgets){
        this.initalize(widgets, this.getCOLUMNS(), SAVE_DATA.DATA);
    }


    getCell(col, row) {
        if (COLUMNS[col]) {
            if(COLUMNS[col].WIDGETS[row]) {
                return COLUMNS[col].WIDGETS[row];
            }
        }
        return null;
    }

    addWidget(widget){
        this.initalize([widget], this.getCOLUMNS(), widget.save());
    }

    removeWidget(widget){
        for(let i = 0; i < COLUMNS.length; i++){
            let col = COLUMNS[i];
            for(let j = 0; j < col.WIDGETS.length; j++){
                let col_widget = col.WIDGETS[j];
                if(col_widget['configData']) {
                    if (col_widget.configData.id === widget.configData.id) {
                        let target_row = col.ROWS[j];
                        col.WIDGETS.splice(j, 1);
                        for(let k = 0; k < col.V_DRAGS.length; k++){
                            if(col.V_DRAGS[k].row1 === target_row){
                                col.element.removeChild(col.V_DRAGS[k].element);
                            }
                            if(col.V_DRAGS[k].row2 === target_row){
                                col.element.removeChild(col.V_DRAGS[k].element);
                            }
                        }
                        col.element.removeChild(target_row);
                        return;
                    }
                }
            }
        }
    }

};
module.exports = Grid;