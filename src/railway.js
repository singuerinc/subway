import "pixi.js";
import anime from "animejs";
import Utils from "./utils";
import Station from "./station";

export default class RailWay extends PIXI.Graphics {
    constructor(id, stations, color) {
        super();
        console.log(`RailWay ${id} created ${stations.size}.`);
        
        this._color = color;

        let parentStation;
        stations.forEach((station, key) => {
            if (typeof parentStation !== "undefined") {
                this.lineStyle(5, this._color);
                this.moveTo(parentStation.x, parentStation.y);
                this.lineTo(station.x, station.y);
            }
            parentStation = station;
        }, this);
    }   
}
