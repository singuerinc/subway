import * as k from 'keymaster';

export default class StationSprite extends PIXI.Graphics {
  constructor({ model, color }) {
    super();
    this._model = model;
    // this._model.emitter.addListener('train:reserve', () => this.draw());
    // this._model.emitter.addListener('train:enter', () => this.draw());
    // this._model.emitter.addListener('train:leave', () => this.draw());
    this._model.emitter.addListener('cargo:changed', cargo => this._draw(cargo));
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

    this.infoNameText = new PIXI.Text(this.id, {
      fontSize: 28,
      fill: 0x1E1E1E,
    });

    this.infoNameText.visible = false;
    this.infoNameText.x = 44;
    this.infoNameText.y = -14;
    this.info.addChild(this.infoNameText);

    this.on('click', () => {
      this.info.visible = !this.info.visible;
    });

    k('s', () => {
      this.visible = !this.visible;
    });

    this._draw();
  }

  /**
   * Set the nearest station connected to this station
   * @param {Station} value
   */
  // set parentStation(value) {
  //   this._parentStation = value;
  //   const angle = MathUtils.angle(this.x, this.y, this._parentStation.x, this._parentStation.y);
  //   this.rotation = (angle + (Math.PI / 2)) + Math.PI;
  // }

  /**
   * The nearest station connected to this station
   * @returns {Station}
   */
  get parentStation() {
    return this._parentStation;
  }

  _draw(cargo) {
    const c = cargo || this._model.cargo;

    this.infoNameText.text = `${this._model.name} / Cargo: ${c}`;

    // cargo
    this.info.clear();
    this.info.lineStyle(2, this._color, 0.5);
    // this.info.beginFill(0x111111, 0.4);
    this.info.drawCircle(0, 0, 26 + (c * 0.1));
    const num = Math.floor(c / 100);

    for (let i = 0; i < num; i += 1) {
      this.info.lineStyle(0);
      this.info.beginFill(0x111111, 1);
      this.info.drawRect(44 + (i % 5 * 14), 24 + (Math.floor(i / 5) * 14), 10, 10);
    }
    this.info.closePath();

    // station big
    this.graph.clear();
    this.graph.lineStyle(4, this._color, 1);
    this.graph.beginFill(0xFFFFFF, 1);
    this.graph.drawCircle(0, 0, 10);
    this.graph.endFill();
    this.graph.closePath();

    // station small
    // this.graph.clear();
    // this.graph.lineStyle(6, 0x1E1E1E, 0.4);
    // this.graph.beginFill(this._color, 0.1);
    // this.graph.drawCircle(0, 0, 32);
    this.graph.closePath();
  }
}
