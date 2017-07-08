import * as k from "keymaster";
import Train from "./train";
import WayPoint from "./waypoint";
import Utils from "./utils";

export default class RailWay extends PIXI.Graphics {
    constructor({id, stations, color, idx}) {
        super();
        console.log(idx);
        // console.log(`RailWay ${id} created ${stations.size}.`);
        this._id = id;
        this._color = color;

        const f = global.gui.addFolder(this._id);
        f.add(this, 'visible').listen();

        k("" + idx, () => {
            this.visible = !this.visible;
        });

        this.layerStations = new PIXI.Graphics();
        this.addChild(this.layerStations);

        for(var i=0; i<stations.length; i++){
            this.layerStations.addChild(stations[i]);
        }

        this.layerWayPoints = new PIXI.Graphics();
        this.addChild(this.layerWayPoints);

        this.layerTrains = new PIXI.Graphics();
        this.addChild(this.layerTrains);

        this._stops = [];

        let parentStation;
        stations.forEach((station, a, b) => {
            if(!parentStation){
                parentStation = b[b.length-1];
            }
            if (typeof parentStation !== "undefined") {
                this.lineStyle(10, this._color, 1);
                this.moveTo(parentStation.x, parentStation.y);
                this.lineTo(station.x, station.y);

                const distanceBtwStations = Utils.distance(station.x, station.y, parentStation.x, parentStation.y);
                const numWayPoints = Math.floor(distanceBtwStations / 20);

                for (var i = 1; i < numWayPoints; i++) {
                    const percentage = (1 / numWayPoints) * i;
                    const [x, y] = Utils.midpoint(parentStation.x, parentStation.y, station.x, station.y, percentage);
                    const wp = new WayPoint({ id: `${parentStation._id}-wp-${i}`, position: { x: x, y: y } });
                    this.layerWayPoints.addChild(wp);
                    this._stops.push(wp);
                }
            }
            this._stops.push(station);
            parentStation = station;
        }, this);

        for (let i = 0; i < this.stops.length / 6; i++) {
        // for (let i = 0; i < 1; i++) {
            const train = new Train(`${i}`, {
                stops: this.stops
            });
            let stopIndex = i * 4;
            train.parkIn(this.stops[stopIndex], stopIndex);
            train.run();
            this.layerTrains.addChild(train);
        }


        f.add(this.layerStations, 'visible');
        f.add(this.layerWayPoints, 'visible');
        f.add(this.layerTrains, 'visible');
    }

    get stops() {
        return this._stops;
    }
}
