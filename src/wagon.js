export default class Wagon {
  constructor() {
    this._cargo = 0;
    this._maxCargo = 0;
  }

  get maxCargo() {
    return this._maxCargo;
  }

  calcSpeed(speed) {
    const v = this.cargo / this.maxCargo;
    const f = 0.03 * v;

    return (speed * 0.9) - f;
  }

  set cargo(value) {
    this._cargo = value;
  }

  get cargo() {
    return this._cargo;
  }
}
