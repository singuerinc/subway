import "pixi.js";
import anime from "animejs";
import Utils from "./utils";

export default class Train extends PIXI.Graphics {
    constructor(id, route) {
        super();
        console.log(`Train ${id} created.`);
        this._id = id;
        this._route = route;
        this._stationIndex = 0;
        this._currentStop = this._route.stations[this._stationIndex];
        this.x = this._currentStop.x;
        this.y = this._currentStop.y;
        
        this._moving = false;
        this.speed = 100;
        this._cargo = 1;

        this.lineStyle(5, "0xFFFFFF");
        this.drawCircle(0, 0, 10);
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

    run() {
        setInterval(() => {
            if(!this.isMoving){
                this._stationIndex = ++this._stationIndex % this._route.stations.length;
                this.moveTo(this._route.stations[this._stationIndex]);
            }
        }, 1000);
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
            const dx = stop.x - this.x;
            const dy = stop.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            anime({
                targets: this,
                easing: "easeInOutQuart",
                // duration: distance * 5 * this._cargo,
                duration: distance * 5,
                x: stop.x,
                y: stop.y,
                begin: () => {
                    this._moving = true;
                },
                update: () => {
                    
                },
                complete: () => {
                    this._moving = false;
                    this._currentStop = stop;
                    // this.position = this._currentStop.position;
                    return resolve();
                }
            });
        });
    }
}
