import anime from "animejs";
import Utils from "./utils";

export default class Train {
    constructor(id, currentStop) {
        console.log(`Train ${id} created.`);
        this._id = id;
        this._currentStop = currentStop;
        this._parent = parent;
        this.position = currentStop.position;
        this._moving = false;
        this.speed = 100;
        this._cargo = 1;

        this._canvas = document.createElement("canvas");
        this._canvas.width = 500;
        this._canvas.height = 500;
        this._ctx = this._canvas.getContext("2d");
    }

    set position(value) {
        return this._position = value;
    }

    get position() {
        return this._position;
    }

    set cargo(value) {
        this._cargo = value;
    }

    get cargo() {
        return this._cargo;
    }

    get isMoving() {
        return this._moving;
    }

    moveTo(stop){
        return new Promise((resolve, reject) => {
            if(this._moving) {
                return reject();
            }

            // get current stop cargo
            this.cargo += this._currentStop.releaseCargo();

            // this._currentStop = stop;
            // this.position = this._currentStop.position;
            const dx = stop.position.x - this.position.x;
            const dy = stop.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            anime({
                targets: this.position,
                easing: "easeInOutQuart",
                duration: distance * 25 * this._cargo,
                x: stop.position.x,
                y: stop.position.y,
                begin: () => {
                    this._moving = true;
                },
                update: () => {
                    this._ctx.clearRect(0, 0, 500, 500);
                    this._ctx.beginPath();
                    this._ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
                    this._ctx.arc(Utils.convert(this.position.x), Utils.convert(this.position.y), 7, 0, 2 * Math.PI);
                    this._ctx.fill();
                },
                complete: () => {
                    this._moving = false;
                    this._currentStop = stop;
                    // this.position = this._currentStop.position;
                    return resolve();
                }
            });
        });



        // if(this.position.x === position.x && this.position.y === position.y){
        //     this._moving = false;
        // } else {
        //     this._moving = true;
        //     const dx = position.x - this.position.x;
        //     const dy = position.y - this.position.y;
        //     const angle = Math.atan2(dy, dx);
        //     const magnitude = 1.0;
        //     const velX = Math.cos(angle) * magnitude;
        //     const velY = Math.sin(angle) * magnitude;
        //     this.position.x += velX;
        //     this.position.y += velY;
        // }
    }

    render() {
        return this._canvas;
    //     this._ctx.beginPath();
    //     this._ctx.fillStyle = "#000";
    //     this._ctx.arc(Utils.convert(this.position.x), Utils.convert(this.position.y), 7, 0, 2 * Math.PI);
    //     this._ctx.fill();
    }
}
