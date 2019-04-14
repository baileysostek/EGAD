const Widget = require('./widget');

class TransformWidget extends Widget{
    /**
     * @inheritDoc
     * @constructor
     * @augments Widget
     * @param {Integer} x - This is the Column that this widget should be added to.
     * @param {Integer} y - This is the row of of the Column that this widget should be added to.
     * @returns {TransformWidget} Returns a TransformWidget, an instance of the Widget class which specialises in visualizing 4x4 matrices. These matrices are commonly used to represent transformations in 3D space.
     */
    constructor(x, y){
        super({
            name:"Transform Viewer",
            col:x,
            row:y,
            slider_x:null,
            slider_y:null,
            slider_z:null,
            id:Math.random(),
            transform:[
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ],
            cells:[],
        }, {});
    }

    /**
     * This init call overrides the parent init call. This call generates all the HTML needed to represent a transform visually, as well as creates the sliders. The values of configData.transform are set to the save data for this widget which was generated the last time the program closed.
     * @param {Oject} configData - This is the Column that this widget should be added to.
     * @returns {Promise} This initialization call returns a promise that resolves once this widget has completely initialized.In the initialization of a TransformWidget, the html element representing a transform visually si generated and added to the webpage. The css is also generated and injected through javascript into the <row> that that this widget is living in.
     */
    async init(configData){
        return await new Promise((resolve, reject) => {
            console.log("Passed:",configData);
            //Load the data passed into this function, and set the sliders correctly
            if(configData['transform']){
                super.getConfigData()['transform'] = configData['transform'];
                this.syncTransformWithElement();
            }

            //CSS injection
            let css = document.createElement('style');
            //CSS Taken from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_rangeslider
            css.innerHTML =
                "#transform td{\n" +
                "  border: 2px solid #FFFFFF;\n" +
                "  border-radius: 12.5px;\n" +
                "  background: #d3d3d3;\n" +
                "  outline: none;\n" +
                "  opacity: 0.7;\n" +
                "  -webkit-transition: .2s;\n" +
                "  transition: opacity .2s;\n" +
                "}\n" +
                "#transform td:hover {\n" +
                "  opacity: 1;\n" +
                "}\n" +
                ".slider_r {\n" +
                "  -webkit-appearance: none;\n" +
                "  width: 100%;\n" +
                "  height: 25px;\n" +
                "  background: #d3d3d3;\n" +
                "  outline: none;\n" +
                "  opacity: 0.7;\n" +
                "  -webkit-transition: .2s;\n" +
                "  transition: opacity .2s;\n" +
                "}\n" +
                "\n" +
                ".slider_r:hover {\n" +
                "  opacity: 1;\n" +
                "}\n" +
                "\n" +
                ".slider_r::-webkit-slider-thumb {\n" +
                "  -webkit-appearance: none;\n" +
                "  appearance: none;\n" +
                "  width: 25px;\n" +
                "  height: 25px;\n" +
                "  background: #B23226;\n" +
                "  cursor: pointer;\n" +
                "}\n" +
                "\n" +
                ".slider_g::-moz-range-thumb {\n" +
                "  width: 25px;\n" +
                "  height: 25px;\n" +
                "  background: #B23226;\n" +
                "  cursor: pointer;\n" +
                "}" +
                ".slider_g {\n" +
                "  -webkit-appearance: none;\n" +
                "  width: 100%;\n" +
                "  height: 25px;\n" +
                "  background: #d3d3d3;\n" +
                "  outline: none;\n" +
                "  opacity: 0.7;\n" +
                "  -webkit-transition: .2s;\n" +
                "  transition: opacity .2s;\n" +
                "}\n" +
                "\n" +
                ".slider_g:hover {\n" +
                "  opacity: 1;\n" +
                "}\n" +
                "\n" +
                ".slider_g::-webkit-slider-thumb {\n" +
                "  -webkit-appearance: none;\n" +
                "  appearance: none;\n" +
                "  width: 25px;\n" +
                "  height: 25px;\n" +
                "  background: #59B24E;\n" +
                "  cursor: pointer;\n" +
                "}\n" +
                "\n" +
                ".slider_g::-moz-range-thumb {\n" +
                "  width: 25px;\n" +
                "  height: 25px;\n" +
                "  background: #59B24E;\n" +
                "  cursor: pointer;\n" +
                "}" +
                "\n" +
                ".slider_b::-moz-range-thumb {\n" +
                "  width: 25px;\n" +
                "  height: 25px;\n" +
                "  background: #B23226;\n" +
                "  cursor: pointer;\n" +
                "}" +
                ".slider_b {\n" +
                "  -webkit-appearance: none;\n" +
                "  width: 100%;\n" +
                "  height: 25px;\n" +
                "  background: #d3d3d3;\n" +
                "  outline: none;\n" +
                "  opacity: 0.7;\n" +
                "  -webkit-transition: .2s;\n" +
                "  transition: opacity .2s;\n" +
                "}\n" +
                "\n" +
                ".slider_b:hover {\n" +
                "  opacity: 1;\n" +
                "}\n" +
                "\n" +
                ".slider_b::-webkit-slider-thumb {\n" +
                "  -webkit-appearance: none;\n" +
                "  appearance: none;\n" +
                "  width: 25px;\n" +
                "  height: 25px;\n" +
                "  background: #3848B2;\n" +
                "  cursor: pointer;\n" +
                "}\n" +
                "\n" +
                ".slider_b::-moz-range-thumb {\n" +
                "  width: 25px;\n" +
                "  height: 25px;\n" +
                "  background: #3848B2;\n" +
                "  cursor: pointer;\n" +
                "}" ;

            //Create a container to hold all of our data
            let container = document.createElement('div');

            //Add the css element to our grid.
            container.appendChild(css);

            //Create a html table element, our sliders will go in here.
            let table = document.createElement('table');
            table.setAttribute('width', '100%');

            let first_row = document.createElement('tr');
            table.appendChild(first_row);
            let second_row = document.createElement('tr');
            table.appendChild(second_row);
            let thrid_row = document.createElement('tr');
            table.appendChild(thrid_row);

            let x_col = document.createElement('td');
            x_col.setAttribute('align', 'center');
            first_row.appendChild(x_col);
            let y_col = document.createElement('td');
            y_col.setAttribute('align', 'center');
            second_row.appendChild(y_col);
            let z_col = document.createElement('td');
            z_col.setAttribute('align', 'center');
            thrid_row.appendChild(z_col);

            //X slider
            let slider_x = document.createElement('input');
            super.getConfigData()['slider_x'] = slider_x;
            slider_x.setAttribute('type', 'range');
            slider_x.setAttribute('min', 0);
            slider_x.setAttribute('max', 360);
            slider_x.setAttribute('value', this.configData.x);
            slider_x.setAttribute('class', 'slider_r');
            x_col.appendChild(slider_x);
            $(slider_x).on("input change", () => {
                this.setX(parseFloat(slider_x.value));
                this.syncTransformWithElement();
            });


            //Y Slider
            let slider_y = document.createElement('input');
            super.getConfigData()['slider_y'] = slider_y;
            slider_y.setAttribute('type', 'range');
            slider_y.setAttribute('min', 0);
            slider_y.setAttribute('max', 360);
            slider_y.setAttribute('value', this.configData.y);
            slider_y.setAttribute('class', 'slider_g');
            y_col.appendChild(slider_y);
            $(slider_y).on("input change", () => {
                this.setY(parseFloat(slider_y.value));
                this.syncTransformWithElement();
            });


            //Z Slider
            let slider_z = document.createElement('input');
            super.getConfigData()['slider_z'] = slider_z;
            slider_z.setAttribute('type', 'range');
            slider_z.setAttribute('min', 0);
            slider_z.setAttribute('max', 360);
            slider_z.setAttribute('value', this.configData.z);
            slider_z.setAttribute('class', 'slider_b');
            z_col.appendChild(slider_z);
            $(slider_z).on("input change", () => {
                this.setZ(parseFloat(slider_z.value));
                this.syncTransformWithElement();
            });


            //Add this table to our container
            container.appendChild(table);

            //Generate our Matrix element and append it to our table
            let matrixView = this.generateMatrixElelment();
            this.getConfigData()['cells'] = matrixView.cells;
            container.appendChild(matrixView.element);
            this.syncTransformWithElement();

            super.setElement(container);
            resolve(this);
        });
    }

