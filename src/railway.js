export default class RailWay extends PIXI.Graphics {
    constructor(id, stations, color) {
        super();
        // console.log(`RailWay ${id} created ${stations.size}.`);
        this._id = id;
        this._color = color;

        let parentStation;
        stations.forEach((station) => {
            if (typeof parentStation !== "undefined") {
                this.lineStyle(10, this._color, 1);
                this.moveTo(parentStation.x, parentStation.y);
                this.lineTo(station.x, station.y);
            }
            parentStation = station;
        }, this);
    }
}
