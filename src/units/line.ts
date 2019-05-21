import { IStation } from "./station";
import { IWayPoint } from "./waypoint";

export const addWayPoint = (
    wayPoints: Map<string, IWayPoint | IStation>,
    wayPoint: IWayPoint | IStation
) => wayPoints.set(wayPoint.id, wayPoint);

export class Line {
    public wayPoints = new Map<string, IWayPoint | IStation>();

    constructor(
        public id: string,
        public name: string,
        public color: number,
        public direction: number
    ) {}
}
