import Route from "./route";
import WayPoint from "./waypoint";

export default class Itinerary {
    private _routes: Route[];
    private _currentWayPoint: WayPoint | null;
    private _currentRoute: Route;

    constructor({routes}: {routes: Route[]}) {
        this._routes = routes;
    }

    public addRoute(route: Route): void {
        this._routes.push(route);
    }

    set currentWayPoint(value: WayPoint | null) {
        this._currentWayPoint = value;
    }

    get currentWayPoint(): WayPoint | null {
        return this._currentWayPoint;
    }

    get routes(): Route[] {
        return this._routes;
    }

    public getNextWayPoint(): WayPoint {
        const next = this._currentRoute.getNext(this.currentWayPoint as WayPoint);

        if (!next) {
            throw new Error();
        }

        return next;
    }

    set currentRoute(route: Route) {
        this._currentRoute = route;
        this.currentWayPoint = null;
    }

    get currentRoute(): Route {
        return this._currentRoute;
    }

    public getNextRoute(): Route {
        const idx = this._routes.indexOf(this.currentRoute);
        const nextRouteIndex = (idx + 1) % this._routes.length;

        return this._routes[nextRouteIndex];
    }

    get size(): number {
        let size = 0;

        this._routes.forEach((route) => {
            size += route.size;
        });
        return size;
    }
}
