import anime from "animejs";
import Station from "./station";
import WayPoint from "./waypoint";

export default class Train extends PIXI.Graphics {
    constructor(id, route) {
        super();
        console.log(`Train ${id} created.`);
        this._id = id;
        this._route = route;
        this._stops = this._route.stops;
        this._stopIndex = 0;
        //this._currentStop = this._stops[this._stopIndex];
        this.x = 0;//this._currentStop.x;
        this.y = 0; //this._currentStop.y;

        this.speed = 100;
        this._cargo = 1;

        this.buttonMode = true;
        this.interactive = true;
        this.on('click', () => {
            this.routeInfo.visible = !this.routeInfo.visible;
        });


        this.info = new PIXI.Text("", { fontFamily: 'Nunito-ExtraLight', fontSize: 12, fill: 0xFFFFFF, align: 'left' });
        this.info.x = 52;
        this.info.y = -8;
        this.addChild(this.info);

        this.cargoInfo = new PIXI.Text("", { fontFamily: 'Nunito-ExtraLight', fontSize: 14, fill: 0x767676, align: 'left' });
        this.cargoInfo.x = 52;
        this.cargoInfo.y = 8;
        this.addChild(this.cargoInfo);

        this.routeInfo = new PIXI.Text("", { fontFamily: 'Nunito-ExtraLight', fontSize: 12, fill: 0x767676, align: 'left' });
        this.routeInfo.visible = false;
        this.routeInfo.x = 70;
        this.routeInfo.y = -8;
        this.addChild(this.routeInfo);

        this.moving = false;
        this.draw();
    }

    draw(){
        this.clear();
        this.beginFill(0, 0.8);
        this.drawCircle(0, 0, 6);
        this.beginFill(this._color, 1);
        this.drawCircle(0, 0, 3);
        this.endFill();
        this.lineStyle(1, 0xFFFFFF, 0.1);
        this.moveTo(0, 0);
        this.lineTo(50, 0);
    }

    set cargo(value) {
        this._cargo = value;
    }

    get cargo() {
        return this._cargo;
    }

    set moving(value){
        this._moving = value;
        if(this._moving){
            this._color = 0x767676;
        } else {
            this._color = 0xFF2200;
        }
        this.draw();
    }

    get moving() {
        return this._moving;
    }

    run() {
        // setInterval(() => {
            if (!this.moving) {
                const nextIndex = (this._stopIndex + 1) % this._stops.length;
                const nextStop = this._stops[nextIndex];
                //console.log("move to", nextStop);
                this.moveToStop(nextStop)
                    .then(() => {
                        this._stopIndex = nextIndex;
                        this.run();
                    })
                    .catch((error) => {
                        setTimeout(() => this.run(), 500);
                    });
            }
        // }, 500 + Math.random() * 50);
    }

    parkIn(stop, stopIndex) {
        return new Promise((resolve, reject) => {
            if (this.moving) {
                return reject();
            }

            this.x = stop.x;
            this.y = stop.y;
            this.moving = false;
            this._currentStop = stop;
            this._stopIndex = stopIndex;
            return resolve();
        });
    }

    moveToStop(stop) {
        return new Promise((resolve, reject) => {
            //console.log("this.moving?", this.moving);
            if (this.moving) {
                return reject();
            }

            //console.log(this._id, "wants to move to:", stop._id);
            //console.log(this._id, stop._id, "hasTrain?", stop.hasTrain());
            if (stop.hasTrain()) {
                return reject();
            }

            const isWayPoint = this._currentStop instanceof WayPoint;
            const isStation = this._currentStop instanceof Station;
            const nextIsWayPoint = stop instanceof WayPoint;
            const nextIsStation = stop instanceof Station;

            let delay = 0;

            // get current stop cargo
            if (this._currentStop && isStation) {
                // unload
                let tmpCargo = this.cargo;
                tmpCargo -= Math.floor(Math.random() * this.cargo);
                tmpCargo += this._currentStop.getTheCargo();

                const MIN_DELAY = 2000;

                delay = (25 * tmpCargo) + MIN_DELAY;

                // this.cargo -= Math.floor(Math.random() * this.cargo);
                // load
                // this.cargo += this._currentStop.getTheCargo();

                anime({
                    targets: this,
                    easing: "linear",
                    delay: MIN_DELAY / 2 ,
                    duration: delay - MIN_DELAY,
                    cargo: tmpCargo,
                    round: 1,
                    update: () => {
                        this.cargoInfo.text = `${this.cargo}`;
                    }
                });

                //this.info.text = `#${this._id}: from: ${this._currentStop._id} / to: ${stop._id} / cargo: ${this.cargo}`;
                // this.info.text = `${this._id}\n${this._currentStop._id} (${this.cargo}) → ${stop._id}`;
                this.info.text = `${this._id}`;
                this.routeInfo.text = `${this._currentStop._id} → ${stop._id}`;
            } else if(isWayPoint){
                delay = 0;
            }

            const dx = stop.x - this.x;
            const dy = stop.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(stop.y - this.y, stop.x - this.x);

            this.rotation = angle + (Math.PI / 2);

            try {
                stop.reserve(this);
            } catch (error) {
                return reject();
            }

            // console.log(stop._id, "isStation?", isStation, "delay", delay);

            this._color = 0xFF9900;
            this.draw();
            const onBegin = () => {
                if (this._currentStop) {
                    this._currentStop.leave(this);
                }
                this.moving = true;
            };

            const onComplete = () => {
                this.moving = false;
                this._currentStop = stop;
                this._currentStop.enter(this);
                return resolve();
            };

            if (distance === 0) {
                // same station, but changing sides
                onBegin();
                this.x = stop.x;
                this.y = stop.y;
                onComplete();
            }
            else {
                anime({
                    targets: this,
                    easing: "linear",
                    duration: distance * 100,
                    delay: delay,
                    x: stop.x,
                    y: stop.y,
                    begin: onBegin,
                    complete: onComplete
                });
            }
        });
    }
}
