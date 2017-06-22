import "pixi.js";
import RailWay from "./railway";
import Station from "./station";
import Train from "./train";
import Utils from "./utils";

var renderer = PIXI.autoDetectRenderer(512, 512, null, false, true);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
renderer.backgroundColor = 0x061639;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

const list = new Map();
list.set("catalunya-r", { id: "catalunya-r", position: { x: 10, y: 10 }});
list.set("arc-de-triomf-r", { id: "arc-de-triomf-r", position: { x: 25, y: 25 }});
list.set("marina-r", { id: "marina-r", position: { x: 35, y: 30 }});
list.set("marina-l", { id: "marina-l", position: { x: 36, y: 31 }});
list.set("arc-de-triomf-l", { id: "arc-de-triomf-l", position: { x: 26, y: 26 }});
list.set("catalunya-l", { id: "catalunya-l", position: { x: 11, y: 11 }});

let red1, red2;
let train1, train2;

const setup = () => {
    const colors = ["0xAAAAAAFF", "0x8888FF", "0x5555FF", "0x3333FF"];
    let stations = new Map();

    list.forEach((value, key) => {    
        const station = new Station(value);
        stage.addChild(station);

        stations.set(key, station);
    });

    let railWay1Stations = new Map();
    railWay1Stations.set("catalunya-r", stations.get("catalunya-r"));
    railWay1Stations.set("arc-de-triomf-r", stations.get("arc-de-triomf-r"));
    railWay1Stations.set("marina-r", stations.get("marina-r"));

    red1 = new RailWay("1", railWay1Stations, "0x0055FF");
    stage.addChild(red1);

    let railWay2Stations = new Map();
    railWay2Stations.set("marina-l", stations.get("marina-l"));
    railWay2Stations.set("arc-de-triomf-l", stations.get("arc-de-triomf-l"));
    railWay2Stations.set("catalunya-l", stations.get("catalunya-l"));

    red2 = new RailWay("2", railWay2Stations, "0x0055FF");
    stage.addChild(red2);

    let train1Stops = new Map();
    train1Stops.set("catalunya-r", stations.get("catalunya-r"));
    train1Stops.set("arc-de-triomf-r", stations.get("arc-de-triomf-r"));
    train1Stops.set("marina-r", stations.get("marina-r"));
    train1Stops.set("marina-l", stations.get("marina-l"));
    train1Stops.set("arc-de-triomf-l", stations.get("arc-de-triomf-l"));
    train1Stops.set("catalunya-l", stations.get("catalunya-l"));

    train1 = new Train("t1", {
        stops: train1Stops
    });
    train1.run();
    stage.addChild(train1);

    train2 = new Train("t2", {
        stops: train1Stops
    });
    train2.run();
    stage.addChild(train2);    

    loop();
    //renderer.render(stage);
};

const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(stage);
};

setup();