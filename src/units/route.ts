import Station from "./station";
import WayPoint from "./waypoint";

export default class Route {
    private _wayPoints: Array<WayPoint | Station>;
    private _id: string;
    private _color: number;

    constructor({id, color}) {
        this._id = id;
        this._color = color;
        this._wayPoints = [];
    }

    get id(): string {
        return this._id;
    }

    get color(): number {
        return this._color;
    }

    get onlyStations(): Array<Station> {
        return (this._wayPoints.filter(stop => stop.type === 1) as Station[]);
    }

    get onlyWaypoints(): Array<WayPoint> {
        return this._wayPoints.filter(stop => stop.type === 0);
    }

    set wayPoints(value: Array<WayPoint>) {
        this._wayPoints = value;
    }

    get wayPoints(): Array<WayPoint> {
        return this._wayPoints;
    }

    getStationAt(index: number): Station {
        return this.onlyStations[index];
    }

    getWayPointAt(index: number): WayPoint {
        return this._wayPoints[index];
    }

    get size(): number {
        return this._wayPoints.length;
    }

    addWaypoint(waypoint) {
        this._wayPoints.push(waypoint);
    }

    getNext(waypoint: WayPoint): WayPoint | null {
        const idx = this._wayPoints.indexOf(waypoint);

        return this.getWayPointAt(idx + 1);
    }
}

