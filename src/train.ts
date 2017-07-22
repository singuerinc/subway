import * as anime from "animejs";
import MathUtils from "./mathUtils";
import Itinerary from "./units/itinerary";
import Route from "./units/route";
import Station from "./units/station";
import Wagon from "./units/wagon";
import WayPoint from "./units/waypoint";

interface ICargo {
    cargo: number;
    stopCargo: number;
}

enum TrainState {
    OPENING_DOORS = "opening doors",
    CLOSING_DOORS = "closing doors",
    LOADING = "loading",
    UNLOADING = "unloading",
    IN_TRANSIT = "in transit",
    WAITING = "waiting",
    GO = "go",
}

const MAX_SPEED = 120; // km/h

export default class Train extends PIXI.Graphics {
    private static getSegmentTime(distance: number, maxSpeed: number): number {
        return (distance * 100) / maxSpeed;
    }

    private _moving: boolean;
    private _stateColor: number;
    private _currentStop: Station | WayPoint;
    private _state: string;
    private _id: string;
    private _cargoAccumulated: number;
    private _trainColor: number;
    private _wagons: Wagon[];
    private cargoGraphics: PIXI.Graphics;
    private head: PIXI.Graphics;
    private infoContainer: PIXI.Graphics;
    private info: PIXI.Text;
    private selected: boolean;
    private speed: number;

    get itinerary(): Itinerary {
        return this._itinerary;
    }

    set itinerary(value: Itinerary) {
        this._itinerary = value;
    }

    private _itinerary: Itinerary;

    constructor(id, {itinerary}) {
        super();
        // console.log(`Train ${id} created.`);
        this.buttonMode = true;
        this.interactive = true;

        this._id = id;
        this._cargoAccumulated = 0;
        this.x = 0;
        this.y = 0;
        this._itinerary = itinerary;
        this._trainColor = this._itinerary.currentRoute.color;

        this.wagons = [];

        const n = Math.max(2, Math.floor(Math.random() * 5));

        for (let i = 0; i < n; i += 1) {
            this.addWagon(new Wagon());
        }

        this.cargoGraphics = new PIXI.Graphics();
        this.cargoGraphics.x = 18;
        this.addChild(this.cargoGraphics);

        this.head = new PIXI.Graphics();
        this.head.x = 18;
        this.addChild(this.head);

        const ix = 180;

        this.infoContainer = new PIXI.Graphics();
        this.infoContainer.scale.set(2);
        this.infoContainer.visible = false;
        this.infoContainer.beginFill(0, 0.9);
        this.infoContainer.drawRect(ix, -200, 340, 90);
        this.infoContainer.lineStyle(2, 0, 1);
        this.infoContainer.moveTo(0, 0);
        this.infoContainer.lineTo(ix, -140);
        this.infoContainer.lineStyle(6, this._trainColor, 1);
        this.infoContainer.moveTo(ix, -200);
        this.infoContainer.lineTo(ix, -110);
        // this.infoContainer.closePath();
        this.addChild(this.infoContainer);

        this.info = new PIXI.Text("", {
            fill: 0x464646,
            fontSize: 14,
        });
        // this.info.visible = false;
        this.info.x = ix + 20;
        this.info.y = -188;
        this.infoContainer.addChild(this.info);

        this.on("click", () => {
            this.selected = !this.selected;
            this.infoContainer.visible = this.selected;
        });

        this.on("mouseover", () => {
            this.infoContainer.visible = true;
            this.parent.swapChildren(this, this.parent.getChildAt(this.parent.children.length - 1));
        });

        this.on("mouseout", () => {
            if (this.selected === true) {
                return;
            }
            this.infoContainer.visible = false;
        });

        this.speed = 0;
        this.moving = false;

        anime({
            alpha: 0.2,
            direction: "alternate",
            duration: 1000,
            easing: "easeInSine",
            loop: true,
            targets: [this.head],
            update: () => this._draw(),
        });

        this._draw();
    }

    public run(): void {
        if (!this.moving) {
            let nextStop;

            try {
                nextStop = this._itinerary.getNextWayPoint();
            } catch (e) {
                nextStop = null;
            }

            if (nextStop) {
                this.moveToStop(nextStop)
                    .then(() => {
                        this.run();
                    })
                    .catch(() => {
                        // happen when the waypoint or station is not free
                        setTimeout(() => this.run(), 1500);
                    });
            } else {
                // last stop in this route
                this.unload(true).then(() => {
                    this._itinerary.currentRoute = this._itinerary.getNextRoute();
                    this._trainColor = this._itinerary.currentRoute.color;
                    this._itinerary.currentWayPoint = this._itinerary.getNextWayPoint();
                    nextStop = this._itinerary.currentWayPoint;
                    this.run();
                });
            }
        }
    }

