import anime from "animejs";
import Station from "./station";
import WayPoint from "./waypoint";
import Utils from "./utils";

export default class Train extends PIXI.Graphics {
    constructor(id, route) {
        super();
        // console.log(`Train ${id} created.`);
        this._id = id;
        this.x = 0;
        this.y = 0;
        this._route = route;
        this._stops = this._route.stops;
        this._stopIndex = 0;

        this.numWagon = Math.floor(Math.random() * 4);
        this.maxCargo = [80, 160, 240, 320][this.numWagon];
        this.maxSpeed = [0.8, 0.75, 0.7, 0.6][this.numWagon];

        this.cargo = 1;
        this.speed = this.maxSpeed;

        this.buttonMode = true;
        this.interactive = true;

        this.wagon = new PIXI.Graphics();
        this.wagon.x = 14;
        this.addChild(this.wagon);

        this.infoContainer = new PIXI.Graphics();
        this.infoContainer.visible = false;
        this.infoContainer.lineStyle(1, 0x111111, 1);
        this.infoContainer.moveTo(0, 0);
        this.infoContainer.lineTo(280, 0);
        this.addChild(this.infoContainer);

        this.info = new PIXI.Text("", {
            fontSize: 25,
            fill: 0x676767
        });
        this.info.x = 300;
        this.info.y = -8;
        this.infoContainer.addChild(this.info);

        this.on('click', () => {
            this.infoContainer.visible = !this.infoContainer.visible;
        });

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
        this.wagon.clear();

        // cargo
        this.wagon.lineStyle(0);
        this.wagon.beginFill(0x00FF2FF, 0.5);
        this.wagon.drawCircle(0, 0, 11 + (this.cargo * 0.1));

        // max cargo
        // this.lineStyle(2, 0xFF0000, 0.5);
        // this.drawCircle(0, 0, 13 + (this.maxCargo * 0.1));

        // wagon
        // this.wagon.lineStyle(2, 0x000000, 1);
        // this.wagon.beginFill(this._color, 1);
        // this.wagon.moveTo(-8, 8);
        // this.wagon.lineTo(8, 8);
        // this.wagon.lineTo(0, -8);
        // this.wagon.lineTo(-8, 8);
        // this.wagon.endFill();

        this.wagon.lineStyle(2, 0x000000, 1);
        this.wagon.beginFill(this._color, 1);
        this.wagon.drawCircle(0, 0, 8);
        this.wagon.endFill();

        this.wagon.closePath();
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

    unload(nextStop) {
        return new Promise((resolve, reject) => {
            const toUnload = anime.random(0, this.cargo);
            const tmpCargo = this.cargo - toUnload;

            this.info.text = `#${this._id}\n⬇ Cargo: ${this.cargo}/${this.maxCargo}\n${Math.floor(this.speed * 100)}km/h\n${this._currentStop._id} ⇢ ${nextStop._id}`;

            if (tmpCargo === 0 || tmpCargo === this.cargo) {
                this.cargo = tmpCargo;
                return resolve();
            }

            anime({
                targets: this,
                easing: "linear",
                delay: 1500,
                duration: 25 * tmpCargo,
                cargo: tmpCargo,
                round: 1,
                update: () => {
                    this.draw();
                    this.info.text = `#${this._id}\n⬇ Cargo: ${this.cargo}/${this.maxCargo}\n${Math.floor(this.speed * 100)}km/h\n${this._currentStop._id} ⇢ ${nextStop._id}`;
                },
                complete: resolve
            });
        });
    }

    load(nextStop) {
        return new Promise((resolve, reject) => {
            const toLoad = this._currentStop.getTheCargo(this.maxCargo - this.cargo);
            const tmpCargo = this.cargo + toLoad;

            this.info.text = `#${this._id}\n⬆ Cargo: ${this.cargo}/${this.maxCargo}\n${Math.floor(this.speed * 100)}km/h\n${this._currentStop._id} ⇢ ${nextStop._id}`;

            if (tmpCargo === 0 || tmpCargo === this.cargo) {
                this.cargo = tmpCargo;
                return resolve();
            }

            anime({
                targets: this,
                easing: "linear",
                delay: 1500,
                duration: 25 * tmpCargo,
                cargo: tmpCargo,
                round: 1,
                update: () => {
                    this.draw();
                    this.info.text = `#${this._id}\n⬆ Cargo: ${this.cargo}/${this.maxCargo}\n${Math.floor(this.speed * 100)}km/h\n${this._currentStop._id} ⇢ ${nextStop._id}`;
                },
                complete: resolve
            });
        });
    }

    go(nextStop) {
        return new Promise((resolve, reject) => {
            try {
                nextStop.reserve(this);
            } catch (error) {
                reject();
            }


            const wayPointToWayPoint = (this._currentStop instanceof WayPoint) && (nextStop instanceof WayPoint);
            const wayPointToStation = (this._currentStop instanceof WayPoint) && (nextStop instanceof Station);
            const stationToWayPoint = (this._currentStop instanceof Station) && (nextStop instanceof WayPoint);
            const isWayPoint = this._currentStop instanceof WayPoint;
            const distance = Utils.distance(this.x, this.y, nextStop.x, nextStop.y);
            const delay = isWayPoint ? 0 : 500;

            this.info.text = `#${this._id}\nCargo: ${this.cargo}/${this.maxCargo}\n${Math.floor(this.speed * 100)}km/h\n${this._currentStop._id} ⇢ ${nextStop._id}`;

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
                this._currentStop = nextStop;
                this._currentStop.enter(this);
                resolve();
            };

            let easing;
            let duration;
            let nSpeed;

            if (stationToWayPoint) {
                easing = "easeInSine";
                duration = (distance * 5000 / 100) / this.maxSpeed * 1.5;
                this.speed = 0;
                nSpeed = this.maxSpeed;
            } else if (wayPointToWayPoint) {
                easing = "linear";
                duration = (distance * 5000 / 100) / this.maxSpeed;
                this.speed = this.maxSpeed;
                nSpeed = this.maxSpeed;
            } else if (wayPointToStation) {
                easing = "easeOutSine";
                duration = (distance * 5000 / 100) / this.maxSpeed * 1.5;
                this.speed = this.maxSpeed;
                nSpeed = 0;
            }


            if (distance === 0) {
                // same station, but changing sides
                onBegin();
                this.x = nextStop.x;
                this.y = nextStop.y;
                onComplete();
            }
            else {
                anime({
                    targets: this,
                    easing: easing,
                    duration: duration,
                    delay: delay,
                    speed: nSpeed,
                    x: nextStop.x,
                    y: nextStop.y,
                    begin: onBegin,
                    update: () => {
                        this.info.text = `#${this._id}\n⦿ Cargo: ${this.cargo}/${this.maxCargo}\n${Math.floor(this.speed * 100)}km/h\n${this._currentStop._id} ⇢ ${nextStop._id}`;
                    },
                    complete: onComplete
                });
            }
        });
    }

    moveToStop(nextStop) {
        return new Promise((resolve, reject) => {
            if (this.moving || nextStop.hasTrain()) {
                return reject();
            }

            const angle = Utils.angle(this.x, this.y, nextStop.x, nextStop.y);
            this.rotation = angle + (Math.PI / 2);
            // this.rotation = angle + Math.PI;
            // this.infoContainer.rotation = angle;

            const isStation = this._currentStop instanceof Station;

            if (this._currentStop && isStation) {
                this.unload(nextStop)
                    .then(() => {
                        this.load(nextStop).then(() => {
                            this.go(nextStop)
                                .then(resolve)
                                .catch(reject)
                        });
                    });
            } else {
                this.go(nextStop)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
}
