import Route from "./route";
import WayPoint from "./waypoint";

export const nextRoute = (routes: Route[], current: Route): Route => {
    const idx = routes.indexOf(current);
    const nextRouteIndex = (idx + 1) % routes.length;
    return routes[nextRouteIndex];
};

export const nextWayPoint = (
    route: Route,
    current: WayPoint
): Promise<WayPoint> => {
    const next = route.getNext(current);

    if (!next) {
        return Promise.reject("no waypoint");
    }

    return Promise.resolve(next);
};

export interface IItinerary {
    addRoute: (route: Route) => number;
    wayPoint: WayPoint | null;
    route: Route;
    routes: Route[];
}

export const Itinerary = function({ routes }): IItinerary {
    let _routes: Route[] = routes;
    let _currentWayPoint: WayPoint | null;
    let _route: Route;

    return {
        addRoute: (route: Route) => _routes.push(route),

        set wayPoint(wayPoint: WayPoint) {
            _currentWayPoint = wayPoint;
        },

        get wayPoint(): WayPoint | null {
            return _currentWayPoint;
        },

        set route(route: Route) {
            _route = route;
            _currentWayPoint = null;
        },

        get route(): Route {
            return _route;
        },

        get routes(): Route[] {
            return _routes;
        }
    };
};
