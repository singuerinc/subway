export default class Route {
  constructor({ id, color }) {
    this._id = id;
    this._color = color;
    this._waypoints = [];
  }

  /**
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  /**
   * @returns {Number}
   */
  get color() {
    return this._color;
  }

  /**
   * @returns {Array.<Station>}
   */
  get onlyStations() {
    return this._waypoints.filter(stop => stop.type === 1);
  }

  /**
   * @returns {Array.<WayPoint>}
   */
  get onlyWaypoints() {
    return this._waypoints.filter(stop => stop.type === 0);
  }

  /**
   * @param {Array.<WayPoint>} value
   */
  set waypoints(value) {
    this._waypoints = value;
  }

  /**
   * @returns {Array.<WayPoint>}
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

