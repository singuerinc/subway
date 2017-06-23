import "pixi.js";
import Utils from "./utils";

export default class WayPoint extends PIXI.Graphics {
    constructor({id, position}) {
        super();
        console.log(`WayPoint ${id} created.`);
        this._id = id;
        this._currentTrain = null;

        this.x = Utils.convert(position.x);
        this.y = Utils.convert(position.y);

        this._render();
    }

    enter(train){
        if(this._currentTrain === null){
            // console.log(`Train ${train._id} in entering in Waypoint ${this._id}.`);
            this._currentTrain = train;
        } else {
            throw new Error("A train is in this waypoint!");
        }
        this._render();
    }

    leave(train){
        if(train === this._currentTrain){
            // console.log(`Train ${train._id} in leaving the Waypoint ${this._id}.`);
            this._currentTrain = null;
        }
        this._render();
    }

    getCurrentTrain(){
        return this._currentTrain;
    }

    hasTrain(){
        return this._currentTrain !== null;
    }

    _render() {
        this.beginFill(this.hasTrain() ? "0xFF0000": "0x00FF00");
        this.drawCircle(0, 0, 3);
        this.endFill();
    }
}