    /**
     * This function allows a user to easily set the XYZ position of a 4x4 matrix.
     * @param {Float} x - This is a floating point number representing the X position of this transform object.
     * @param {Float} y - This is a floating point number representing the Y position of this transform object.
     * @param {Float} z - This is a floating point number representing the Z position of this transform object.
     * @returns {Vector3F} This function returns a Vector3F which is an object with a vector with a x , y , and z value.
     */
    setPosition(x, y, z){
        super.getConfigData()['transform'][3]  = x;
        super.getConfigData()['transform'][7]  = y;
        super.getConfigData()['transform'][11] = z;
        return [x, y, z];
    }

    /**
     * This function allows a user to set the X position of a 4x4 matrix, this is element [3] of the matrix array.
     * @param {Float} x - This is a floating point number representing the X position of this transform object.
     * @returns {Float} The X value of the transform is returned.
     */
    setX(x){
        super.getConfigData()['transform'][3]   = x;
        return x;
    }

    /**
     * This function returns the X value of the 4x4 matrix.
     * @returns {Float} The X value of the transform is returned.
     */
    getX(){
        return super.getConfigData()['transform'][3];
    }

    /**
     * This function allows a user to set the Y position of a 4x4 matrix, this is element [7] of the matrix array.
     * @param {Float} y - This is a floating point number representing the Y position of this transform object.
     * @returns {Float} The Y value of the transform is returned.
     */
    setY(y){
        super.getConfigData()['transform'][7]   = y;
    }

