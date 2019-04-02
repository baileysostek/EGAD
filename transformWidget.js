const Widget = require('./widget');

let transform = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
];

class TransformWidget extends Widget{
    constructor(x, y){
        super({
            name:"Transform Viewer",
            col:x,
            row:y,
            x:12,
            y:43,
            z:189
        }, {});

        //Sync the sliders with the value of transform.
        this.setPosition(
            super.getConfigData()['x'],
            super.getConfigData()['y'],
            super.getConfigData()['z']
        );
    }

    setX(x){
        transform[3]   = x;
    }

    setY(y){
        transform[7]   = y;
    }

    setZ(z){
        transform[11]  = z;
    }

    async init(){
        return await new Promise((resolve, reject) => {
            //CSS injection
            let css = document.createElement('style');
            //CSS Taken from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_rangeslider
            css.innerHTML =
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



            document.body.appendChild(css);

            let container = document.createElement('div');

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

            let slider_x = document.createElement('input');
            slider_x.setAttribute('type', 'range');
            slider_x.setAttribute('min', 0);
            slider_x.setAttribute('max', 360);
            slider_x.setAttribute('value', this.configData.x);
            slider_x.setAttribute('class', 'slider_r');
            x_col.appendChild(slider_x);
            slider_x.addEventListener("change", () => {
                this.setX(parseFloat(slider_x.value));
                console.log(this.getPosition());
            }, false);


            let slider_y = document.createElement('input');
            slider_y.setAttribute('type', 'range');
            slider_y.setAttribute('min', 0);
            slider_y.setAttribute('max', 360);
            slider_y.setAttribute('value', this.configData.y);
            slider_y.setAttribute('class', 'slider_g');
            y_col.appendChild(slider_y);
            slider_y.addEventListener("change", () => {
                this.setY(parseFloat(slider_y.value));
                console.log(this.getPosition());
            }, false);

            let slider_z = document.createElement('input');
            slider_z.setAttribute('type', 'range');
            slider_z.setAttribute('min', 0);
            slider_z.setAttribute('max', 360);
            slider_z.setAttribute('value', this.configData.z);
            slider_z.setAttribute('class', 'slider_b');
            z_col.appendChild(slider_z);
            slider_z.addEventListener("change", () => {
                this.setZ(parseFloat(slider_z.value));
                console.log(this.getPosition());
            }, false);

            container.appendChild(table);

            this.element = container;
            resolve(this);
        });
    }

    setPosition(x, y, z){
        transform[3]  = x;
        transform[7]  = y;
        transform[11] = z;
    }

    setScale(w){
        transform[15] = w;
    }

    getPosition(){
        return {
            x:transform[3],
            y:transform[7],
            z:transform[11],
            w:transform[15],
        }
    };


};

module.exports = TransformWidget;