    public parkIn(route: Route, index: number): void {
        if (this.moving) {
            throw new Error("Can not park this train because is in movement.");
        }

        this._itinerary.currentRoute = route;
        this._itinerary.currentWayPoint = route.getWayPointAt(index);
        this.moving = false;
        this._currentStop = this._itinerary.currentWayPoint as WayPoint;
        this.x = this._currentStop.position.x;
        this.y = this._currentStop.position.y;
    }

    private addWagon(wagon: Wagon): number {
        return this.wagons.push(wagon);
    }

    set wagons(value: Wagon[]) {
        this._wagons = value;
    }

    get wagons(): Wagon[] {
        return this._wagons;
    }

    get currentStop(): Station | WayPoint {
        return this._currentStop;
    }

    get id(): string {
        return this._id;
    }

    set cargoAccumulated(value: number) {
        this._cargoAccumulated = value;
    }

    get cargoAccumulated(): number {
        return this._cargoAccumulated;
    }

    get maxCargo(): number {
        return this.wagons.reduce((cargo, wagon) => cargo + wagon.maxCargo, 0);
    }

    get maxSpeed(): number {
        return this.wagons.reduce((speed, wagon) => wagon.calcSpeed(speed), MAX_SPEED * 0.01);
    }

    get cargo(): number {
        return this.wagons.reduce((cargo, wagon) => cargo + wagon.cargo, 0);
    }

    set cargo(cargo: number) {
        const cargoPerWagon = cargo / this.wagons.length;

        this.wagons.forEach((wagon) => {
            wagon.cargo = cargoPerWagon;
        });
    }

    set state(value: string) {
        this._state = value;
        switch (this.state) {
            case TrainState.OPENING_DOORS:
                // this._stateColor = 0x7FDBFF;
                this._stateColor = 0x2d2d2d;
                break;
            case TrainState.CLOSING_DOORS:
                // this._stateColor = 0xFFDC00;
                this._stateColor = 0x2d2d2d;
                break;
            case TrainState.GO:
                this._stateColor = 0x2ECC40;
                break;
            case TrainState.LOADING:
                this._stateColor = 0x01FF70;
                break;
            case TrainState.UNLOADING:
                this._stateColor = 0xFF4136;
                break;
            case TrainState.WAITING:
                this._stateColor = 0x001F3F;
                break;
            case TrainState.IN_TRANSIT:
                this._stateColor = 0x2d2d2d;
                break;
            default:
        }
    }

    get state(): string {
        return this._state;
    }

    private updateInfo(): void {
        if (this.info.visible) {
            const speed = Math.floor(this.speed * 100);
            const maxSpeed = Math.floor(this.maxSpeed * 100);
            let nextWayPointName;

            try {
                nextWayPointName = this._itinerary.getNextWayPoint().name;
            } catch (e) {
                nextWayPointName = "";
            }

            this.info.text =
                `#${this._id} - ${this.state}
Cargo: ${this.cargo} / Max: ${this.maxCargo} / Today: ${this.cargoAccumulated}
Speed: ${speed}km/h / ${maxSpeed}km/h
Stop: ${(this._itinerary.currentWayPoint as WayPoint).name} → ${nextWayPointName}
`;
        }
    }

    set moving(value: boolean) {
        this._moving = value;
        if (this._moving) {
            this.state = TrainState.IN_TRANSIT;
        } else {
            this.state = TrainState.WAITING;
        }
        this._draw();
    }

    get moving(): boolean {
        return this._moving;
    }

