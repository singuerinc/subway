import * as k from 'keymaster';
import anime from 'animejs';
import MathUtils from './mathUtils';
import Wagon from './units/wagon';

const STATE_OPENING_DOORS = 'opening doors';
const STATE_CLOSING_DOORS = 'closing doors';
const STATE_LOADING = 'loading';
const STATE_UNLOADING = 'unloading';
const STATE_IN_TRANSIT = 'in transit';
const STATE_WAITING = 'waiting';
const STATE_GO = 'go';

export default class Train extends PIXI.Graphics {
  constructor(id, { itinerary }) {
    super();
    // console.log(`Train ${id} created.`);
    this.buttonMode = true;
    this.interactive = true;

    k('t', () => {
      this.visible = !this.visible;
    });

    this._id = id;
    this._cargoAccumulated = 0;
    this.x = 0;
    this.y = 0;
    this.itinerary = itinerary;
    this._trainColor = this.itinerary.currentRoute.color;

    this.wagons = [];

    const n = Math.max(2, Math.floor(Math.random() * 5));

    for (let i = 0; i < n; i += 1) {
      this.addWagon(new Wagon());
    }

    this.cargoGrph = new PIXI.Graphics();
    this.cargoGrph.x = 18;
    this.addChild(this.cargoGrph);

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
    this.infoContainer.closePath();
    this.addChild(this.infoContainer);

    this.info = new PIXI.Text('', {
      fontSize: 14,
      fill: 0x464646,
    });
    // this.info.visible = false;
    this.info.x = ix + 20;
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

    anime({
      targets: [this.head],
      direction: 'alternate',
      easing: 'easeInSine',
      loop: true,
      alpha: 0.2,
      duration: 1000,
      update: () => this._draw(),
    });

    this._draw();
  }

  openTrainInfo() {
    this.selected = true;
    this.infoContainer.visible = true;
  }

  /**
   * @param {Wagon} wagon
   */
  addWagon(wagon) {
    this.wagons.push(wagon);
  }

  /**
   * @param {Array} value
   */
  set wagons(value) {
    this._wagons = value;
  }

  /**
   * @returns {Array}
   */
  get wagons() {
    return this._wagons;
  }

  /**
   * @returns {Station|WayPoint}
   */
  get currentStop() {
    return this._currentStop;
  }

  /**
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  set cargoAccumulated(value) {
    this._cargoAccumulated = value;
  }

  get cargoAccumulated() {
    return this._cargoAccumulated;
  }

  get maxCargo() {
    return this.wagons.reduce((cargo, wagon) => cargo + wagon.maxCargo, 0);
  }

  get maxSpeed() {
    return this.wagons.reduce((speed, wagon) => wagon.calcSpeed(speed), 3.2); // 120km/h
  }

  get cargo() {
    return this.wagons.reduce((cargo, wagon) => cargo + wagon.cargo, 0);
  }

  set cargo(cargo) {
    const cargoPerWagon = cargo / this.wagons.length;

    this.wagons.forEach((wagon) => {
      wagon.cargo = cargoPerWagon;
    });
  }

  set state(value) {
    this._state = value;
    switch (this.state) {
      case STATE_OPENING_DOORS:
        // this._stateColor = 0x7FDBFF;
        this._stateColor = 0x2d2d2d;
        break;
      case STATE_CLOSING_DOORS:
        // this._stateColor = 0xFFDC00;
        this._stateColor = 0x2d2d2d;
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
      default:
    }
  }

  get state() {
    return this._state;
  }

  updateInfo() {
    if (this.info.visible) {
      const speed = Math.floor(this.speed * 100);
      const maxSpeed = Math.floor(this.maxSpeed * 100);
      let nextWayPointName;

      try {
        nextWayPointName = this.itinerary.getNextWayPoint().name;
      } catch (e) {
        nextWayPointName = '';
      }

      this.info.text =
        `#${this._id} - ${this.state}
Cargo: ${this.cargo} / ${this.maxCargo} / Total: ${this.cargoAccumulated}
Speed: ${speed}km/h / ${maxSpeed}km/h
Stop: ${this.itinerary.currentWayPoint.name} → ${nextWayPointName}
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
      let nextStop;

      try {
        nextStop = this.itinerary.getNextWayPoint();
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
          this.itinerary.currentRoute = this.itinerary.getNextRoute();
          this._trainColor = this.itinerary.currentRoute.color;
          this.itinerary.currentWayPoint = this.itinerary.getNextWayPoint();
          nextStop = this.itinerary.currentWayPoint;
          this.run();
        });
      }
    }
  }

  /**
   * @param route {Route}
   * @param index {Number}
   */
  parkIn(route, index) {
    if (this.moving) {
      throw new Error('Can not park this train because is in movement.');
    }

    this.itinerary.currentRoute = route;
    this.itinerary.currentWayPoint = route.getWayPointAt(index);
    this.moving = false;
    this._currentStop = this.itinerary.currentWayPoint;
    this.x = this._currentStop.position.x;
    this.y = this._currentStop.position.y;
  }

