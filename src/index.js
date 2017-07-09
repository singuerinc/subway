import RailWay from "./railway";
import Station from "./station";
import Train from "./train";
import Line from "./lines/Line";
import l1 from "./lines/l1.json";
import l2 from "./lines/l2.json";
import l3 from "./lines/l3.json";
import l4 from "./lines/l4.json";
import l5 from "./lines/l5.json";
import l9 from "./lines/l9.json";
import l10 from "./lines/l10.json";
import l11 from "./lines/l11.json";

this.zoom = 0.4;
this.pX = 100;
this.pY = -500;


const guiEl = document.getElementById('gui');
console.log(guiEl);
global.gui = new dat.GUI({ autoPlace: false });
guiEl.appendChild(gui.domElement);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

var renderer = new PIXI.CanvasRenderer(512, 512, null, false, true, true, 2);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
const layerRailways = new PIXI.Container();
layerRailways.scale = new PIXI.Point(this.zoom, this.zoom);
layerRailways.x = this.pX;
layerRailways.y = this.pY;
stage.addChild(layerRailways);

const zoom = global.gui.add(this, 'zoom', 0, 2);
const pX = global.gui.add(this, 'pX', -500, 500);
const pY = global.gui.add(this, 'pY', -2000, 2000);

zoom.onChange((value) => {
    layerRailways.scale = new PIXI.Point(value, value);
});

pX.onChange((value) => {
    layerRailways.x = value * this.zoom;
});

pY.onChange((value) => {
    layerRailways.y = value * this.zoom;
});

renderer.backgroundColor = 0x212529;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(stage);
};

const metroStations = [].concat(
    // new Line("L1", l1).list,
    // new Line("L2", l2).list,
    new Line("L3", l3).list,
    // new Line("L4", l4).list,
    new Line("L5", l5).list,
    new Line("L9", l9).list,
    // new Line("L10", l10).list,
    // new Line("L11", l11).list,
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
