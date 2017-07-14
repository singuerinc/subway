import MathUtils from '../mathUtils';
import Station from './station';
import WayPoint from './waypoint';
import Line from './line';
import l1 from '../lines/l1.json';
import l2 from '../lines/l2.json';
import l3 from '../lines/l3.json';
import l4 from '../lines/l4.json';
import l5 from '../lines/l5.json';
import l9 from '../lines/l9.json';
import l10 from '../lines/l10.json';
import l11 from '../lines/l11.json';

export default class Net {
  constructor() {
    this._stations = new Map();
    this._waypoints = new Map();
    this._lines = new Map();

    // this._parseWayPoints(l1);
    // this._parseWayPoints(l2);
    // this._parseWayPoints(l3);
    // this._parseWayPoints(l4);
    // this._parseWayPoints(l5);
    this._parseWayPoints(l9);
    this._parseWayPoints(l10);
    // this._parseWayPoints(l11);

    // this._parseLine(l1, 0xB22AA1);
    // this._parseLine(l2, 0xB22AA1);
    // this._parseLine(l3, 0x00C03A);
    // this._parseLine(l4, 0xFFB901);
    // this._parseLine(l5, 0x007BCD);
    this._parseLine(l9, 0xFF8615);
    this._parseLine(l10, 0x00B0F2);
    // this._parseLine(l11, 0x89D748);
  }

  /**
   * @param {Array} data
   * @private
   */
  _parseWayPoints(data) {
    for (let i = 0; i < data.length; i += 1) {
      const info = data[i];

      if (!this.stations.has(info.id)) {
        const sx = Net.convert(parseFloat(info.lat)) - (20000 * 0.34);
        const sy = Net.convert(parseFloat(info.lon)) - (20000 * 0.06);
        const station = new Station({
          id: info.id,
          name: info.name,
          position: {
            x: sx,
            y: sy,
          },
        });

        this.stations.set(info.id, station);
      } else {
        console.log(`repeated! ${info.id}`);
      }
    }
  }

  /**
   * @returns {Map}
   */
  get stations() {
    return this._stations;
  }

  /**
   * @returns {Map}
   */
  get lines() {
    return this._lines;
  }

  /**
   * @param {Array} data
   * @private
   */
  _parseLine(data, color) {
    const line = new Line({
      id: data[0].line,
      name: data[0].line,
      color,
    });

    this.lines.set(line.id, line);

    let prevStation = null;

    for (let i = 0; i < data.length; i += 1) {
      const info = data[i];

      if (this.stations.has(info.id)) {
        const station = this.stations.get(info.id);

        if (prevStation) {
          const px = prevStation.position.x;
          const py = prevStation.position.y;
          const sx = station.position.x;
          const sy = station.position.y;
          const distanceBtwStations = MathUtils.distance(sx, sy, px, py);
          const numWayPoints = Math.floor(distanceBtwStations / 40);

          for (let j = 0; j < numWayPoints - 1; j += 1) {
            const percentage = (1 / numWayPoints) * (j + 1);
            const [x, y] = MathUtils.midpoint(px, py, sx, sy, percentage);
            const wpId = `${prevStation.id}-wp-${j}`;
            let wayPoint;
            
            if (!this._waypoints.has(wpId)) {
              wayPoint = new WayPoint({
                id: wpId,
                name: wpId,
                position: {
                  x,
                  y,
                },
              });

              this._waypoints.set(wpId, wayPoint);
            } else {
              wayPoint = this._waypoints.get(wpId);
            }
            line.addWayPoint(wayPoint);
          }
        }

        line.addWayPoint(station);
        prevStation = station;
      } else {
        throw new Error(`Can't parse, station not found ${info.id}`);
      }
    }
  }

  /**
   * @param {number} value
   * @returns {number}
   */
  static convert(value) {
    const integer = Math.floor(value);

    return Math.floor(((value - integer) * 20000));
  }
}
