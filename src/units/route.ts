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

    get onlyStations(): Station[] {
        return (this._wayPoints.filter((stop) => stop.type === 1) as Station[]);
    }

    get onlyWaypoints(): WayPoint[] {
        return this._wayPoints.filter((stop) => stop.type === 0);
    }

    set wayPoints(value: WayPoint[]) {
        this._wayPoints = value;
    }

    get wayPoints(): WayPoint[] {
        return this._wayPoints;
    }

    public getStationAt(index: number): Station {
        return this.onlyStations[index];
    }

    public getWayPointAt(index: number): WayPoint {
        return this._wayPoints[index];
    }

    get size(): number {
        return this._wayPoints.length;
    }

    public addWaypoint(waypoint) {
        this._wayPoints.push(waypoint);
    }

    public getNext(waypoint: WayPoint): WayPoint | null {
        const idx = this._wayPoints.indexOf(waypoint);

        return this.getWayPointAt(idx + 1);
    }
}
