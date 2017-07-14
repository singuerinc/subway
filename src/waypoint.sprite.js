import * as k from 'keymaster';

export default class WayPointSprite extends PIXI.Graphics {
  constructor({ model, color }) {
    super();

    this._model = model;
    this._color = color;

    this._model.emitter.addListener('train:reserve', () => {
      this._color = 0xFFFF00;
      this._draw();
    });

    this._model.emitter.addListener('train:enter', () => {
      this._color = 0xFF0000;
      this._draw();
    });

    this._model.emitter.addListener('train:leave', () => {
      this._color = color;
      this._draw();
    });

    this.x = this._model.position.x;
    this.y = this._model.position.y;

    this._draw();

    k('w', () => {
      this.visible = !this.visible;
    });
  }

  _draw() {
    this.clear();
    this.beginFill(this._color, 1);
    this.drawCircle(0, 0, 4);
    this.endFill();
  }
}
