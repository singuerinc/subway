import anime from "animejs";
import Station from "./station";
import WayPoint from "./waypoint";
import Utils from "./utils";

const COLOR_GO = 0xFF9900;
const COLOR_MOVING = 0x767676;
const COLOR_WAITING = 0x00FF00;

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

        this._state = "";
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
        this.infoContainer.moveTo(14, 0);
        this.infoContainer.lineTo(480, 0);
        this.infoContainer.lineStyle(0);
        this.infoContainer.beginFill(0, 0.8);
        this.infoContainer.drawRect(480, 0, 500, 150);
        this.infoContainer.closePath();
        this.addChild(this.infoContainer);

        this.info = new PIXI.Text("", {
            fontSize: 25,
            fill: 0x676767
        });
        // this.info.visible = false;
        this.info.x = 500;
        this.info.y = 12;
        this.infoContainer.addChild(this.info);

        this.on('click', () => {
            this.selected = !this.selected;
            this.infoContainer.visible = this.selected;
        });

        this.on('mouseover', () => {
            this.infoContainer.visible = true;
        });

        this.on('mouseout', () => {
            if (this.selected === true) return;
            this.infoContainer.visible = false;
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
        this.wagon.endFill();

        // max cargo
        // this.wagon.lineStyle(2, 0xFF0000, 0.5);
        // this.wagon.drawCircle(0, 0, 13 + (this.maxCargo * 0.1));

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
        this.updateInfo();

    }

    updateInfo() {
        if (this.info.visible) {
            this.info.text =
                `#${this._id} - ${this._state}
Cargo: ${this.cargo}/${this.maxCargo}
${Math.floor(this.speed * 100)}km/h
`;
        }
        // ${this._currentStop._id} ⇢ ${nextStop._id}
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
            this._color = COLOR_MOVING;
            this._state = 'in transit';
        } else {
            this._color = COLOR_WAITING;
            this._state = 'waiting';
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

            this._state = 'unloading';
            this.updateInfo();

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
                    this.updateInfo();
                },
                complete: resolve
            });
        });
    }

    load(nextStop) {
        return new Promise((resolve, reject) => {
            const toLoad = this._currentStop.getTheCargo(this.maxCargo - this.cargo);
            const tmpCargo = this.cargo + toLoad;

            this._state = 'loading';
            this.updateInfo();

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
                    this.updateInfo();
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
                return reject();
            }

            const wayPointToWayPoint = (this._currentStop instanceof WayPoint) && (nextStop instanceof WayPoint);
            const wayPointToStation = (this._currentStop instanceof WayPoint) && (nextStop instanceof Station);
            const stationToWayPoint = (this._currentStop instanceof Station) && (nextStop instanceof WayPoint);
            const stationToStation = (this._currentStop instanceof Station) && (nextStop instanceof Station);
            const isWayPoint = this._currentStop instanceof WayPoint;
            const distance = Utils.distance(this.x, this.y, nextStop.x, nextStop.y);
            const delay = isWayPoint ? 0 : 500;

            this._color = COLOR_GO;
            this._state = 'go';
            this.updateInfo();

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
                return resolve();
            };

            let easing;
            let duration = (distance * 5000 / 100) / this.maxSpeed * 1.5;
            let nSpeed;

            if (stationToWayPoint) {
                this.speed = 0;
                easing = "easeInSine";
                nSpeed = this.maxSpeed;
            } else if (wayPointToWayPoint) {
                this.speed = this.maxSpeed;
                duration = (distance * 5000 / 100) / this.maxSpeed;
                easing = "linear";
                nSpeed = this.maxSpeed;
            } else if (wayPointToStation) {
                this.speed = this.maxSpeed;
                easing = "easeOutSine";
                nSpeed = 0;
            } else if (stationToStation) {
                this.speed = 0;
                easing = "easeInOutSine";
                nSpeed = this.maxSpeed;
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
                        this.updateInfo();
                    },
                    complete: onComplete
                });
            }
        });
    }

    moveToStop(nextStop) {
        return new Promise((resolve, reject) => {
            if (this.moving) {
                return reject();
            }

            const angle = Utils.angle(this.x, this.y, nextStop.x, nextStop.y);
            this.rotation = angle + (Math.PI / 2);
            this.infoContainer.rotation = -this.rotation;
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
