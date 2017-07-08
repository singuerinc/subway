import WayPoint from "./waypoint";
import Utils from "./utils";

export default class RailWay extends PIXI.Graphics {
    constructor(id, stations, color) {
        super();
        // console.log(`RailWay ${id} created ${stations.size}.`);
        this._id = id;
        // this._color = color;
        this._color = 0x444444;

        this._stops = [];

        let parentStation;
        stations.forEach((station) => {
            if (typeof parentStation !== "undefined") {
                this.lineStyle(10, this._color, 1);
                this.moveTo(parentStation.x, parentStation.y);
                this.lineTo(station.x, station.y);
                // this.cacheAsBitmap = true;

                const [x1, y1] = Utils.midpoint(parentStation.x, parentStation.y, station.x, station.y, 0.33);
                const wp1 = new WayPoint({ id: 'wp1', position: { x: x1, y: y1 } });
                this.addChild(wp1);
                this._stops.push(wp1);

                const [x2, y2] = Utils.midpoint(parentStation.x, parentStation.y, station.x, station.y, 0.66);
                const wp2 = new WayPoint({ id: 'wp2', position: { x: x2, y: y2 } });
                this.addChild(wp2);
                this._stops.push(wp2);
            }
            this._stops.push(station);
            parentStation = station;
        }, this);
    }

    get stops() {
        return this._stops;
    }
}
