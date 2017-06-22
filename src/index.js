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
list.set("catalunya", { id: "catalunya", position: { x: 10, y: 10 }});
list.set("arc-de-triomf", { id: "arc-de-triomf", position: { x: 25, y: 25 }});
list.set("marina", { id: "marina", position: { x: 35, y: 30 }});

let stations;
let red;
let train;

const setup = () => {
    const colors = ["0xAAAAAAFF", "0x8888FF", "0x5555FF", "0x3333FF"];
    let stations = new Map();
    
    list.forEach((value, key) => {    
        const station = new Station(value);
        stage.addChild(station);

        stations.set(key, station);
    });

    red = new RailWay("1", stations, "0x0055FF");
    // red.start();

    // train = new Train("t1", {
    //     stops: stations
    // });
    // train.run();
    // stage.addChild(train);

    stage.addChild(red);
    
    loop();
    //renderer.render(stage);
};

const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(stage);
};

setup();