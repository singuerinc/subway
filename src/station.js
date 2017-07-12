import * as k from 'keymaster';
import MathUtils from './mathUtils';
import anime from 'animejs';

// TODO: Extend from WayPoint
export default class Station extends PIXI.Graphics {
  constructor({ id, position, dir, color, type }) {
    super();
        // console.log(`Station ${id} created.`);
    this._id = id;
    this._currentTrain = null;
    this._color = color;
    this.dir = dir;
    this.x = position.x;
    this.y = position.y;
        // this.visible = false;
    this.interactive = true;
    this.buttonMode = true;

    this.graph = new PIXI.Graphics();
    this.graph.x = 20;
    this.addChild(this.graph);

    this.info = new PIXI.Graphics();
    this.addChild(this.info);

    this.infoNameText = new PIXI.Text('', {
      fontFamily: 'Inconsolata',
      fontSize: 22,
      fill: 0x1E1E1E,
    });

    this.infoNameText.visible = false;
    this.infoNameText.x = 50;
    this.infoNameText.y = -40;
    this.info.addChild(this.infoNameText);

    this.on('click', () => {
      this.info.visible = !this.info.visible;
    });

    const initialCargo = anime.random(20, 50);

    this.cargo = initialCargo;

        // simulate cargo arriving
    setInterval(() => {
      const value = anime.random(1, 10);
      this.cargo += value;
    }, 10000);

    k('s', () => {
      this.visible = !this.visible;
    });

    this._draw();
  }

    /**
     * Indicates that a train wants to reserve this station.
     * This action should be performed before the entering to the station
     * to be sure that no train is in the station.
     * @param {Train} train
     * @throws Error If a train is currently in this station and can not be reserved.
     */
  reserve(train) {
    if (this._currentTrain === null) {
      this._currentTrain = train;
      this._color = 0xFFFF00;
      this._draw();
    } else {
      throw new Error('A train is in this station!');
    }
  }

    /**
     * Indicates that a train wants to enter in this station.
     * @param {Train} train
     * @throws Error If a train is currently in this station and can not be reserved.
     */
  enter(train) {
    if (this._currentTrain === train) {
      this._color = 0xFF0000;
      this._draw();
    } else {
      throw new Error('A train is in this station!');
    }
  }

    /**
     * Indicates that a train is leaving this station.
     * @param {Train} train
     */
  leave(train) {
    if (train === this._currentTrain) {
      this._currentTrain = null;
      this._color = 0x111111;
      this._draw();
    }
  }

    /**
     * The train that is currently in the station
     * @returns {null|Train}
     */
  getCurrentTrain() {
    return this._currentTrain;
  }

    /**
     * Returns if a train is or not in the station
     * @returns {boolean}
     */
  hasTrain() {
    return this.getCurrentTrain() !== null;
  }

    /**
     * Set the cargo for this station.
     * @param {Number} value
     */
  set cargo(value) {
    this._cargo = value;
    this._draw();
  }

    /**
     * The cargo waiting in this station.
     * @returns {Number}
     */
  get cargo() {
    return this._cargo;
  }

  get id() {
    return this._id;
  }

    /**
     * Set the nearest station connected to this station
     * @param {Station} value
     */
  set parentStation(value) {
    this._parentStation = value;
    const angle = MathUtils.angle(this.x, this.y, this._parentStation.x, this._parentStation.y);
    this.rotation = (angle + (Math.PI / 2)) + Math.PI;
  }

    /**
     * The nearest station connected to this station
     * @returns {Station}
     */
  get parentStation() {
    return this._parentStation;
  }

  _draw(cargo) {
    const c = cargo || this.cargo;
    this.infoNameText.text = c;

    this.cacheAsBitmap = false;

        // cargo
    this.info.clear();
        // this.info.lineStyle(0);
        // this.info.beginFill(0x111111, 0.4);
        // this.info.drawCircle(0, 0, 26 + (c * 0.1));
    const num = Math.floor(c / 10);
    for (let i = 0; i < num; i++) {
      this.info.lineStyle(0);
      this.info.beginFill(0x111111, 1);
      this.info.drawRect(50 + (i % 5 * 14), (-5) + (Math.floor(i / 5) * 14), 10, 10);
    }
    this.info.closePath();

        // station big
    this.graph.clear();
    this.graph.lineStyle(4, this._color, 1);
    this.graph.beginFill(0xFFFFFF, 1);
    this.graph.beginFill(this._color, 0.2);
    this.graph.drawCircle(0, 0, 10);
    this.graph.endFill();
    this.graph.closePath();

        // station small
        // this.graph.clear();
        // this.graph.lineStyle(6, 0x1E1E1E, 0.4);
        // this.graph.beginFill(this._color, 0.1);
        // this.graph.drawCircle(0, 0, 32);
    this.graph.closePath();

    this.cacheAsBitmap = true;
  }
}
