export default class Route {
  constructor({ id }) {
    this._id = id;
    this._stops = [];
  }

  get stations() {
    return this._stops.filter(stop => stop.type === 1);
  }

  get waypoints() {
    return this._stops.filter(stop => stop.type !== 1);
  }

  addStation(station) {
    this._stops.push(station);
  }

  addWaypoint(waypoint) {
    this._stops.push(waypoint);
  }
}

