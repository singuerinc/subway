import Utils from "./utils";

export default class Stop {
    constructor(id, position, parent, color) {
        console.log(`Stop ${id} created.`);
        this._id = id;
        this._position = position;
        this._parent = parent;
        this._color = color;
        this._cargo = 0;

        setInterval(() =>  {
            this.addCargo(Math.floor(Math.random() * 10));
        }, 1000);

        this._canvas = document.createElement("canvas");
        this._canvas.width = 500;
        this._canvas.height = 500;
        this._ctx = this._canvas.getContext("2d");
    }

    get position() {
        return this._position;
    }

    releaseCargo(){
        const cargo = this._cargo;
        this._cargo = 0;
        return cargo;
    }

    addCargo(value){
        this._cargo += value;
        this.render();
    }

    render() {
        this._ctx.clearRect(0, 0, 500, 500);
        this._ctx.beginPath();
        this._ctx.strokeStyle = this._color;
        this._ctx.arc(Utils.convert(this.position.x), Utils.convert(this.position.y), 10 + this._cargo, 0, 2 * Math.PI);
        this._ctx.stroke();

        if (typeof this._parent !== "undefined") {
            const px = Utils.convert(this._parent.position.x);
            const py = Utils.convert(this._parent.position.y);
            const x = Utils.convert(this.position.x);
            const y = Utils.convert(this.position.y);

            this._ctx.beginPath();
            this._ctx.strokeStyle = this._color;
            this._ctx.moveTo(px, py);
            this._ctx.lineTo(x, y);
            this._ctx.stroke();
        }

        return this._canvas;
    }
}