    private openDoors(): Promise<void> {
        return new Promise((resolve) => {
            this.state = TrainState.OPENING_DOORS;
            this._draw();
            this.updateInfo();
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    private closeDoors(): Promise<void> {
        return new Promise((resolve) => {
            this.state = TrainState.CLOSING_DOORS;
            this._draw();
            this.updateInfo();
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    private unload(leaveEmpty: boolean = false): Promise<void> {
        return new Promise((resolve) => {
            const toUnload = leaveEmpty ? this.cargo : anime.random(0, this.cargo);
            // TODO: Add partial cargo to the station? For stations that connects?
            const tmpCargo = this.cargo - toUnload;

            this.state = TrainState.UNLOADING;
            this.updateInfo();

            if (tmpCargo === 0 || tmpCargo === this.cargo) {
                this.cargo = tmpCargo;
                resolve();
                return;
            }

            const tmp = {
                cargo: this.cargo,
            };

            anime({
                cargo: tmpCargo,
                complete: () => {
                    resolve();
                },
                delay: 1500,
                duration: 50 * toUnload,
                easing: "linear",
                round: 1,
                targets: tmp,
                update: () => {
                    this.cargo = tmp.cargo;
                    this._draw();
                    this.updateInfo();
                },
            });
        });
    }

    private load(): Promise<void> {
        return new Promise((resolve) => {
            const currentStop = (this.currentStop as Station);
            const spaceInTrain = this.maxCargo - this.cargo;
            const toLoad = Math.min(spaceInTrain, currentStop.cargo);
            const tmpCargo = this.cargo + toLoad;

            this.state = TrainState.LOADING;
            this.updateInfo();

            if (tmpCargo === 0 || tmpCargo === this.cargo) {
                this.cargo = tmpCargo;
                resolve();
                return;
            }

            const tmp = {
                cargo: this.cargo,
                stopCargo: currentStop.cargo,
            } as ICargo;

            anime({
                cargo: tmpCargo,
                complete: () => {
                    this.cargoAccumulated += tmpCargo;
                    resolve();
                },
                delay: 1500,
                duration: 50 * toLoad,
                easing: "linear",
                round: 1,
                stopCargo: currentStop.cargo - toLoad,
                targets: tmp,
                update: () => {
                    currentStop.cargo = parseInt(`${tmp.stopCargo}`, 10);
                    this.cargo = parseInt(`${tmp.cargo}`, 10);
                    this._draw();
                    this.updateInfo();
                },
            });
        });
    }

    private go(nextStop: WayPoint): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // check if the next stop is free
                // if not, wait.
                nextStop.reserve(this);
            } catch (error) {
                reject();
                return;
            }

            const wayPointToWayPoint = (this.currentStop.type === 0) && (nextStop.type === 0);
            const wayPointToStation = (this.currentStop.type === 0) && (nextStop.type === 1);
            const stationToWayPoint = (this.currentStop.type === 1) && (nextStop.type === 0);
            const stationToStation = (this.currentStop.type === 1) && (nextStop.type === 1);

            const isWayPoint = this.currentStop.type === 0;

            const distance = MathUtils.distance(this.x, this.y, nextStop.position.x, nextStop.position.y);

            this._draw();
            this.state = TrainState.GO;
            this.updateInfo();

            const onBegin = () => {
                if (this.currentStop) {
                    this.currentStop.leave(this);
                }
                this.moving = true;
            };

            const onComplete = () => {
                this.moving = false;
                this._itinerary.currentWayPoint = nextStop;
                this._currentStop = this._itinerary.currentWayPoint;
                this.currentStop.enter(this);
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
                duration = (distance * 50) / this.maxSpeed;
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
                this.x = nextStop.position.x;
                this.y = nextStop.position.y;
                onComplete();
            } else {
                anime({
                    begin: onBegin,
                    complete: onComplete,
                    delay: isWayPoint ? 0 : 500,
                    duration,
                    easing,
                    speed: finalSpeed,
                    targets: this,
                    update: () => {
                        this.updateInfo();
                    },
                    x: nextStop.position.x,
                    y: nextStop.position.y,
                });
            }
        });
    }

    private moveToStop(nextStop: WayPoint): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.moving) {
                reject();
                return;
            }

            const angle = MathUtils.angle(this.x, this.y, nextStop.position.x, nextStop.position.y);

            this.rotation = angle + (Math.PI / 2);
            this.infoContainer.rotation = -this.rotation;
            // this.rotation = angle + Math.PI;
            // this.infoContainer.rotation = angle;

            const isStation = this.currentStop.type === 1;

            // STATIONS
            if (this.currentStop && isStation) {
                // open the train doors
                this.openDoors()
                    .then(() => {
                        // unload partial cargo
                        this.unload()
                            .then(() => {
                                // load waiting cargo
                                this.load().then(() => {
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
                    });
            } else {
                // WAY-POINTS
                this.go(nextStop)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    private _draw(): void {
        this.head.clear();

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

        // if (this.state === STATE_OPENING_DOORS) {
        //     this.head.lineStyle(4, 0x00FF00, 1);
        //     this.head.drawCircle(0, 0, 12);
        // }
        // if (this.state === STATE_CLOSING_DOORS) {
        //     this.head.lineStyle(4, 0xFF0000, 1);
        //     this.head.drawCircle(0, 0, 12);
        // }
        this.head.lineStyle(2, this._stateColor, 1);
        this.head.beginFill(this._trainColor, 1);
        // for(let i=0; i<this.wagons.length; i++) {
        //     this.wagon.drawCircle(0, i * 18, 8);
        // }
        this.head.drawCircle(0, 0, 8);
        // this.head.drawRect(-6, 0, 12, 24);
        this.head.endFill();
        // this.head.closePath();

        // cargo
        // this.head.lineStyle(0);
        // this.head.beginFill(0x00FF2FF, 0.5);
        // this.head.drawCircle(0, 0, 11 + (this.cargo * 0.2));
        // this.head.endFill();

        this.cargoGraphics.clear();
        this.cargoGraphics.y = 12;

        const num = Math.floor(this.cargo / 220);

        for (let i = 0; i < this.wagons.length; i += 1) {
            this.cargoGraphics.lineStyle(0);
            if (i < num) {
                this.cargoGraphics.beginFill(0x111111, 1);
            } else {
                this.cargoGraphics.beginFill(0, 0.2);
            }
            this.cargoGraphics.drawRect(-6, i * (14 + 2), 14, 14);
        }
        // this.cargoGrph.closePath();

        this.updateInfo();
    }
}
