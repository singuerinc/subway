import "pixi.js";
import anime from "animejs";
import Utils from "./utils";

export default class Train extends PIXI.Graphics {
    constructor(id, route) {
        super();
        console.log(`Train ${id} created.`);
        this._id = id;
        this._route = route;
        
        this._stops = Array.from(this._route.stops);
        this._stopIndex = -1;
        //this._currentStop = this._stops[this._stopIndex];
        this.x = 0;//this._currentStop.x;
        this.y = 0; //this._currentStop.y;
        
        this._moving = false;
        this.speed = 100;
        this._cargo = 1;

        this.lineStyle(5, '0x'+Math.floor(Math.random()*16777215).toString(16));
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
                console.log("this._stopIndex", this._stopIndex)
                const nextIndex = (this._stopIndex + 1) % this._stops.length;
                const nextStop = this._stops[nextIndex][1];
                
                this.moveTo(nextStop)
                    .then(() => {
                        this._stopIndex = nextIndex;
                        // console.log("train", this._id, "this._stopIndex:", this._stopIndex, this._stops.length);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }, 5000 + (Math.random() * 3));
    }

    moveTo(stop){
        return new Promise((resolve, reject) => {
            if(this._moving) {
                return reject();
            }

            console.log(this._id, "wants to move to:", stop._id);
            console.log(this._id, stop._id, "hasTrain?", stop.hasTrain());
            if(stop.hasTrain()){
                return reject();
            }

            // get current stop cargo
            if(this._currentStop){
                this.cargo += this._currentStop.getTheCargo();
            }

            // this._currentStop = stop;
            // this.position = this._currentStop.position;
            const dx = stop.x - this.x;
            const dy = stop.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            try {
                stop.enter(this);
            } catch(error){
                return reject();
            }

            anime({
                targets: this,
                easing: "easeInOutQuart",
                // duration: distance * 5 * this._cargo,
                duration: distance * 5,
                x: stop.x,
                y: stop.y,
                begin: () => {
                    if(this._currentStop){
                        this._currentStop.leave(this);
                    }
                    this._moving = true;
                },
                update: () => {
                    
                },
                complete: () => {
                    this._moving = false;
                    this._currentStop = stop;
                    return resolve();
                }
            });
        });
    }
}
