import { Station, IStation } from "./station";
import { IWayPoint } from "./waypoint";

export const stationAt = (stations: IStation[], idx: number): IStation =>
    stations[idx];
export const wayPointAt = (waypoints: IWayPoint[], index: number): IWayPoint =>
    waypoints[index];
export const onlyStations = (stops: Array<IWayPoint | Station>): Station[] =>
    stops.filter(stop => stop.type === 1) as Station[];
export const onlyWaypoints = (stops: Array<IWayPoint | Station>): Station[] =>
    stops.filter(stop => stop.type === 0) as Station[];
export const next = (
    waypoints: IWayPoint[],
    waypoint: IWayPoint
): IWayPoint | null => wayPointAt(waypoints, waypoints.indexOf(waypoint) + 1);

export class Route {
    public wayPoints: Array<IWayPoint | Station> = [];

    constructor(public id: string, public color: number) {}

    public size = () => this.wayPoints.length;
    public addWaypoint = (waypoint: IWayPoint | Station) =>
        (this.wayPoints = [...this.wayPoints, waypoint]);
}
