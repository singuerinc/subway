import anime from "animejs";
import Station from "./station";
import WayPoint from "./waypoint";
import Utils from "./utils";

export default class Train extends PIXI.Graphics {
    constructor(id, route) {
        super();
        // console.log(`Train ${id} created.`);
        this._id = id;
        this._route = route;
        this._stops = this._route.stops;
        this._stopIndex = 0;
        const r = Math.floor(Math.random() * 4);
        this.maxCargo = [80, 120, 160, 240][r];
        this.maxSpeed = [1.5, 1.4, 1.3, 1][r];
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


        this.rX = (Math.random() * 100) + 52;

        this.info = new PIXI.Text("", { fontFamily: 'Nunito-ExtraLight', fontSize: 12, fill: 0xFFFFFF, align: 'left' });
        this.info.visible = false;
        this.info.x = this.rX;
        this.info.y = -8;
        this.addChild(this.info);

        this.cargoInfo = new PIXI.Text("", {
            fontFamily: 'Nunito-ExtraLight',
            fontSize: 12,
            fill: 0x767676,
            align: 'left'
        });
        this.cargoInfo.visible = false;
        this.cargoInfo.x = this.rX + 20;
        this.cargoInfo.y = 8;
        this.addChild(this.cargoInfo);

        this.routeInfo = new PIXI.Text("", {
            fontFamily: 'Nunito-ExtraLight',
            fontSize: 12,
            fill: 0x767676,
            align: 'left'
        });
        this.routeInfo.visible = false;
        this.routeInfo.x = this.rX + 50;
        this.routeInfo.y = -8;
        this.addChild(this.routeInfo);

        this.moving = false;
        this.draw();
    }

    set maxCargo(value) {
        this._maxCargo = value;
    }

    get maxCargo() {
        return this._maxCargo;
    }

    set maxSpeed(value) {
        this._maxSpeed = value;
    }

    get maxSpeed() {
        return this._maxSpeed;
    }

    draw() {
        this.clear();
        this.beginFill(0, 0.8);
        this.drawCircle(0, 0, 6);
        this.beginFill(this._color, 1);
        this.drawCircle(0, 0, 3);
        this.endFill();
        this.lineStyle(1, 0xFF0000, 0.5);
        this.drawCircle(0, 0, 6 + (this.maxCargo * 0.1));
        this.lineStyle(1, 0x00FFFF, 0.5);
        // this.beginFill(0x00FFFF, 0.5);
        this.drawCircle(0, 0, 6 + (this.cargo * 0.1));
        // this.endFill();
        // this.lineStyle(1, 0xFFFFFF, 0.1);
        // this.moveTo(0, 0);
        // this.lineTo(this.rX, 0);
        this.closePath();
    }

    set cargo(value) {
        this._cargo = parseInt(value);
    }

    get cargo() {
        return this._cargo;
    }

    set moving(value) {
        this._moving = value;
        if (this._moving) {
            this._color = 0x767676;
        } else {
            this._color = 0x00FF00;
        }
        this.draw();
    }

    get moving() {
        return this._moving;
    }

    run() {
        if (!this.moving) {
            const nextIndex = (this._stopIndex + 1) % this._stops.length;
            const nextStop = this._stops[nextIndex];

            this.moveToStop(nextStop)
                .then(() => {
                    this._stopIndex = nextIndex;
                    this.run();
                })
                .catch(() => {
                    // it happen when the waypoint or station is not free
                    setTimeout(() => this.run(), 500);
                });
        }
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

    unload() {
        return new Promise((resolve, reject) => {
            let tmpCargo = this.cargo;
            const toUnload = anime.random(0, this.cargo);
            tmpCargo -= toUnload;

            this.info.text = `${this._id} ⬇ ${this._currentStop._id}`;

            anime({
                targets: this,
                easing: "easeOutQuint",
                delay: 1500,
                duration: 25 * tmpCargo,
                cargo: tmpCargo,
                round: 1,
                update: () => {
                    this.draw();
                    this.cargoInfo.text = `unloading (-${toUnload}): ${this.cargo}`;
                },
                complete: resolve
            });
        });
    }

    load() {
        return new Promise((resolve, reject) => {
            let tmpCargo = this.cargo;
            const toLoad = this._currentStop.getTheCargo(this.maxCargo - tmpCargo);
            tmpCargo += toLoad;

            this.info.text = `${this._id} ⬆ ${this._currentStop._id}`;
            anime({
                targets: this,
                easing: "easeInQuint",
                delay: 1500,
                duration: 25 * tmpCargo,
                cargo: tmpCargo,
                round: 1,
                update: () => {
                    this.draw();
                    this.cargoInfo.text = `loading (+${toLoad}): ${this.cargo}`;
                },
                complete: resolve
            });
        });
    }

    go(stop) {
        return new Promise((resolve, reject) => {
            try {
                stop.reserve(this);
            } catch (error) {
                reject();
            }


            const wayPointToWayPoint = (this._currentStop instanceof WayPoint) && (stop instanceof WayPoint);
            const wayPointToStation = (this._currentStop instanceof WayPoint) && (stop instanceof Station);
            const stationToWayPoint = (this._currentStop instanceof Station) && (stop instanceof WayPoint);
            const isWayPoint = this._currentStop instanceof WayPoint;
            const distance = Utils.distance(this.x, this.y, stop.x, stop.y);
            const delay = isWayPoint ? 0 : 500;

            this.info.text = `${this._id} ➡ ${this.maxSpeed * 100}km/h ➡ ${stop._id}`;
            this.cargoInfo.text = `max: ${this.maxCargo} / load: ${this.cargo}`;

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
                resolve();
            };

            let easing;
            let duration;

            if(stationToWayPoint) {
                easing = "easeInSine";
                duration = (distance * 10000 / 100) / this.maxSpeed * 1.5;
            } else if(wayPointToWayPoint){
                easing = "linear";
                duration = (distance * 10000 / 100) / this.maxSpeed;
            } else if(wayPointToStation){
                easing = "easeOutSine";
                duration = (distance * 10000 / 100) / this.maxSpeed * 1.5;
            }


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
                    easing: easing,
                    duration: duration,
                    delay: delay,
                    x: stop.x,
                    y: stop.y,
                    begin: onBegin,
                    complete: onComplete
                });
            }
        });
    }

    moveToStop(stop) {
        return new Promise((resolve, reject) => {
            if (this.moving || stop.hasTrain()) {
                return reject();
            }

            const angle = Utils.angle(this.x, this.y, stop.x, stop.y);

            this.rotation = angle + (Math.PI / 2);
            this.info.text = `${this._id} ⮕ ${this._currentStop._id}`;

            const isStation = this._currentStop instanceof Station;

            if (this._currentStop && isStation) {
                this.unload()
                    .then(() => {
                        this.load().then(() => {
                            this.go(stop).then(resolve, reject);
                        });
                    });
            } else {
                this.go(stop).then(resolve, reject);
            }
        });
    }
}
