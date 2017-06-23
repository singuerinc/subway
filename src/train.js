import anime from "animejs";
import Station from "./station";
import WayPoint from "./waypoint";
import Utils from "./utils";

export default class Train extends PIXI.Graphics {
    constructor(id, route) {
        super();
        console.log(`Train ${id} created.`);
        this._id = id;
        this._route = route;
        this._stops = this._route.stops;
        this._stopIndex = -1;
        //this._currentStop = this._stops[this._stopIndex];
        this.x = 0;//this._currentStop.x;
        this.y = 0; //this._currentStop.y;
        
        this._moving = false;
        this.speed = 100;
        this._cargo = 1;

        this.cargoText = new PIXI.Text("",{fontFamily : 'HelveticaNeue', fontSize: 12, fill : 0xadb5bd, align : 'left'});
        this.cargoText.x = 5;
        this.cargoText.y = -5;
        this.addChild(this.cargoText);

        this.beginFill("0x000000");
        this.drawCircle(0, 0, 3);
        this.endFill();
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
                const nextIndex = (this._stopIndex + 1) % this._stops.length;
                const nextStop = this._stops[nextIndex];
                console.log("move to", nextStop);
                this.moveTo(nextStop)
                    .then(() => {
                        this._stopIndex = nextIndex;
                    })
                    .catch((error) => {
                        
                    });
            }
        }, 100);
    }

    moveTo(stop){
        return new Promise((resolve, reject) => {
            //console.log("this._moving?", this._moving);
            if(this._moving) {
                return reject();
            }

            //console.log(this._id, "wants to move to:", stop._id);
            //console.log(this._id, stop._id, "hasTrain?", stop.hasTrain());
            if(stop.hasTrain()){
                return reject();
            }

            const isWayPoint = this._currentStop instanceof WayPoint;
            const isStation = this._currentStop instanceof Station;
            const nextIsWayPoint = stop instanceof WayPoint;
            const nextIsStation = stop instanceof Station;

            // get current stop cargo
            if(this._currentStop && isStation){
                // unload
                this.cargo -= Math.floor(Math.random() * this.cargo);
                // load
                this.cargo += this._currentStop.getTheCargo();

                //this.cargoText.text = `#${this._id}: from: ${this._currentStop._id} / to: ${stop._id} / cargo: ${this.cargo}`;
                this.cargoText.text = `#${this._id}: ${this.cargo}`;
            }

            const dx = stop.x - this.x;
            const dy = stop.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            try {
                stop.enter(this);
            } catch(error){
                return reject();
            }

            const delay = isStation ? 1000 + this._cargo : 0;
            // console.log(stop._id, "isStation?", isStation, "delay", delay);

            anime({
                targets: this,
                easing: "linear",
                //easing: "easeInOutCubic",
                // duration: distance * 5 * this._cargo,
                duration: distance * 50,
                delay: delay,
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
