import Route from "./route";
import { IWayPoint } from "./waypoint";

export const nextRoute = (routes: Route[], current: Route): Route => {
    const idx = routes.indexOf(current);
    const nextRouteIndex = (idx + 1) % routes.length;
    return routes[nextRouteIndex];
};

export const nextWayPoint = (
    route: Route,
    current: IWayPoint
): Promise<IWayPoint> => {
    const next = route.getNext(current);

    if (!next) {
        return Promise.reject("no waypoint");
    }

    return Promise.resolve(next);
};

export interface IItinerary {
    wayPoint: IWayPoint | null;
    route: Route;
    routes: Route[];
}

export const Itinerary = function({ routes }: { routes: Route[] }): IItinerary {
    let _wayPoint: IWayPoint | null;
    let _route: Route;

    return {
        wayPoint: _wayPoint,
        set route(route: Route) {
            _route = route;
            _wayPoint = null;
        },
        get route(): Route {
            return _route;
        },
        routes
    };
};
