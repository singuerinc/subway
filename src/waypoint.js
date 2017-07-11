import * as k from "keymaster";

export default class WayPoint extends PIXI.Graphics {
    constructor({ id, position, prevStop }) {
        super();
        this._id = id;
        this._currentTrain = null;
        this._color = 0xFFFFFF;
        this.x = position.x;
        this.y = position.y;

        this.prevStop = prevStop;

        this._render();

        k("w", () => {
            this.visible = !this.visible;
        });
    }

    reserve(train) {
        if (this.getCurrentTrain() === null) {
            this._currentTrain = train;
            this._color = 0xFFDC00;
            this._render();
        } else {
            throw new Error("A train is in this waypoint!");
        }
    }

    enter(train) {
        if (this.getCurrentTrain() === train) {
            this._color = 0xFF4136;
            this._render();
        } else {
            throw new Error("A train is in this waypoint!");
        }
    }

    leave(train) {
        if (train === this.getCurrentTrain()) {
            this._currentTrain = null;
            this._color = 0xFFFFFF;
            this._render();
        }
    }

    getCurrentTrain() {
        return this._currentTrain;
    }

    hasTrain() {
        return this._currentTrain !== null;
    }

    _render() {
        this.clear();
        this.beginFill(this._color, 0.5);
        this.drawCircle(0, 0, 4);
        this.endFill();
    }
}
