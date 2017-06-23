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

const l1_stations = stationsJSON.data.metro.filter((station) => station.line === "L1");
//const l2_stations = stationsJSON.data.metro.filter((station) => station.line === "L2");

const list = new Map();

const convert = (v, c) => {
    const integer = Math.floor(v);
    return Math.floor(((v - integer) * 8000) - c);
};

l1_stations.forEach((station) => {
    list.set(station.id, { id: station.name, position: { x: convert(station.lat, 2700), y: convert(station.lon, 750) }, type: 1});
});

// list.set("catalunya-r", { id: "catalunya-r", position: { x: 10, y: 10 }, type: 1});
// list.set("catalunya-r-wp-1", {id: "catalunya-r-wp-1", position: {x: 15, y: 15}, type: 2});
// list.set("catalunya-r-wp-2", {id: "catalunya-r-wp-2", position: {x: 20, y: 20}, type: 2});
// list.set("arc-de-triomf-r", { id: "arc-de-triomf-r", position: { x: 25, y: 25 }, type: 1});
// list.set("arc-de-triomf-r-wp-1", { id: "arc-de-triomf-r-wp-1", position: { x: 30, y: 28 }, type: 2});
// list.set("marina-r", { id: "marina-r", position: { x: 35, y: 30 }, type: 1});
// list.set("marina-wp", { id: "marina-wp", position: { x: 35, y: 29 }, type: 2});
// list.set("marina-l", { id: "marina-l", position: { x: 36, y: 29 }, type: 1});
// list.set("arc-de-triomf-l", { id: "arc-de-triomf-l", position: { x: 26, y: 24 }, type: 1});
// list.set("catalunya-l", { id: "catalunya-l", position: { x: 11, y: 9 }, type: 1});

let red1, red2;
//let train1, train2, train3;

const setup = () => {
    //const colors = ["0xAAAAAAFF", "0x8888FF", "0x5555FF", "0x3333FF"];
    let stations = new Map();

    list.forEach((value, key) => {    
        if(value.type === 1){
            const station = new Station(value);
            stage.addChild(station);
            stations.set(key, station);
        } else if(value.type === 2){
            const waypoint = new WayPoint(value);
            stage.addChild(waypoint);
            stations.set(key, waypoint);
        }
    });

    // let railWay1Stations = l1_stations;
    //  new Map();
    // railWay1Stations.set("catalunya-r", stations.get("catalunya-r"));
    // railWay1Stations.set("arc-de-triomf-r", stations.get("arc-de-triomf-r"));
    // railWay1Stations.set("marina-r", stations.get("marina-r"));

    red1 = new RailWay("1", stations, "0xc92a2a");
    stage.addChildAt(red1, 0);

    // let railWay2Stations = new Map();
    // railWay2Stations.set("marina-l", stations.get("marina-l"));
    // railWay2Stations.set("arc-de-triomf-l", stations.get("arc-de-triomf-l"));
    // railWay2Stations.set("catalunya-l", stations.get("catalunya-l"));

    // red2 = new RailWay("2", railWay2Stations, "0x0055FF");
    // stage.addChild(red2);

    // let train1Stops = new Map();
    // train1Stops.set("catalunya-r", stations.get("catalunya-r"));
    // train1Stops.set("catalunya-r-wp-1", stations.get("catalunya-r-wp-1"));
    // train1Stops.set("catalunya-r-wp-2", stations.get("catalunya-r-wp-2"));
    // train1Stops.set("arc-de-triomf-r", stations.get("arc-de-triomf-r"));
    // train1Stops.set("arc-de-triomf-r-wp-1", stations.get("arc-de-triomf-r-wp-1"));
    // train1Stops.set("marina-r", stations.get("marina-r"));
    // train1Stops.set("marina-wp", stations.get("marina-wp"));
    // train1Stops.set("marina-l", stations.get("marina-l"));
    // train1Stops.set("arc-de-triomf-l", stations.get("arc-de-triomf-l"));
    // train1Stops.set("catalunya-l", stations.get("catalunya-l"));

    for(let i=0; i<14; i++){
        let train = new Train("T"+i, {
            stops: stations
        });
        train.run();
        stage.addChild(train);
    }   

    loop();
    //renderer.render(stage);
};

const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(stage);
};

setup();