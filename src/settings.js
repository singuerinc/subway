export default class Settings extends PIXI.Sprite {
  constructor() {
    super();

    const lines = new PIXI.Graphics();
    this.addChild(lines);

    lines.clear();
    for (let i = 0; i < 5; i += 1) {
      lines.beginFill(0xFFFFFF, 1);
      lines.drawRoundedRect(i * 20, 0, 12, 12, 3);
    }
    lines.endFill();
  }
}
