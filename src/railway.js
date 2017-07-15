import * as k from 'keymaster';
import Train from './train';
import Route from './units/route';
import WayPointSprite from './waypoint.sprite';
import StationSprite from './station.sprite';

let idx = 0;

/**
 * @extends PIXI.Graphics
 */
export default class RailWay extends PIXI.Graphics {

  constructor({ id, line }) {
    super();
    // console.log(`RailWay ${id} created ${stations.size}.`);
    this._id = id;
    this._color = line.color;

    this.layerLines = new PIXI.Graphics();
    this.layerLines.cacheAsBitmap = true;
    this.addChild(this.layerLines);

    this.layerWayPoints = new PIXI.Graphics();
    this.addChild(this.layerWayPoints);

    this.layerStations = new PIXI.Graphics();
    this.addChild(this.layerStations);

    let parentStation;
    let prevStation;

    for (const [, wayPoint] of line.wayPoints.entries()) {
      if (wayPoint.type === 1) {
        const station = new StationSprite({ model: wayPoint, color: line.color, dir: 1 });

        if (prevStation) {
          prevStation.parentStation = station;
        }

        prevStation = station;

        this.layerStations.addChild(station);

        if (parentStation) {
          const px = parentStation.position.x;
          const py = parentStation.position.y;
          const sx = wayPoint.position.x;
          const sy = wayPoint.position.y;

          this.layerLines.lineStyle(66, this._color, 0.02);
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
        const wp = new WayPointSprite({ model: wayPoint, color: line.color, dir: 1 });

        this.layerWayPoints.addChild(wp);
      }
    }

    // this._addTrains(Math.floor(this._route.onlyStations.length * 0.5));
    // this._addTrains(1);

    k(`${++idx}`, () => {
      this.visible = !this.visible;
    });
    //
    k('r', () => {
      this.layerLines.visible = !this.layerLines.visible;
    });
  }

  /**
   * @returns {String}
   */
  get id() {
    return this._id;
  }
}
