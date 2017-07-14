import * as k from 'keymaster';
import Train from './train';
import MathUtils from './mathUtils';
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

        const stations = line.onlyStations;
        // for (let i = 0; i < stations.length; i += 1) {
        //     const model = stations[i];
        //     const station = new StationSprite(model);
        //     this.layerStations.addChild(station);
        // }

        this.layerTrains = new PIXI.Graphics();
        this.addChild(this.layerTrains);
        //
        this._stops = [];
        //
        let parentStation;

        for (var [key, wayPoint] of line.wayPoints.entries()) {
            if (wayPoint.type === 1) {
                console.log(wayPoint);
                const station = new StationSprite({model: wayPoint, color: line.color, dir: 1});

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
                const wp = new WayPointSprite({model: wayPoint, color: line.color, dir: 1});
                this.layerWayPoints.addChild(wp);
            }

            this._stops.push(wayPoint);
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