    /**
     * This function returns the Y value of the 4x4 matrix.
     * @returns {Float} The Y value of the transform is returned.
     */
    getY(){
        return super.getConfigData()['transform'][7];
    }

    /**
     * This function allows a user to set the Z position of a 4x4 matrix, this is element [11] of the matrix array.
     * @param {Float} z - This is a floating point number representing the Z position of this transform object.
     * @returns {Float} The Z value of the transform is returned.
     */
    setZ(z){
        super.getConfigData()['transform'][11]  = z;
    }

    /**
     * This function returns the Z value of the 4x4 matrix.
     * @returns {Float} The Z value of the transform is returned.
     */
    getZ(){
        return super.getConfigData()['transform'][11];
    }

    /**
     * This function allows a user to set the Scale position of a 4x4 matrix, this is element [15] of the matrix array.
     * @param {Float} w - This is a floating point number representing the Scale of this transform object.
     * @returns {Float} The Scale value of the transform is returned.
     */
    setScale(w){
        super.getConfigData()['transform'][15] = w;
    }

    /**
     * This function gets the current state of the transformation matrix and returns column 3, the data representing the x, y, z and scale of this transform.
     * @returns {Vector4f} An object containing the elements x,y,z, and w is returned from this function.
     */
    getPosition(){
        return {
            x:super.getConfigData()['transform'][3],
            y:super.getConfigData()['transform'][7],
            z:super.getConfigData()['transform'][11],
            w:super.getConfigData()['transform'][15],
        }
    }

