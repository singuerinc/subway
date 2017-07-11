import * as k from "keymaster";
import anime from "animejs";
import Station from "./station";
import WayPoint from "./waypoint";
import Utils from "./utils";
import Wagon from "./wagon";

const STATE_OPENING_DOORS = 'opening doors';
const STATE_CLOSING_DOORS = 'closing doors';
const STATE_LOADING = 'loading';
const STATE_UNLOADING = 'unloading';
const STATE_IN_TRANSIT = 'in transit';
const STATE_WAITING = 'waiting';
const STATE_GO = 'go';

export default class Train extends PIXI.Graphics {
    constructor(id, {stops, color}) {
        super();
        // console.log(`Train ${id} created.`);
        this.buttonMode = true;
        this.interactive = true;

        k("t", () => {
            this.visible = !this.visible;
        });

        this._id = id;
        this._trainColor = color;
        this.x = 0;
        this.y = 0;
        this.stops = stops;
        this._stopIndex = 0;

        this.wagons = [];

        const n = Math.max(1, Math.floor(Math.random() * 5));
        for (let i = 0; i < n; i++) {
            this.addWagon(new Wagon());
        }

        this.head = new PIXI.Graphics();
        this.head.x = 18;
        this.addChild(this.head);

        this.infoContainer = new PIXI.Graphics();
        this.infoContainer.visible = false;
        this.infoContainer.beginFill(0, 0.6);
        this.infoContainer.drawRect(480, -200, 370, 120);
        this.infoContainer.lineStyle(2, 0, 1);
        this.infoContainer.moveTo(0, 0);
        this.infoContainer.lineTo(480, -140);
        this.infoContainer.closePath();
        this.addChild(this.infoContainer);

        this.info = new PIXI.Text("", {
            fontSize: 25,
            fill: this._trainColor
        });
        // this.info.visible = false;
        this.info.x = 500;
        this.info.y = -188;
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

        this.speed = 0;
        this.moving = false;
        this._draw();
    }

    addWagon(wagon) {
        this.wagons.push(wagon);
    }

    set wagons(value) {
        this._wagons = value;
    }

    get wagons() {
        return this._wagons;
    }

    get maxCargo() {
        return this.wagons.reduce((cargo, wagon) => {
            return cargo + wagon.maxCargo;
        }, 0);
    }

    get maxSpeed() {
        return this.wagons.reduce((speed, wagon) => {
            return wagon.calcSpeed(speed);
        }, 1.2);
    }

    get cargo() {
        return this.wagons.reduce((cargo, wagon) => {
            return cargo + wagon.cargo;
        }, 0);
    }

    set cargo(cargo) {
        let cargoPerWagon = cargo / this.wagons.length;
        this.wagons.forEach((wagon) => {
            wagon.cargo = cargoPerWagon;
        });
    }

    set state(value) {
        this._state = value;
        switch (this._state) {
            case STATE_OPENING_DOORS:
                this._stateColor = 0x7FDBFF;
                break;
            case STATE_CLOSING_DOORS:
                this._stateColor = 0xFFDC00;
                break;
            case STATE_GO:
                this._stateColor = 0x2ECC40;
                break;
            case STATE_LOADING:
                this._stateColor = 0x01FF70;
                break;
            case STATE_UNLOADING:
                this._stateColor = 0xFF4136;
                break;
            case STATE_WAITING:
                this._stateColor = 0x001F3F;
                break;
            case STATE_IN_TRANSIT:
                this._stateColor = 0x2d2d2d;
                break;
        }
    }

    get state() {
        return this._state;
    }

    set stops(value) {
        this._stops = value;
    }

    get stops() {
        return this._stops;
    }

    updateInfo() {
        if (this.info.visible) {
            const speed = Math.floor(this.speed * 100);
            const maxSpeed = Math.floor(this.maxSpeed * 100);
            this.info.text =
                `#${this._id} - ${this._state}
Cargo: ${this.cargo} / ${this.maxCargo}
Speed: ${speed}km/h / ${maxSpeed}km/h
`;
        }
    }

    set moving(value) {
        this._moving = value;
        if (this._moving) {
            this.state = STATE_IN_TRANSIT;
        } else {
            this.state = STATE_WAITING;
        }
        this._draw();
    }

    get moving() {
        return this._moving;
    }

