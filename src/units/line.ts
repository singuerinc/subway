import Station from "./station";
import WayPoint from "./waypoint";

export interface ILine {
    id: string;
    name: string;
    color: number;
    direction: number;
    wayPoints: Map<string, WayPoint | Station>;
}

export const addWayPoint = (
    wayPoints: Map<string, WayPoint | Station>,
    wayPoint: WayPoint | Station
) => wayPoints.set(wayPoint.id, wayPoint);

export function Line({ id, name, color, direction }): ILine {
    const _wayPoints = new Map<string, WayPoint | Station>();

    return {
        id,
        name,
        color,
        get wayPoints() {
            return _wayPoints;
        },
        direction
    };
}
