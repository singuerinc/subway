export default class Line {
    constructor({ id, name, color }) {
        this._id = id;
        this._name = name;
        this._color = color;
        this._wayPoints = new Map();
    }

    /**
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._name;
    }
    /**
     * @returns {number}
     */
    get color() {
        return this._color;
    }

    /**
     * @returns {Map}
     */
    get wayPoints(){
        return this._wayPoints;
    }

    get onlyStations(){
        return Array.from(this.wayPoints).filter(wayPoint => wayPoint[1].type === 1).map((value) => value[1]);
    }

    addWayPoint(wayPoint) {
        this.wayPoints.set(wayPoint.id, wayPoint);
    }
}