    run() {
        if (!this.moving) {
            const nextIndex = (this._stopIndex + 1) % this.stops.length;
            const nextStop = this.stops[nextIndex];

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

    openDoors() {
        return new Promise((resolve, reject) => {
            this.state = STATE_OPENING_DOORS;
            this._draw();
            this.updateInfo();
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    closeDoors() {
        return new Promise((resolve, reject) => {
            this.state = STATE_CLOSING_DOORS;
            this._draw();
            this.updateInfo();
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    unload(nextStop) {
        return new Promise((resolve, reject) => {
            const toUnload = anime.random(0, this.cargo);
            const tmpCargo = this.cargo - toUnload;

            this.state = STATE_UNLOADING;
            this.updateInfo();

            if (tmpCargo === 0 || tmpCargo === this.cargo) {
                this.cargo = tmpCargo;
                return resolve();
            }

            let tmp = {
                cargo: this.cargo
            };

            anime({
                targets: tmp,
                easing: "linear",
                delay: 1500,
                duration: 75 * toUnload,
                cargo: tmpCargo,
                round: 1,
                update: () => {
                    this.cargo = tmp.cargo;
                    this._draw();
                    this.updateInfo();
                },
                complete: resolve
            });
        });
    }

    load(nextStop) {
        return new Promise((resolve, reject) => {
            // const toLoad = this._currentStop.getTheCargo(this.maxCargo - this.cargo);
            const spaceInTrain = this.maxCargo - this.cargo;
            const toLoad = Math.min(spaceInTrain, this._currentStop.cargo);
            const tmpCargo = this.cargo + toLoad;

            this.state = STATE_LOADING;
            this.updateInfo();

            if (tmpCargo === 0 || tmpCargo === this.cargo) {
                this.cargo = tmpCargo;
                return resolve();
            }

            let tmp = {
                cargo: this.cargo,
                stopCargo: this._currentStop.cargo
            };

            anime({
                targets: tmp,
                easing: "linear",
                delay: 1500,
                duration: 75 * toLoad,
                cargo: tmpCargo,
                stopCargo: this._currentStop.cargo - toLoad,
                round: 1,
                update: () => {
                    this._currentStop.cargo = parseInt(tmp.stopCargo);
                    this.cargo = parseInt(tmp.cargo);
                    this._draw();
                    this.updateInfo();
                },
                complete: resolve
            });
        });
    }

    go(nextStop) {
        return new Promise((resolve, reject) => {
            try {
                // check if the next stop is free
                // if not, wait.
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

            this._draw();
            this.state = STATE_GO;
            this.updateInfo();

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
            let duration = Train.getSegmentTime(distance, this.maxSpeed);
            let finalSpeed;

            if (stationToWayPoint) {
                this.speed = 0;
                easing = "easeInSine";
                finalSpeed = this.maxSpeed;
            } else if (wayPointToWayPoint) {
                this.speed = this.maxSpeed;
                duration = (distance * 5000 / 100) / this.maxSpeed;
                easing = "linear";
                finalSpeed = this.maxSpeed;
            } else if (wayPointToStation) {
                this.speed = this.maxSpeed;
                easing = "easeOutSine";
                finalSpeed = 0;
            } else if (stationToStation) {
                this.speed = 0;
                easing = "easeInOutSine";
                finalSpeed = this.maxSpeed;
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
                    delay: isWayPoint ? 0 : 500,
                    speed: finalSpeed,
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
            this.infoContainer.rotation = -this.rotation - 5.4;
            // this.rotation = angle + Math.PI;
            // this.infoContainer.rotation = angle;

            const isStation = this._currentStop instanceof Station;

            // STATIONS
            if (this._currentStop && isStation) {
                // open the train doors
                this.openDoors()
                    .then(() => {
                        // unload partial cargo
                        this.unload(nextStop)
                            .then(() => {
                                // load waiting cargo
                                this.load(nextStop).then(() => {
                                    // close the train doors
                                    this.closeDoors().then(() => {
                                        // go
                                        this.go(nextStop)
                                            .then(resolve)
                                            .catch(reject);
                                        // FIXME: If "go" is rejected it will repeat all actions
                                    });
                                });
                            });
                    })
            } else {
                // WAY-POINTS
                this.go(nextStop)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    _draw() {
        this.head.clear();

        // cargo
        this.head.lineStyle(0);
        this.head.beginFill(0x00FF2FF, 0.5);
        this.head.drawCircle(0, 0, 11 + (this.cargo * 0.1));
        this.head.endFill();

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

        this.head.lineStyle(4, this._stateColor, 1);
        this.head.beginFill(this._trainColor, 1);
        // for(let i=0; i<this.wagons.length; i++) {
        //     this.wagon.drawCircle(0, i * 18, 8);
        // }
        this.head.drawCircle(0, 0, 8);
        this.head.endFill();

        this.head.closePath();
        this.updateInfo();
    }

    static getSegmentTime(distance, maxSpeed){
        return (distance * 100) / maxSpeed;
    }
}
