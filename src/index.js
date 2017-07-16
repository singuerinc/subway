import Net from './units/net';
import RailWay from './railway';
import Settings from './settings';

// TODO: Train close info
// TODO: Train breaks
// TODO: Add ui to show/hide stuff
// TODO: Resize

// (function () {
//   const script = document.createElement('script');
//
//   script.onload = function () {
//     const stats = new Stats();
//
//     document.body.appendChild(stats.dom);
//     requestAnimationFrame(function loop() {
//       stats.update();
//       requestAnimationFrame(loop);
//     });
//   };
//   script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
//   document.head.appendChild(script);
// }());

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new PIXI.CanvasRenderer({
  autoResize: true,
  // antialias: true,
  resolution: 2,
  backgroundColor: 0x2D2D2D,
  roundPixels: true,
  width: window.innerWidth,
  height: window.innerHeight,
});

renderer.view.style.position = 'absolute';
renderer.view.style.display = 'block';
// renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
const bg = new PIXI.extras.TilingSprite(
  // PIXI.Texture.fromImage('./img/congruent_outline.png'),
  // PIXI.Texture.fromImage('./img/black_denim.png'),
  // PIXI.Texture.fromImage('./img/black_paper.png'),
  // PIXI.Texture.fromImage('./img/random_grey_variations.png'),
  // PIXI.Texture.fromImage('./img/footer_lodyas.png'),
  // PIXI.Texture.fromImage('./img/dust.png'),
  // PIXI.Texture.fromImage('./img/pink dust.png'),
  // PIXI.Texture.fromImage('./img/squared_metal_inv_@2X.png'),
  // PIXI.Texture.fromImage('./img/squared_metal_inv_@2X copy.png'),
  PIXI.Texture.fromImage('./img/subtle_white_mini_waves.png'),
  renderer.width,
  renderer.height,
);

bg.alpha = 0.3;
stage.addChild(bg);
stage.interactive = true;

const layers = new PIXI.Graphics();

layers.x = -100;
layers.y = -300;
const layerRailways = new PIXI.Graphics();

layers.scale.set(0.5);

function onDragEnd() {
  layers.dragging = false;
}

layers.interactive = true;
layers
  .on('pointerdown', () => {
    layers.dragging = true;
  })
  .on('pointerup', onDragEnd)
  .on('pointerupoutside', onDragEnd)
  .on('pointermove', (e) => {
    if (layers.dragging) {
      layers.x += e.data.originalEvent.movementX;
      layers.y += e.data.originalEvent.movementY;
    }
  });

// layerRailways.rotation = 5.4;
stage.addChild(layers);
layers.addChild(layerRailways);

const layerTrains = new PIXI.Graphics();

layers.addChild(layerTrains);

const title = new PIXI.Text('bcn subway', {
  fontSize: 18,
  fill: 0x9E9E9E,
  align: 'right',
});

title.x = window.innerWidth - (title.width + 20);
title.y = 20;
stage.addChild(title);

const brand = new PIXI.Text('@singuerinc', {
  fontSize: 16,
  fill: 0x3E3E3E,
  align: 'right',
});

brand.interactive = true;
brand.buttonMode = true;
brand.x = window.innerWidth - (brand.width + 20);
brand.y = window.innerHeight - (brand.height + 20);
brand.on('click', () => {
  document.location.href = 'https://www.singuerinc.com/';
});
stage.addChild(brand);

const loop = () => {
  requestAnimationFrame(loop);
  renderer.render(stage);
};

const net = new Net();

net.lines.forEach((line) => {
  const rw = new RailWay({ id: line.id, line });

  if (line.id !== 'L1' && line.id !== 'L5' && line.id !== 'L9') {
    rw.visible = false;
  }

  layerRailways.addChild(rw);
});

net.trains.forEach((train, index) => {
  const randomRouteIndex = Math.floor(Math.random() * train.itinerary.routes.length);
  const route = train.itinerary.routes[randomRouteIndex];

  train.itinerary.currentRoute = route;

  const randomIndex = Math.floor(Math.random() * train.itinerary.currentRoute.size);

  train.parkIn(route, randomIndex);
  train.run();

  layerTrains.addChild(train);

  if (index === 0) {
    train.openTrainInfo();
  }
});

const settings = new Settings({ net, railways: layerRailways });

stage.addChild(settings);

loop();
