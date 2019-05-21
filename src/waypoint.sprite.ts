import k from "keymaster";
import { WayPoint } from "./units/waypoint";
import PIXI = require("pixi.js");

export class WayPointSprite extends PIXI.Graphics {
    private _model: WayPoint;
    private _color: number;

    constructor(model: WayPoint) {
        super();

        this._model = model;
        this._color = 0x000000;

        this._model.emitter.addListener("train:reserve", () => {
            this._color = 0xffff00;
            this._draw();
        });

        this._model.emitter.addListener("train:enter", () => {
            this._color = 0xff0000;
            this._draw();
        });

        this._model.emitter.addListener("train:leave", () => {
            this._color = 0x000000;
            this._draw();
        });

        this.x = this._model.position.x;
        this.y = this._model.position.y;

        this._draw();

        k("w", () => {
            this.visible = !this.visible;
        });
    }

    private _draw(): void {
        this.clear();
        this.beginFill(this._color, 0.5);
        this.drawCircle(0, 0, 4);
        this.endFill();
    }
}
