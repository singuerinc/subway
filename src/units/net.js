import MathUtils from '../mathUtils';
import Station from './station';
import WayPoint from './waypoint';
import Line from './line';
import Route from './route';
import Train from '../train';
import Itinerary from './itinerary';
import l1Data from '../lines/l1.json';
import l1rData from '../lines/l1-r.json';
import l2Data from '../lines/l2.json';
import l2rData from '../lines/l2-r.json';
import l3Data from '../lines/l3.json';
import l3rData from '../lines/l3-r.json';
import l4Data from '../lines/l4.json';
import l4rData from '../lines/l4-r.json';
import l5Data from '../lines/l5.json';
import l5rData from '../lines/l5-r.json';
import l9Data from '../lines/l9.json';
import l9rData from '../lines/l9-r.json';
import l10Data from '../lines/l10.json';
import l10rData from '../lines/l10-r.json';
import l11Data from '../lines/l11.json';
import l11rData from '../lines/l11-r.json';

export default class Net {
  constructor() {
    this._stations = new Map();
    this._waypoints = new Map();
    this._lines = new Map();
    this._routes = new Map();
    this._trains = [];

    const l1 = l1Data.concat(l1rData);
    const l2 = l2Data.concat(l2rData);
    const l3 = l3Data.concat(l3rData);
    const l4 = l4Data.concat(l4rData);
    const l5 = l5Data.concat(l5rData);
    const l9 = l9Data.concat(l9rData);
    const l10 = l10Data.concat(l10rData);
    const l11 = l11Data.concat(l11rData);

    this._parseWayPoints(l1);
    this._parseWayPoints(l2);
    this._parseWayPoints(l3);
    this._parseWayPoints(l4);
    this._parseWayPoints(l5);
    this._parseWayPoints(l9);
    this._parseWayPoints(l10);
    this._parseWayPoints(l11);

    const line1 = this._parseLine(l1, 0xFF2136);
    const line2 = this._parseLine(l2, 0xB22AA1);
    const line3 = this._parseLine(l3, 0x00C03A);
    const line4 = this._parseLine(l4, 0xFFB901);
    const line5 = this._parseLine(l5, 0x007BCD);
    const line9 = this._parseLine(l9, 0xFF8615);
    const line10 = this._parseLine(l10, 0x00B0F2);
    const line11 = this._parseLine(l11, 0x89D748);

    this.lines.set(line1.id, line1);
    this.lines.set(line2.id, line2);
    this.lines.set(line3.id, line3);
    this.lines.set(line4.id, line4);
    this.lines.set(line5.id, line5);
    this.lines.set(line9.id, line9);
    this.lines.set(line10.id, line10);
    this.lines.set(line11.id, line11);

    this._createRoutes([line1, line2, line3, line4, line5, line9, line10, line11]);

    const itineraries = [
      [this._routes.get('L1')],
      [this._routes.get('L2')],
      [this._routes.get('L3')],
      [this._routes.get('L4')],
      [this._routes.get('L5')],
      [this._routes.get('L9')],
      [this._routes.get('L10')],
      [this._routes.get('L11')],
    ];

    for (let j = 0; j < itineraries.length; j += 1) {
      const itineraryRoutes = itineraries[j];
      const numTrains = Math.floor(itineraryRoutes[0].size * 0.25);

      // console.log(numTrains);
      for (let i = 0; i < numTrains; i += 1) {
        const itinerary = new Itinerary({
          routes: itineraryRoutes,
        });

        itinerary.currentRoute = itinerary.getNextRoute();
        itinerary.currentWayPoint = itinerary.getNextWayPoint();

        this._addTrains(`${i}`, itinerary);
        // this._addTrains(line1.onlyStations.length / 2, itinerary, 0xFF2136);
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
    // return Math.floor(((value - integer) * 60000));
  }

  /**
   * @param {Array} data
   * @private
   */
  _parseWayPoints(data) {
    for (let i = 0; i < data.length; i += 1) {
      const info = data[i];

      if (!this.stations.has(info.id)) {
        const sx = Net.convert(parseFloat(info.lat)) - 6894;
        const sy = Net.convert(parseFloat(info.lon)) - 2053;
        // console.log(Net.convert(parseFloat(info.lat)), Net.convert(parseFloat(info.lon)));
        // const sx = Net.convert(parseFloat(info.lat)) - 13788;
        // const sy = Net.convert(parseFloat(info.lon)) - 3990;
        // console.log(sx, sy);
        // const sx = Net.convert(parseFloat(info.lat)) - 20682;
        // const sy = Net.convert(parseFloat(info.lon)) - 5986;

        const station = new Station({
          id: info.id,
          name: info.name,
          position: {
            x: sx,
            y: sy,
          },
        });

        this.stations.set(info.id, station);
      }
    }
  }

  /**
   * @param {String} id
   * @param {Object} config
   * @param {Itinerary} config.itinerary
   * @private
   */
  _addTrains(id, itinerary) {
    const train = new Train(id, {
      itinerary,
    });

    this._trains.push(train);
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
   * @returns {Array}
   */
  get trains() {
    return this._trains;
  }

  /**
   * @param {Array} data
   * @returns {Line}
   * @private
   */
  _parseLine(data, color, direction = 1) {
    const line = new Line({
      id: data[0].line,
      name: data[0].line,
      color,
      direction,
    });

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
          const numWayPoints = Math.floor(distanceBtwStations / 45);

          for (let j = 0; j < numWayPoints - 1; j += 1) {
            const percentage = (1 / numWayPoints) * (j + 1);
            const [x, y] = MathUtils.midpoint(px, py, sx, sy, percentage);
            const wpId = `${prevStation.id}-2-${station.id}-wp-${j}`;
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

    return line;
  }

  /**
   * @param {Array} lines
   * @private
   */
  _createRoutes(lines) {
    lines.forEach((line) => {
      const route = new Route({ id: line.id, color: line.color });

      for (const [, wayPoint] of line.wayPoints.entries()) {
        route.addWaypoint(wayPoint);
      }

      this._routes.set(route.id, route);
    });
  }
}
