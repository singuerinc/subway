import Net from './units/net';
import RailWay from './railway';

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

const net = new Net();
net.lines.forEach((line, key, map) => {
    const rw = new RailWay({ id: line.id, line });
    layerRailways.addChildAt(rw, 0);
});

loop();
