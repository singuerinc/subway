import MathUtils from '../mathUtils';
import Station from './station';
import WayPoint from './waypoint';
import Line from './line';
import Route from './route';
import Train from '../train';
import Itinerary from './itinerary';
import l1 from '../lines/l1.json';
import l1r from '../lines/l1-r.json';
import l2 from '../lines/l2.json';
import l2r from '../lines/l2-r.json';
import l3 from '../lines/l3.json';
import l3r from '../lines/l3-r.json';
import l4 from '../lines/l4.json';
import l4r from '../lines/l4-r.json';
import l5 from '../lines/l5.json';
import l5r from '../lines/l5-r.json';
import l9 from '../lines/l9.json';
import l9r from '../lines/l9-r.json';
import l10 from '../lines/l10.json';
import l10r from '../lines/l10-r.json';
import l11 from '../lines/l11.json';
import l11r from '../lines/l11-r.json';

export default class Net {
  constructor() {
    this._stations = new Map();
    this._waypoints = new Map();
    this._lines = new Map();
    this._routes = new Map();
    this._trains = [];

    this._parseWayPoints(l1);
    this._parseWayPoints(l1r);
    this._parseWayPoints(l2);
    this._parseWayPoints(l2r);
    this._parseWayPoints(l3);
    this._parseWayPoints(l3r);
    this._parseWayPoints(l4);
    this._parseWayPoints(l4r);
    this._parseWayPoints(l5);
    this._parseWayPoints(l5r);
    this._parseWayPoints(l9);
    this._parseWayPoints(l9r);
    this._parseWayPoints(l10);
    this._parseWayPoints(l10r);
    this._parseWayPoints(l11);
    this._parseWayPoints(l11r);

    const line1 = this._parseLine(l1, 0xFF2136);
    const line1r = this._parseLine(l1r, 0xFF2136, -1);
    const line2 = this._parseLine(l2, 0xB22AA1);
    const line2r = this._parseLine(l2r, 0xB22AA1, -1);
    const line3 = this._parseLine(l3, 0x00C03A);
    const line3r = this._parseLine(l3r, 0x00C03A, -1);
    const line4 = this._parseLine(l4, 0xFFB901);
    const line4r = this._parseLine(l4r, 0xFFB901, -1);
    const line5 = this._parseLine(l5, 0x007BCD);
    const line5r = this._parseLine(l5r, 0x007BCD, -1);
    const line9 = this._parseLine(l9, 0xFF8615);
    const line9r = this._parseLine(l9r, 0xFF8615, -1);
    const line10 = this._parseLine(l10, 0x00B0F2);
    const line10r = this._parseLine(l10r, 0x00B0F2, -1);
    const line11 = this._parseLine(l11, 0x89D748);
    const line11r = this._parseLine(l11r, 0x89D748, -1);

    this.lines.set(line1.id, line1);
    this.lines.set(line1r.id, line1r);
    this.lines.set(line2.id, line2);
    this.lines.set(line2r.id, line2r);
    this.lines.set(line3.id, line3);
    this.lines.set(line3r.id, line3r);
    this.lines.set(line4.id, line4);
    this.lines.set(line5.id, line5);
    this.lines.set(line9.id, line9);
    this.lines.set(line9r.id, line9r);
    this.lines.set(line10.id, line10);
    this.lines.set(line10r.id, line10r);
    this.lines.set(line11.id, line11);
    this.lines.set(line11r.id, line11r);

    this._createRoutes([line1, line1r, line2, line2r, line3, line3r, line4, line4r, line5, line5r, line9, line9r, line10, line10r, line11, line11r]);

    const itineraries = [
      [this._routes.get('L1'), this._routes.get('L1r')],
      [this._routes.get('L2'), this._routes.get('L2r')],
      [this._routes.get('L3'), this._routes.get('L3r')],
      [this._routes.get('L4'), this._routes.get('L4r')],
      [this._routes.get('L5'), this._routes.get('L5r')],
      [this._routes.get('L9'), this._routes.get('L9r')],
      [this._routes.get('L10'), this._routes.get('L10r')],
      [this._routes.get('L11'), this._routes.get('L11r')],
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
