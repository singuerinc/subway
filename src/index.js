import Net from './units/net';
import RailWay from './railway';

//TODO: Train breaks
//FIXME: Error, wagons number is not the same as cargo, num of boxes are wrong

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
  // PIXI.Texture.fromImage('./img/dark-triangles.png'),
  // PIXI.Texture.fromImage('./img/footer_lodyas.png'),
  PIXI.Texture.fromImage('./img/pink dust.png'),
  // PIXI.Texture.fromImage('./img/squared_metal_@2X.png'),
  // PIXI.Texture.fromImage('./img/squared_metal_inv_@2X.png'),
  // PIXI.Texture.fromImage('./img/subtle_white_mini_waves.png'),
  renderer.width,
  renderer.height,
);

stage.addChild(bg);
stage.interactive = true;

const layers = new PIXI.Graphics();
const layerRailways = new PIXI.Graphics();

// layers.scale.set(0.5);
// layerRailways.rotation = -1;
// layerRailways.x = -600;
// layerRailways.y = 550;
// layerRailways.x = -3031;
// layerRailways.y = -3480;

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

const text = `
s   / stations
w   / waypoints
t   / trains
r   / rails
0-9 / lines`;

const info = new PIXI.Text(text, {
  fontSize: 10,
  fill: 0x1E1E1E,
});

info.x = 20;
info.y = 60;
stage.addChild(info);

const loop = () => {
  requestAnimationFrame(loop);
  renderer.render(stage);
};

const net = new Net();

net.lines.forEach((line) => {
  const rw = new RailWay({ id: line.id, line });

  layerRailways.addChild(rw);
});

net.trains.forEach((train) => {
  console.log(train);
  train.parkIn(train.itinerary.currentRoute, 0);
  train.run();

  layerTrains.addChild(train);

  console.log(train.id);
  if (train.id === '0') {
    train.openTrainInfo();
  }
});

loop();