  openDoors() {
    return new Promise((resolve) => {
      this.state = STATE_OPENING_DOORS;
      this._draw();
      this.updateInfo();
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  closeDoors() {
    return new Promise((resolve) => {
      this.state = STATE_CLOSING_DOORS;
      this._draw();
      this.updateInfo();
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  unload(leaveEmpty = false) {
    return new Promise((resolve) => {
      const toUnload = leaveEmpty ? this.cargo : anime.random(0, this.cargo);
      // TODO: Add partial cargo to the station? For stations that connects?
      const tmpCargo = this.cargo - toUnload;

      this.state = STATE_UNLOADING;
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
        targets: tmp,
        easing: 'linear',
        delay: 1500,
        duration: 50 * toUnload,
        cargo: tmpCargo,
        round: 1,
        update: () => {
          this.cargo = tmp.cargo;
          this._draw();
          this.updateInfo();
        },
        complete: () => {
          resolve();
        },
      });
    });
  }

  load() {
    return new Promise((resolve) => {
      const spaceInTrain = this.maxCargo - this.cargo;
      const toLoad = Math.min(spaceInTrain, this.currentStop.cargo);
      const tmpCargo = this.cargo + toLoad;

      this.state = STATE_LOADING;
      this.updateInfo();

      if (tmpCargo === 0 || tmpCargo === this.cargo) {
        this.cargo = tmpCargo;
        resolve();
        return;
      }

      const tmp = {
        cargo: this.cargo,
        stopCargo: this.currentStop.cargo,
      };

      anime({
        targets: tmp,
        easing: 'linear',
        delay: 1500,
        duration: 50 * toLoad,
        cargo: tmpCargo,
        stopCargo: this.currentStop.cargo - toLoad,
        round: 1,
        update: () => {
          this.currentStop.cargo = parseInt(tmp.stopCargo, 10);
          this.cargo = parseInt(tmp.cargo, 10);
          this._draw();
          this.updateInfo();
        },
        complete: () => {
          this.cargoAccumulated += tmpCargo;
          resolve();
        },
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
      this.state = STATE_GO;
      this.updateInfo();

      const onBegin = () => {
        if (this.currentStop) {
          this.currentStop.leave(this);
        }
        this.moving = true;
      };

      const onComplete = () => {
        this.moving = false;
        this.itinerary.currentWayPoint = nextStop;
        this._currentStop = this.itinerary.currentWayPoint;
        this.currentStop.enter(this);
        return resolve();
      };

      let easing;
      let duration = Train.getSegmentTime(distance, this.maxSpeed);
      let finalSpeed;

      if (stationToWayPoint) {
        this.speed = 0;
        easing = 'easeInSine';
        finalSpeed = this.maxSpeed;
      } else if (wayPointToWayPoint) {
        this.speed = this.maxSpeed;
        duration = (distance * 50) / this.maxSpeed;
        easing = 'linear';
        finalSpeed = this.maxSpeed;
      } else if (wayPointToStation) {
        this.speed = this.maxSpeed;
        easing = 'easeOutSine';
        finalSpeed = 0;
      } else if (stationToStation) {
        this.speed = 0;
        easing = 'easeInOutSine';
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
          targets: this,
          easing,
          duration,
          delay: isWayPoint ? 0 : 500,
          speed: finalSpeed,
          x: nextStop.position.x,
          y: nextStop.position.y,
          begin: onBegin,
          update: () => {
            this.updateInfo();
          },
          complete: onComplete,
        });
      }
    });
  }

  moveToStop(nextStop) {
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
          });
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
    this.head.closePath();

    // cargo
    // this.head.lineStyle(0);
    // this.head.beginFill(0x00FF2FF, 0.5);
    // this.head.drawCircle(0, 0, 11 + (this.cargo * 0.2));
    // this.head.endFill();

    this.cargoGrph.clear();
    this.cargoGrph.y = 12;

    const num = Math.floor(this.cargo / 220);

    for (let i = 0; i < this.wagons.length; i += 1) {
      this.cargoGrph.lineStyle(0);
      if (i < num) {
        this.cargoGrph.beginFill(0x111111, 1);
      } else {
        this.cargoGrph.beginFill(0, 0.2);
      }
      this.cargoGrph.drawRect(-6, i * (14 + 2), 14, 14);
    }
    this.cargoGrph.closePath();

    this.updateInfo();
  }

  static getSegmentTime(distance, maxSpeed) {
    return (distance * 100) / maxSpeed;
  }
}
