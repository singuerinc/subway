import RailWay from "./railway";
import Station from "./station";
import WayPoint from "./waypoint";
import Train from "./train";
import Utils from "./utils";
import stationsJSON from "./stations.json";

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

const l1_stations = stationsJSON.data.metro; //.filter((station) => station.line === "L1");

const allStations = new Map();

const convert = (v, c) => {
    const integer = Math.floor(v);
    return Math.floor(((v - integer) * 8000) - c);
};

l1_stations.forEach((station) => {
    allStations.set(station.id, { line: station.line, id: station.name, position: { x: convert(station.lat, 2700), y: convert(station.lon, 750) }, type: 1 });
});

let red1, red2;

let stations = new Map();

allStations.forEach((value, key) => {
    // if (value.type === 1) {
        let arr;
        if(!stations.has(value.line)){
            arr = [];
        } else {
            arr = stations.get(value.line);
        }

        const station = new Station(value);
        stage.addChild(station);
        arr.push(station);
    // } else if (value.type === 2) {
        // const waypoint = new WayPoint(value);
        // stage.addChild(waypoint);
        //stations.set(key, waypoint);
    // }
    stations.set(value.line, arr);
});

const colors = new Map();
colors.set("L1", 0xFF0000);
colors.set("L2", 0x0000FF);
colors.set("L3", 0x00FF00);
colors.set("L4", 0xFFFF00);
colors.set("L5", 0xFF5533);
colors.set("L11", 0x555500);
colors.set("TRAMVIA BLAU", 0x00FFCC);

stations.forEach((stationsInLine, key) => {
    const rw = new RailWay("1", stationsInLine, colors.get(key));
    stage.addChildAt(rw, 0);

    for (let i = 0; i < 2; i++) {
        const train = new Train(`${key}-T${i}`, {
            stops: stationsInLine
        });
        train.run();
        stage.addChild(train);
    }
});




loop();