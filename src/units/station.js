import anime from 'animejs';
import WayPoint from './waypoint';

export default class Station extends WayPoint {
  constructor({ id, name, type, position }) {
    super({ id, name, type, position });

    this._type = 1;

    const initialCargo = anime.random(20, 50);

    this.cargo = initialCargo;

    // simulate cargo arriving
    setInterval(() => {
      const value = anime.random(1, 10);

      this.cargo += value;
    }, 10000);
  }

  /**
   * @returns {number}
   */
  get type() {
    return this._type;
  }

  /**
   * Set the cargo for this station.
   * @param {Number} value
   */
  set cargo(value) {
    this._cargo = value;
    this.emitter.emitEvent('cargo:changed', [this._cargo]);
  }

  /**
   * The cargo waiting in this station.
   * @returns {Number}
   */
  get cargo() {
    return this._cargo;
  }
}
