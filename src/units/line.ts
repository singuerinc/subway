import { Station } from "./station";
import { WayPoint } from "./waypoint";

export const addWayPoint = (
    wayPoints: Map<string, WayPoint | Station>,
    wayPoint: WayPoint | Station
) => wayPoints.set(wayPoint.id, wayPoint);

export class Line {
    public wayPoints = new Map<string, WayPoint | Station>();

    constructor(
        public id: string,
        public name: string,
        public color: number,
        public direction: number
    ) {}
}
