import Utils from "./utils";

export default class WayPoint extends PIXI.Graphics {
    constructor({id, position}) {
        super();
        // console.log(`WayPoint ${id} created.`);
        this._id = id;
        this._currentTrain = null;
        this._color = 0x666666;

        this.x = position.x;
        this.y = position.y;

        this._render();
    }

    reserve(train){
        if(this._currentTrain === null){
            console.log(`Train ${train._id} in reserving Waypoint ${this._id}.`);
            this._currentTrain = train;
            this._color = 0xFF8800;
            this._render();
        } else {
            throw new Error("A train is in this waypoint!");
        }
    }

    enter(train){
        if(this._currentTrain === train){
            console.log(`Train ${train._id} in entering in Waypoint ${this._id}.`);
            this._currentTrain = train;
            this._color = 0xFF0000;
            this._render();
        } else {
            throw new Error("A train is in this waypoint!");
        }
    }

    leave(train){
        if(train === this._currentTrain){
            // console.log(`Train ${train._id} in leaving the Waypoint ${this._id}.`);
            this._currentTrain = null;
            this._color = 0x666666;
            this._render();
        }
    }

    getCurrentTrain(){
        return this._currentTrain;
    }

    hasTrain(){
        return this._currentTrain !== null;
    }

    _render() {
        this.beginFill(this._color);
        this.drawCircle(0, 0, 3);
        this.endFill();
    }
}
