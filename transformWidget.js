const Widget = require('./widget');

let transformElement;

class TransformWidget extends Widget{
    constructor(x, y){
        super({
            name:"Transform Viewer",
            col:x,
            row:y,
            x:12,
            y:43,
            z:189,
            id:Math.random(),
            transform:[
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]
        }, {});

        //Sync the sliders with the value of transform.
        this.setPosition(
            super.getConfigData()['x'],
            super.getConfigData()['y'],
            super.getConfigData()['z']
        );
    }

    async init(){
        return await new Promise((resolve, reject) => {
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
            transformElement = this.generateMatrixElelment();
            container.appendChild(transformElement.element);
            this.syncTransformWithElement();

            this.element = container;
            resolve(this);
        });
    }

    setPosition(x, y, z){
        super.getConfigData()['transform'][3]  = x;
        super.getConfigData()['transform'][7]  = y;
        super.getConfigData()['transform'][11] = z;
    }

    setX(x){
        super.getConfigData()['transform'][3]   = x;
    }

    setY(y){
        super.getConfigData()['transform'][7]   = y;
    }

    setZ(z){
        super.getConfigData()['transform'][11]  = z;
    }

    setScale(w){
        super.getConfigData()['transform'][15] = w;
    }

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

    syncTransformWithElement(){
        for(let i = 0; i < super.getConfigData()['transform'].length; i++){
            transformElement.cells[i].innerText = super.getConfigData()['transform'][i];
        }
    }

    save(){
        this.syncTransformWithElement();
        return {
            transform:super.getConfigData()['transform']
        };
    }
};

module.exports = TransformWidget;