import { Line } from "./units/line";
import PIXI = require("pixi.js");
import { StationSprite } from "./station.sprite";
import { Station } from "./units/station";
import { WayPointSprite } from "./waypoint.sprite";

export class RailWay extends PIXI.Graphics {
    private layerStations: PIXI.Graphics;

    private _layerWayPoints: PIXI.Graphics;
    private _layerLines: PIXI.Graphics;

    constructor(public id: string, line: Line) {
        super();
        // console.log(`RailWay ${id} created.`);

        this._layerLines = new PIXI.Graphics();
        this._layerLines.cacheAsBitmap = true;
        this.addChild(this._layerLines);

        this._layerWayPoints = new PIXI.Graphics();
        this.addChild(this._layerWayPoints);

        this.layerStations = new PIXI.Graphics();
        this.addChild(this.layerStations);

        let parentStation;
        let prevStation;

        line.wayPoints.forEach(wayPoint => {
            if (wayPoint.type === 1) {
                const station = new StationSprite(
                    wayPoint as Station,
                    line.color
                );

                if (prevStation) {
                    prevStation.parentStation = station;
                }

                prevStation = station;

                this.layerStations.addChild(station);

                if (parentStation) {
                    const { x: px, y: py } = parentStation.position;
                    const { x: sx, y: sy } = wayPoint.position;

                    this._layerLines.lineStyle(66, line.color, 0.04);
                    this._layerLines.moveTo(px, py);
                    this._layerLines.lineTo(sx, sy);
                    this._layerLines.lineStyle(6, 0x2d2d2d, 1);
                    this._layerLines.moveTo(px, py);
                    this._layerLines.lineTo(sx, sy);
                    this._layerLines.lineStyle(12, line.color, 1);
                    this._layerLines.moveTo(px, py);
                    this._layerLines.lineTo(sx, sy);
                }

                parentStation = wayPoint;
            } else if (wayPoint.type === 0) {
                const wp = new WayPointSprite(wayPoint);

                this._layerWayPoints.addChild(wp);
            }
        });
    }
}
