import "pixi.js";
import anime from "animejs";
import Utils from "./utils";
import Station from "./station";
import WayPoint from "./waypoint";

export default class RailWay extends PIXI.Graphics {
    constructor(id, stations, color) {
        super();
        console.log(`RailWay ${id} created ${stations.size}.`);
        
        this._color = color;

        let parentStation;
        stations.forEach((station, key) => {
            console.log("------->", key);
            if (typeof parentStation !== "undefined") {
                this.lineStyle(18, this._color, 0.4);
                this.moveTo(parentStation.x, parentStation.y);
                this.lineTo(station.x, station.y);
            }
            parentStation = station;
        }, this);
    }   
}
