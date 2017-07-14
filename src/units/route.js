export default class Route {
  constructor({ id }) {
    this._id = id;
    this._stops = [];
  }

  /**
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  get onlyStations() {
    return this._stops.filter(stop => stop.type === 1);
  }

  get onlyWaypoints() {
    return this._stops.filter(stop => stop.type === 0);
  }

  get waypoints() {
    return this._stops;
  }

  /**
   * @param {Number} index
   * @returns {WayPoint}
   */
  getWayPointAt(index) {
    return this._stops[index];
  }

  /**
   * @returns {Number}
   */
  get size() {
    return this._stops.length;
  }

  addWaypoint(waypoint) {
    this._stops.push(waypoint);
  }
}

