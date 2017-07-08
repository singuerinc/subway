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

const guiEl = document.getElementById('gui');
console.log(guiEl);
global.gui = new dat.GUI({ autoPlace: false });
guiEl.appendChild(gui.domElement);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

var renderer = new PIXI.CanvasRenderer(512, 512, null, false, true, true, 2);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
//renderer.backgroundColor = 0x061639;
renderer.backgroundColor = 0x212529;
//renderer.backgroundColor = 0xFFFFFF;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(stage);
};

// const metroStations = l3;// [].concat(l1, l2, l3, l4, l5, l9, l10, l11);
const metroStations = [].concat(
    // new Line("L1", l1).list,
    // new Line("L2", l2).list,
    new Line("L3", l3).list,
    // new Line("L4", l4).list,
    // new Line("L5", l5).list,
    // new Line("L9", l9).list,
    // new Line("L10", l10).list,
    // new Line("L11", l11).list,
);

const allStations = new Map();

const convert = (v, c) => {
    const integer = Math.floor(v);
    return Math.floor(((v - integer) * 8000) - c);
};

metroStations.forEach((station) => {
    allStations.set(station.id, {
        line: station.line,
        id: station.name,
        dir: station.dir,
        position: { x: convert(station.lat, 2700), y: convert(station.lon, 750) },
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
        // stage.addChild(station);
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
    stage.addChildAt(rw, 0);
});

loop();
