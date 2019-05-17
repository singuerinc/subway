import Station from "./station";
import WayPoint from "./waypoint";

interface ILine {
    id: string;
    name: string;
    color: number;
    direction: number;
}

export function Line({ id, name, color, direction }: ILine) {
    const wayPoints = new Map();

    return {
        id,
        name,
        color,
        wayPoints,
        direction,
        addWayPoint: (wayPoint: WayPoint | Station) => {
            wayPoints.set(wayPoint.id, wayPoint);
        }
    };
}
