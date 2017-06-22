import "pixi.js";
import Utils from "./utils";

export default class Station extends PIXI.Graphics {
    constructor({id, position}) {
        super();
        console.log(`Station ${id} created.`);
        this._id = id;
        //this.parentStation = parentStation;
        this._color = "0xFF0000";
        this._cargo = 0;

        this.x = Utils.convert(position.x);
        this.y = Utils.convert(position.y);

        setInterval(() =>  {
            this.addCargo(Math.floor(Math.random() * 10));
        }, 2000);
    }

    releaseCargo(){
        const cargo = this._cargo;
        this._cargo = 0;
        this._render();
        return cargo;
    }

    addCargo(value){
        this._cargo += value;
        this._render();
    }

    _render(){
        this.clear();
        this.lineStyle(1, this._color);
        this.drawCircle(0, 0, 10 + this._cargo);
    }
}
