import WayPoint from "./waypoint";
import Station from "./station";

export default class Line {
    private _id: string;
    private _name: string;
    private _color: number;
    private _wayPoints: Map<string, WayPoint>;
    private _direction: number;

    constructor({id, name, color, direction}: {id: string, name: string, color: number, direction: number}) {
        this._id = id;
        this._name = name;
        this._color = color;
        this._wayPoints = new Map();
        this._direction = direction;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get color(): number {
        return this._color;
    }

    get direction(): number {
        return this._direction;
    }

    get wayPoints(): Map<string, WayPoint | Station> {
        return this._wayPoints;
    }

    get onlyStations(): Array<Station> {
        const arr = Array.from(this.wayPoints);
        const stations = arr.filter(wayPoint => wayPoint[1].type === 1);

        return stations.map(value => value[1] as Station);
    }

    addWayPoint(wayPoint: WayPoint | Station): void {
        this.wayPoints.set(wayPoint.id, wayPoint);
    }
}
