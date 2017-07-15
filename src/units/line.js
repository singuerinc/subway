export default class Line {
  constructor({ id, name, color, direction }) {
    this._id = id;
    this._name = name;
    this._color = color;
    this._wayPoints = new Map();
    this._direction = direction;
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
  get color() {
    return this._color;
  }

  /**
   * @returns {number}
   */
  get direction() {
    return this._direction;
  }

  /**
   * @returns {Map}
   */
  get wayPoints() {
    return this._wayPoints;
  }

  /**
   * @returns {Array}
   */
  get onlyStations() {
    const arr = Array.from(this.wayPoints);
    const stations = arr.filter(wayPoint => wayPoint[1].type === 1);

    return stations.map(value => value[1]);
  }

  addWayPoint(wayPoint) {
    this.wayPoints.set(wayPoint.id, wayPoint);
  }
}
