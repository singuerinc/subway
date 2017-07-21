import StationSprite from "./station.sprite";
import WayPointSprite from "./waypoint.sprite";

/**
 * @extends PIXI.Graphics
 */
export default class RailWay extends PIXI.Graphics {
    get layerStations(): PIXI.Graphics {
        return this._layerStations;
    }

    private _id: string;
    private _color: number;
    private _layerWayPoints: PIXI.Graphics;
    private _layerStations: PIXI.Graphics;
    private layerLines: PIXI.Graphics;

    constructor({id, line}) {
        super();
        // console.log(`RailWay ${id} created.`);
        this._id = id;
        this._color = line.color;

        this.layerLines = new PIXI.Graphics();
        this.layerLines.cacheAsBitmap = true;
        this.addChild(this.layerLines);

        this._layerWayPoints = new PIXI.Graphics();
        this.addChild(this._layerWayPoints);

        this._layerStations = new PIXI.Graphics();
        this.addChild(this._layerStations);

        let parentStation;
        let prevStation;

        for (const [, wayPoint] of line.wayPoints.entries()) {
            if (wayPoint.type === 1) {
                const station = new StationSprite({model: wayPoint, color: line.color});

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

                    this.layerLines.lineStyle(66, this._color, 0.04);
                    this.layerLines.moveTo(px, py);
                    this.layerLines.lineTo(sx, sy);
                    this.layerLines.lineStyle(6, 0x2D2D2D, 1);
                    this.layerLines.moveTo(px, py);
                    this.layerLines.lineTo(sx, sy);
                    this.layerLines.lineStyle(12, this._color, 1);
                    this.layerLines.moveTo(px, py);
                    this.layerLines.lineTo(sx, sy);
                }

                parentStation = wayPoint;
            } else if (wayPoint.type === 0) {
                const wp = new WayPointSprite({model: wayPoint});

                this._layerWayPoints.addChild(wp);
            }
        }
    }

    /**
     * @returns {String}
     */
    get id(): string {
        return this._id;
    }
}
