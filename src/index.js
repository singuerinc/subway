import RailWay from "./railway";
import Station from "./station";
import Line from "./lines/Line";
import l1 from "./lines/l1.json";
import l2 from "./lines/l2.json";
import l3 from "./lines/l3.json";
import l4 from "./lines/l4.json";
import l5 from "./lines/l5.json";
import l9 from "./lines/l9.json";
import l10 from "./lines/l10.json";
import l11 from "./lines/l11.json";

(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})();

this.zoom = 0.5;
this.pX = -200;
this.pY = 400;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new PIXI.CanvasRenderer(512, 512, null, false, true, true, 2);
renderer.backgroundColor = 0x2D2D2D;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
const layerRailways = new PIXI.Container();
layerRailways.scale = new PIXI.Point(this.zoom, this.zoom);
layerRailways.x = this.pX;
layerRailways.y = this.pY;
layerRailways.rotation = 5.4;
stage.addChild(layerRailways);

const text = `
s   / stations
w   / waypoints
t   / trains
r   / rails
0-9 / lines`;
const info = new PIXI.Text(text, {
    fontFamily: "Inconsolata",
    fontSize: 14,
    fill: 0x1E1E1E
});
info.x = 20;
info.y = 60;
stage.addChild(info);

const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(stage);
};

const metroStations = [].concat(
    new Line("L1", l1).list,
    new Line("L2", l2).list,
    new Line("L3", l3).list,
    new Line("L4", l4).list,
    new Line("L5", l5).list,
    new Line("L9", l9).list,
    new Line("L10", l10).list,
    new Line("L11", l11).list,
);

const allStations = new Map();

const sX = 0.34;
const sY = 0.06;
const sS = 20000;
const convert = (value) => {
    const integer = Math.floor(value);
    return Math.floor(((value - integer) * sS));
};

metroStations.forEach((station) => {
    let lat = convert(station.lat);
    let lon = convert(station.lon);

    allStations.set(station.id, {
        line: station.line,
        id: station.name,
        dir: station.dir,
        position: { x: lat - (sS * sX), y: lon - (sS * sY) },
        type: 1
    });
});

let stations = new Map();

allStations.forEach((value, key, a) => {
    let arr;

    if (!stations.has(value.line)) {
        arr = [];
    }
    else {
        arr = stations.get(value.line);
    }

    if (value.type === 1) {
        const station = new Station(value);
        arr.push(station);
    }
    stations.set(value.line, arr);
});

const colors = new Map();
colors.set("L1", 0xFF2136);
colors.set("L2", 0xB22AA1);
colors.set("L3", 0x00C03A);
colors.set("L4", 0xFFB901);
colors.set("L5", 0x007BCD);
colors.set("L9", 0xFF8615);
colors.set("L10", 0x00B0F2);
colors.set("L11", 0x89D748);

let railWayIndex = 1;
stations.forEach((stationsInLine, key) => {
    const rw = new RailWay({id: key, stations: stationsInLine, color: colors.get(key), idx: railWayIndex++});
    layerRailways.addChildAt(rw, 0);
});

loop();
