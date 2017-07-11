import * as k from "keymaster";
import Train from "./train";
import WayPoint from "./waypoint";
import Utils from "./utils";

export default class RailWay extends PIXI.Graphics {
    constructor({ id, stations, color, idx }) {
        super();
        // console.log(`RailWay ${id} created ${stations.size}.`);
        this._id = id;
        this._color = color;

        k("" + idx, () => {
            this.visible = !this.visible;
        });

        this.layerLines = new PIXI.Graphics();
        this.layerLines.cacheAsBitmap = true;
        this.addChild(this.layerLines);

        k("r", () => {
            this.layerLines.visible = !this.layerLines.visible;
        });

        this.layerWayPoints = new PIXI.Graphics();
        this.addChild(this.layerWayPoints);

        this.layerStations = new PIXI.Graphics();
        this.addChild(this.layerStations);

        for (let i = 0; i < stations.length; i++) {
            const station = stations[i];
            this.layerStations.addChild(station);
        }

        this.layerTrains = new PIXI.Graphics();
        this.addChild(this.layerTrains);

        this._stops = [];

        let parentStation;
        stations.forEach((station, a, b) => {
            if (!parentStation) {
                // if no parent station means that is the first one,
                // so the parent station is the last one.
                parentStation = b[b.length - 1];
            }

            let px = parentStation.x;
            let py = parentStation.y;
            let sx = station.x;
            let sy = station.y;

            if (station.dir === 1) {
                this.layerLines.lineStyle(66, this._color, 0.1);
                this.layerLines.moveTo(px, py);
                this.layerLines.lineTo(sx, sy);
                this.layerLines.lineStyle(5, this._color, 1);
                this.layerLines.moveTo(px, py);
                this.layerLines.lineTo(sx, sy);
            }

            // create at least 1 waypoint between stations
            // FIXME: numWayPoints min should be 1, not 2
            const distanceBtwStations = Utils.distance(sx, sy, px, py);
            const numWayPoints = Math.floor(distanceBtwStations / 40);

            let prevStop = station;
            for (let i = 0; i < numWayPoints - 1; i++) {
                const percentage = (1 / numWayPoints) * (i + 1);
                const [x, y] = Utils.midpoint(px, py, sx, sy, percentage);
                const wp = new WayPoint({ id: `${parentStation._id}-wp-${i}`, prevStop, position: { x: x, y: y } });
                if (station.dir === 1) {
                    this.layerWayPoints.addChild(wp);
                }
                this._stops.push(wp);
                prevStop = wp;
            }
            station.parentStation = prevStop;

            this._stops.push(station);
            parentStation = station;
        }, this);

        // const totalTrains = 1;
        const totalTrains = Math.floor(stations.length * 0.5);
        for (let i = 0; i < totalTrains; i++) {
            const train = new Train(`${i}`, {
                stops: this.stops,
                color: this._color
            });
            let stopIndex = i * Math.floor(this.stops.length / totalTrains);
            train.parkIn(this.stops[stopIndex], stopIndex);
            train.run();
            this.layerTrains.addChild(train);
        }
    }

    get stops() {
        return this._stops;
    }
}
