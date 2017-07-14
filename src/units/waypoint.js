import EventEmitter from 'wolfy87-eventemitter';

export default class WayPoint {
  constructor({ id, name, position }) {
    this._emitter = new EventEmitter();
    this._id = id;
    this._name = name;
    this._position = position;
    this._type = 0;
    this._currentTrain = null;
  }

  /**
   * @returns {EventEmitter}
   */
  get emitter() {
    return this._emitter;
  }

  /**
   * @returns {string}
   */
  get id() {
    return this._id;
  }

  /**
   * @returns {string}
   */
  get name() {
    return this._name;
  }

  /**
   * @returns {number}
   */
  get type() {
    return this._type;
  }

  /**
   * @returns {Object}
   */
  get position() {
    return this._position;
  }

  /**
   * Indicates that a train wants to reserve this station.
   * This action should be performed before the entering to the station
   * to be sure that no train is in the station.
   * @param {Train} train
   * @throws Error If a train is currently in this station and can not be reserved.
   */
  reserve(train) {
    if (this.getCurrentTrain() === null) {
      this._currentTrain = train;
      this._color = 0xFFFF00;
      this.emitter.emitEvent('train:reserve', [train]);
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
    if (train === this.getCurrentTrain()) {
      this._color = 0xFF0000;
      this.emitter.emitEvent('train:enter', [train]);
    } else {
      throw new Error('A train is in this station!');
    }
  }

  /**
   * Indicates that a train is leaving this station.
   * @param {Train} train
   */
  leave(train) {
    if (train === this.getCurrentTrain()) {
      this._currentTrain = null;
      this._color = 0x111111;
      this.emitter.emitEvent('train:reserve', [train]);
    }
  }

  /**
   * The train that is currently in the station
   * @returns {null|Train}
   */
  getCurrentTrain() {
    return this._currentTrain;
  }
}
