export default class Itinerary {
  constructor({ routes }) {
    this._routes = routes;
    // this.currentRoute = this.getNextRoute();
  }

  /**
   * @param {Route} route
   */
  addRoute(route) {
    this._routes.push(route);
  }

  /**
   * @param {WayPoint|Station} value
   */
  set currentWayPoint(value) {
    this._currentWayPoint = value;
  }

  /**
   * @returns {WayPoint|Station}
   */
  get currentWayPoint() {
    return this._currentWayPoint;
  }

  /**
   * @returns {Array.<Route>}
   */
  get routes() {
    return this._routes;
  }

  /**
   * @returns {WayPoint|Station}
   */
  getNextWayPoint() {
    const next = this._currentRoute.getNext(this.currentWayPoint);

    if (!next) {
      throw new Error();
    }

    return next;
  }

  /**
   * @param {Route} route
   */
  set currentRoute(route) {
    this._currentRoute = route;
    this.currentWayPoint = null;
  }

  /**
   * @returns {Route}
   */
  get currentRoute() {
    return this._currentRoute;
  }

  getNextRoute() {
    const idx = this._routes.indexOf(this.currentRoute);
    const nextRouteIndex = (idx + 1) % this._routes.length;

    return this._routes[nextRouteIndex];
  }

  get size() {
    let size = 0;

    this._routes.forEach((route) => {
      size += route.size;
    });
    return size;
  }
}
