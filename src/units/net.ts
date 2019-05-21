import { data as l1Data } from "../lines/l1";
import { data as l1rData } from "../lines/l1-r";
import { data as l10Data } from "../lines/l10";
import { data as l10rData } from "../lines/l10-r";
import { data as l11Data } from "../lines/l11";
import { data as l11rData } from "../lines/l11-r";
import { data as l2Data } from "../lines/l2";
import { data as l2rData } from "../lines/l2-r";
import { data as l3Data } from "../lines/l3";
import { data as l3rData } from "../lines/l3-r";
import { data as l4Data } from "../lines/l4";
import { data as l4rData } from "../lines/l4-r";
import { data as l5Data } from "../lines/l5";
import { data as l5rData } from "../lines/l5-r";
import { data as l9Data } from "../lines/l9";
import { data as l9rData } from "../lines/l9-r";
import ILineData from "../lines/linedata";
import MathUtils from "../mathUtils";
import { Train } from "../train";
import { IItinerary, Itinerary, nextRoute, nextWayPoint } from "./itinerary";
import { addWayPoint, Line } from "./line";
import { Route } from "./route";
import { Station } from "./station";
import { WayPoint } from "./waypoint";

const convert = (value: number): number =>
    Math.floor((value - Math.floor(value)) * 20000);

const parseWayPoints = (all: Map<string, Station>, data): Station[] => {
    let stations: Station[] = [];
    for (let i = 0; i < data.length; i += 1) {
        const info = data[i];

        if (!all.has(info.id)) {
            const sx = convert(parseFloat(info.lat)) - 6894;
            const sy = convert(parseFloat(info.lon)) - 2053;
            const s = new Station(info.id, info.name, {
                x: sx,
                y: sy
            });

            stations = [...stations, s];
        }
    }

    return stations;
};

const createRoutes = (lines: Line[]): Map<string, Route> => {
    const routes = new Map<string, Route>();
    lines.forEach(line => {
        const route = new Route(line.id, line.color);

        line.wayPoints.forEach(wayPoint => {
            route.addWaypoint(wayPoint);
        });

        routes.set(route.id, route);
    });

    return routes;
};

export default class Net {
    public stations = new Map<string, Station>();
    public wayPoints = new Map<string, WayPoint>();
    public lines = new Map<string, Line>();
    public trains: Train[] = [];

    constructor() {
        const l1 = [...l1Data, ...l1rData];
        const l2 = [...l2Data, ...l2rData];
        const l3 = [...l3Data, ...l3rData];
        const l4 = [...l4Data, ...l4rData];
        const l5 = [...l5Data, ...l5rData];
        const l9 = [...l9Data, ...l9rData];
        const l10 = [...l10Data, ...l10rData];
        const l11 = [...l11Data, ...l11rData];

        const all = [l1, l2, l3, l4, l5, l9, l10, l11];

        let lines = [];

        all.forEach(line => {
            const waypoints = parseWayPoints(this.stations, line);
            waypoints.forEach(w => this.stations.set(w.id, w));

            const parsed: Line = this._parseLine(line, 0xff2136);

            this.lines.set(parsed.id, parsed);

            lines = [...lines, parsed];
        });

        const routes = createRoutes(lines);

        routes.forEach((route: Route) => {
            const itineraryRoutes: Route[] = [route];

            const numTrains = Math.floor(itineraryRoutes[0].size() * 0.25);

            // console.log(numTrains);
            for (let i = 0; i < numTrains; i += 1) {
                const itinerary = Itinerary({
                    routes: itineraryRoutes
                });

                itinerary.route = nextRoute(itinerary.routes, itinerary.route);

                nextWayPoint(itinerary.route, itinerary.wayPoint).then(
                    w => (itinerary.wayPoint = w)
                );

                this._addTrains(`${i}`, itinerary);
                // this._addTrains(line1.onlyStations.length / 2, itinerary, 0xFF2136);
            }
        });
    }

    private _addTrains(id: string, itinerary: IItinerary): void {
        const train = new Train(id, {
            itinerary
        });

        this.trains = [...this.trains, train];
    }

    private _parseLine(
        data: ILineData[],
        color: number,
        direction: number = 1
    ) {
        const line = new Line(data[0].line, data[0].line, color, direction);

        let prevStation: Station | null = null;

        for (let i = 0; i < data.length; i += 1) {
            const info: ILineData = data[i] as ILineData;

            if (this.stations.has(info.id)) {
                const station: Station = this.stations.get(info.id);

                if (prevStation) {
                    const { x: px, y: py } = prevStation.position;
                    const { x: sx, y: sy } = station.position;
                    const distanceBtwStations = MathUtils.distance(
                        sx,
                        sy,
                        px,
                        py
                    );
                    const numWayPoints = Math.floor(distanceBtwStations / 45);

                    for (let j = 0; j < numWayPoints - 1; j += 1) {
                        const percentage = (1 / numWayPoints) * (j + 1);
                        const [x, y] = MathUtils.midpoint(
                            px,
                            py,
                            sx,
                            sy,
                            percentage
                        );
                        const wpId = `${prevStation.id}-2-${
                            station.id
                        }-wp-${j}`;
                        let wayPoint;

                        if (!this.wayPoints.has(wpId)) {
                            wayPoint = new WayPoint(wpId, wpId, {
                                x,
                                y
                            });

                            this.wayPoints.set(wpId, wayPoint);
                        } else {
                            wayPoint = this.wayPoints.get(wpId);
                        }
                        addWayPoint(line.wayPoints, wayPoint);
                    }
                }

                addWayPoint(line.wayPoints, station);
                prevStation = station;
            } else {
                throw new Error(`Can't parse, station not found ${info.id}`);
            }
        }

        return line;
    }
}
