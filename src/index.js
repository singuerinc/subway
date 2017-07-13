import RailWay from './railway';
import Line from './lines/Line';
import l1 from './lines/l1.json';
import l2 from './lines/l2.json';
import l3 from './lines/l3.json';
import l4 from './lines/l4.json';
import l5 from './lines/l5.json';
import l9 from './lines/l9.json';
import l10 from './lines/l10.json';
import l11 from './lines/l11.json';

(function () {
  const script = document.createElement('script');
  script.onload = function () {
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
  document.head.appendChild(script);
}());

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

const renderer = new PIXI.CanvasRenderer({
  autoResize: true,
  antialias: true,
  resolution: 2,
  backgroundColor: 0x2D2D2D,
  roundPixels: true,
});
renderer.view.style.position = 'absolute';
renderer.view.style.display = 'block';
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
const layerRailways = new PIXI.Container();
layerRailways.scale = new PIXI.Point(0.5, 0.5);
layerRailways.x = -200;
layerRailways.y = 400;
layerRailways.rotation = 5.4;
stage.addChild(layerRailways);

const text = `
s   / stations
w   / waypoints
t   / trains
r   / rails
0-9 / lines`;
const info = new PIXI.Text(text, {
  fontSize: 14,
  fill: 0x1E1E1E,
});
info.x = 20;
info.y = 60;
stage.addChild(info);

const loop = () => {
  requestAnimationFrame(loop);
  renderer.render(stage);
};

const lines = [
  // new Line('L1', 0xFF2136, l1),
  // new Line('L2', 0xB22AA1, l2),
  // new Line('L3', 0x00C03A, l3),
  // new Line('L4', 0xFFB901, l4),
  // new Line('L5', 0x007BCD, l5),
  new Line('L9', 0xFF8615, l9),
  new Line('L10', 0x00B0F2, l10),
  // new Line('L11', 0x89D748, l11),
];

lines.forEach((line, idx) => {
  const rw = new RailWay({ id: line.id, line, idx });
  layerRailways.addChildAt(rw, 0);
});

loop();
