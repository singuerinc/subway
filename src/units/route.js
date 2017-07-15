export default class Route {
  constructor({ id }) {
    this._id = id;
    this._waypoints = [];
  }

  /**
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  get onlyStations() {
    return this._waypoints.filter(stop => stop.type === 1);
  }

  get onlyWaypoints() {
    return this._waypoints.filter(stop => stop.type === 0);
  }

  /**
   * @param {Array} value
   */
  set waypoints(value) {
    this._waypoints = value;
  }

  /**
   * @returns {Array}
   */
  get waypoints() {
    return this._waypoints;
  }

  /**
   * @param {Number} index
   * @returns {Station}
   */
  getStationAt(index) {
    return this.onlyStations[index];
  }

  /**
   * @param {Number} index
   * @returns {WayPoint}
   */
  getWayPointAt(index) {
    return this._waypoints[index];
  }

  /**
   * @returns {Number}
   */
  get size() {
    return this._waypoints.length;
  }

  addWaypoint(waypoint) {
    this._waypoints.push(waypoint);
  }

  /**
   * @param {WayPoint} waypoint
   * @returns {WayPoint}
   */
  getNext(waypoint) {
    const idx = this._waypoints.indexOf(waypoint);

    return this.getWayPointAt(idx + 1);
  }
}

