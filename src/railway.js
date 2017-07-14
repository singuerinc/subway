import * as k from 'keymaster';
import Train from './train';
import Route from './units/route';
import WayPointSprite from './waypoint.sprite';
import StationSprite from './station.sprite';

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

    this.layerTrains = new PIXI.Graphics();
    this.addChild(this.layerTrains);
    //
    this._route = new Route({ id: this.id });
    //
    let parentStation;

    for (const [, wayPoint] of line.wayPoints.entries()) {
      if (wayPoint.type === 1) {
        const station = new StationSprite({ model: wayPoint, color: line.color, dir: 1 });

        this.layerStations.addChild(station);

        if (parentStation) {
          const px = parentStation.position.x;
          const py = parentStation.position.y;
          const sx = wayPoint.position.x;
          const sy = wayPoint.position.y;

          this.layerLines.lineStyle(66, this._color, 0.1);
          this.layerLines.moveTo(px, py);
          this.layerLines.lineTo(sx, sy);
          this.layerLines.lineStyle(5, this._color, 1);
          this.layerLines.moveTo(px, py);
          this.layerLines.lineTo(sx, sy);
        }

        parentStation = wayPoint;
      } else if (wayPoint.type === 0) {
        const wp = new WayPointSprite({ model: wayPoint, color: line.color, dir: 1 });

        this.layerWayPoints.addChild(wp);
      }

      this._route.addWaypoint(wayPoint);
    }

    // this._addTrains(Math.floor(stations.length * 0.5));
    this._addTrains(1);

    //
    // k(`${idx}`, () => {
    //   this.visible = !this.visible;
    // });
    //
    // k('r', () => {
    //   this.layerLines.visible = !this.layerLines.visible;
    // });
  }

  _addTrains(numTrains) {
    for (let i = 0; i < numTrains; i += 1) {
      const train = new Train(`${this._route.id}-${i}`, {
        route: this._route,
        color: this._color,
      });
      const stopIndex = i * Math.floor(this._route.size / numTrains);

      train.parkIn(this._route.getWayPointAt(stopIndex), stopIndex);
      train.run();
      this.layerTrains.addChild(train);

      if (i === 1 && this._id === 'L1') {
        train.openTrainInfo();
      }
    }
  }

  /**
   * @returns {String}
   */
  get id() {
    return this._id;
  }
}
