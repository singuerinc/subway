import Line from "./units/line";
import PIXI = require("pixi.js");
import StationSprite from "./station.sprite";
import Station from "./units/station";
import WayPointSprite from "./waypoint.sprite";

export default class RailWay extends PIXI.Graphics {
    get layerStations(): PIXI.Graphics {
        return this._layerStations;
    }

    private _id: string;
    private _color: number;
    private _layerWayPoints: PIXI.Graphics;
    private _layerStations: PIXI.Graphics;
    private _layerLines: PIXI.Graphics;

    constructor({ id, line }: { id: string; line: Line }) {
        super();
        // console.log(`RailWay ${id} created.`);
        this._id = id;
        this._color = line.color;

        this._layerLines = new PIXI.Graphics();
        this._layerLines.cacheAsBitmap = true;
        this.addChild(this._layerLines);

        this._layerWayPoints = new PIXI.Graphics();
        this.addChild(this._layerWayPoints);

        this._layerStations = new PIXI.Graphics();
        this.addChild(this._layerStations);

        let parentStation;
        let prevStation;

        line.wayPoints.forEach(wayPoint => {
            if (wayPoint.type === 1) {
                const station = new StationSprite({
                    model: wayPoint as Station,
                    color: line.color
                });

                if (prevStation) {
                    prevStation.parentStation = station;
                }

                prevStation = station;

                this._layerStations.addChild(station);

                if (parentStation) {
                    const px = parentStation.position.x;
                    const py = parentStation.position.y;
                    const sx = wayPoint.position.x;
                    const sy = wayPoint.position.y;

                    this._layerLines.lineStyle(66, this._color, 0.04);
                    this._layerLines.moveTo(px, py);
                    this._layerLines.lineTo(sx, sy);
                    this._layerLines.lineStyle(6, 0x2d2d2d, 1);
                    this._layerLines.moveTo(px, py);
                    this._layerLines.lineTo(sx, sy);
                    this._layerLines.lineStyle(12, this._color, 1);
                    this._layerLines.moveTo(px, py);
                    this._layerLines.lineTo(sx, sy);
                }

                parentStation = wayPoint;
            } else if (wayPoint.type === 0) {
                const wp = new WayPointSprite({ model: wayPoint });

                this._layerWayPoints.addChild(wp);
            }
        });
    }

    get id(): string {
        return this._id;
    }
}
