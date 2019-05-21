import MathUtils from "./mathUtils";
import { Station } from "./units/station";
import PIXI = require("pixi.js");

export class StationSprite extends PIXI.Graphics {
    private _color: number;
    private _model: Station;
    public infoNameText: PIXI.Text;
    public info: PIXI.Graphics;
    private graph: PIXI.Graphics;
    private cargoText: PIXI.Text;

    constructor(model: Station, color: number) {
        super();
        this._model = model;
        // this._model.emitter.addListener('train:reserve', () => this.draw());
        // this._model.emitter.addListener('train:enter', () => this.draw());
        // this._model.emitter.addListener('train:leave', () => this.draw());
        this._model.emitter.addListener("cargo:changed", cargo =>
            this._draw(cargo)
        );
        this._color = color;
        this.x = this._model.position.x;
        this.y = this._model.position.y;
        // this.visible = false;
        this.interactive = true;
        this.buttonMode = true;

        this.graph = new PIXI.Graphics();
        this.addChild(this.graph);

        this.info = new PIXI.Graphics();
        this.addChild(this.info);

        this.cargoText = new PIXI.Text("", {
            fill: this._color,
            fontSize: 18
        });
        this.cargoText.alpha = 0.7;
        this.cargoText.x = -88;
        this.cargoText.y = -6;
        this.info.addChild(this.cargoText);

        this.infoNameText = new PIXI.Text(this._model.name, {
            fill: 0x111111,
            fontSize: 16,
            fontWeight: "bold"
        });

        this.infoNameText.visible = false;
        this.infoNameText.x = 44;
        this.infoNameText.y = -14;
        this.addChild(this.infoNameText);

        this.on("click", () => {
            this.info.visible = !this.info.visible;
        });

        this._draw(this._model.cargo);
    }

    set parentStation(value: Station) {
        const angle = MathUtils.angle(
            this.x,
            this.y,
            value.position.x,
            value.position.y
        );

        this.rotation = angle + Math.PI * 0.5 + Math.PI;
    }

    private _draw(cargo: number): void {
        const c = cargo || this._model.cargo;

        this.cargoText.text = `${c}`;

        // cargo
        this.info.clear();
        this.info.lineStyle(0);
        this.info.beginFill(this._color, 0.1);
        this.info.drawRoundedRect(
            -96,
            -12,
            12 + this.cargoText.text.length * 12,
            32,
            3
        );

        // cargo balls
        // const num = Math.floor(c / 100);
        //
        // for (let i = 0; i < num; i += 1) {
        //   this.info.lineStyle(0);
        //   this.info.beginFill(0x666666, 1);
        //   this.info.drawCircle(44 + (i % 5 * 14), Math.floor(i / 5) * 14, 5);
        // }
        // this.info.closePath();

        // station big
        this.graph.clear();
        this.graph.beginFill(this._color, 0.05);
        this.graph.drawCircle(0, 0, 32);
        this.graph.lineStyle(4, this._color, 1);
        this.graph.beginFill(0xffffff, 1);
        this.graph.drawCircle(0, 0, 14);
        this.graph.endFill();
        // this.graph.closePath();

        // station small
        // this.graph.clear();
        // this.graph.lineStyle(6, 0x1E1E1E, 0.4);
        // this.graph.beginFill(this._color, 0.1);
        // this.graph.drawCircle(0, 0, 32);
        // this.graph.closePath();
    }
}
