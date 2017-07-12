import * as k from 'keymaster';
import Train from './train';
import WayPoint from './waypoint';
import MathUtils from './mathUtils';
import Station from './station';

/**
 * @extends PIXI.Graphics
 */
export default class RailWay extends PIXI.Graphics {
  constructor({ id, line, idx }) {
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

    const stations = [];
    for (let i = 0; i < line.list.length; i += 1) {
      const station = new Station(line.list[i]);
      stations.push(station);
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

      const px = parentStation.x;
      const py = parentStation.y;
      const sx = station.x;
      const sy = station.y;

      if (station.dir === 1) {
        this.layerLines.lineStyle(66, this._color, 0.1);
        this.layerLines.moveTo(px, py);
        this.layerLines.lineTo(sx, sy);
        this.layerLines.lineStyle(5, this._color, 1);
        this.layerLines.moveTo(px, py);
        this.layerLines.lineTo(sx, sy);
      }

      // create at least 1 wayPoint between stations
      // FIXME: numWayPoints min should be 1, not 2
      const distanceBtwStations = MathUtils.distance(sx, sy, px, py);
      const numWayPoints = Math.floor(distanceBtwStations / 40);

      let prevStop = station;
      for (let i = 0; i < numWayPoints - 1; i++) {
        const percentage = (1 / numWayPoints) * (i + 1);
        const [x, y] = MathUtils.midpoint(px, py, sx, sy, percentage);
        const wp = new WayPoint({ id: `${parentStation.id}-wp-${i}`, prevStop, position: { x, y } });
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

    this._addTrains(Math.floor(stations.length * 0.5));

    k(`${idx}`, () => {
      this.visible = !this.visible;
    });

    k('r', () => {
      this.layerLines.visible = !this.layerLines.visible;
    });
  }

  get stops() {
    return this._stops;
  }

  _addTrains(numTrains) {
    for (let i = 0; i < numTrains; i++) {
      const train = new Train(`${i}`, {
        stops: this.stops,
        color: this._color,
      });
      const stopIndex = i * Math.floor(this.stops.length / numTrains);

      train.parkIn(this.stops[stopIndex], stopIndex);
      train.run();
      this.layerTrains.addChild(train);

      if (i === 1 && this._id === 'L1') {
        train.openTrainInfo();
      }
    }
  }
}