    generateMatrixElelment() {
        //Create a html table element, our sliders will go in here.
        let table = document.createElement('table');
        table.setAttribute('width', '100%');
        table.style.tableLayout = 'fixed';
        table.setAttribute('id', 'transform');

        let first_row = document.createElement('tr');
        table.appendChild(first_row);
        let second_row = document.createElement('tr');
        table.appendChild(second_row);
        let thrid_row = document.createElement('tr');
        table.appendChild(thrid_row);
        let fourth_row = document.createElement('tr');
        table.appendChild(fourth_row);

        //Row 1
        let element_00 = document.createElement('td');
        element_00.setAttribute('align', 'center');
        first_row.appendChild(element_00);
        let element_10 = document.createElement('td');
        element_10.setAttribute('align', 'center');
        first_row.appendChild(element_10);
        let element_20 = document.createElement('td');
        element_20.setAttribute('align', 'center');
        first_row.appendChild(element_20);
        let element_30 = document.createElement('td');
        element_30.setAttribute('align', 'center');
        first_row.appendChild(element_30);

        //Row 2
        let element_01 = document.createElement('td');
        element_01.setAttribute('align', 'center');
        second_row.appendChild(element_01);
        let element_11 = document.createElement('td');
        element_11.setAttribute('align', 'center');
        second_row.appendChild(element_11);
        let element_21 = document.createElement('td');
        element_21.setAttribute('align', 'center');
        second_row.appendChild(element_21);
        let element_31 = document.createElement('td');
        element_31.setAttribute('align', 'center');
        second_row.appendChild(element_31);

        //Row 3
        let element_02 = document.createElement('td');
        element_02.setAttribute('align', 'center');
        thrid_row.appendChild(element_02);
        let element_12 = document.createElement('td');
        element_12.setAttribute('align', 'center');
        thrid_row.appendChild(element_12);
        let element_22 = document.createElement('td');
        element_22.setAttribute('align', 'center');
        thrid_row.appendChild(element_22);
        let element_32 = document.createElement('td');
        element_32.setAttribute('align', 'center');
        thrid_row.appendChild(element_32);

        //Row 4
        let element_03 = document.createElement('td');
        element_03.setAttribute('align', 'center');
        fourth_row.appendChild(element_03);
        let element_13 = document.createElement('td');
        element_13.setAttribute('align', 'center');
        fourth_row.appendChild(element_13);
        let element_23 = document.createElement('td');
        element_23.setAttribute('align', 'center');
        fourth_row.appendChild(element_23);
        let element_33 = document.createElement('td');
        element_33.setAttribute('align', 'center');
        fourth_row.appendChild(element_33);


        //Text coloring
        element_30.style.border = '2px solid #B23226';
        element_30.style.borderRadius = '12.5px';
        // let element_30_text = document.createElement('input');
        // element_30.appendChild(element_30_text);
        element_31.style.border = '2px solid #59B24E';
        element_31.style.borderRadius = '12.5px';
        element_32.style.border = '2px solid #3848B2';
        element_32.style.borderRadius = '12.5px';

        return{
            element:table,
            cells:[
                element_00, element_10, element_20, element_30,
                element_01, element_11, element_21, element_31,
                element_02, element_12, element_22, element_32,
                element_03, element_13, element_23, element_33,
            ],
        };
    }

    /**
     * This function is called whenever a slider's value changes. Much like the Observer design pattern, whenever a sliders value changes, this function is triggered to set the internal transform data = to the current value of the sliders.
     */
    syncTransformWithElement(){
        for(let i = 0; i < super.getConfigData()['transform'].length; i++){
            if(this.getConfigData()['cells'][i]) {
                this.getConfigData()['cells'][i].innerText = super.getConfigData()['transform'][i];
            }
        }
        //set sliders
        if(super.getConfigData()['slider_x']){
            super.getConfigData()['slider_x'].value = this.getX();
        }
        if(super.getConfigData()['slider_y']){
            super.getConfigData()['slider_y'].value = this.getY();
        }
        if(super.getConfigData()['slider_z']){
            super.getConfigData()['slider_z'].value = this.getZ();
        }
    }

    /**
     * This function generates a save object to be written to disk whenever the application closes. The only data that this widget needs to persist between the application closing and opening is the current value of the 4x4 transformation matrix.
     * @returns {Object} save - An object containing transformation matrix that this widget allows a user to view and modify.
     */
    save(){
        this.syncTransformWithElement();
        return {
            transform:super.getConfigData()['transform']
        };
    }
};

module.exports = TransformWidget;