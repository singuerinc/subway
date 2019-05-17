import RailWay from "./railway";
import Settings from "./settings";
import Train from "./train";
import Net from "./units/net";
import PIXI = require("pixi.js");

// TODO: Train acceleration
// TODO: Train close info
// TODO: Train breaks
// TODO: Add ui to show/hide stuff
// TODO: Resize

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new PIXI.CanvasRenderer({
    autoResize: true,
    backgroundColor: 0x2d2d2d,
    height: window.innerHeight,
    resolution: 2,
    roundPixels: true,
    width: window.innerWidth
});

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

window.addEventListener("resize", () => {
    renderer.resize(window.innerWidth, window.innerHeight);
});

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
    PIXI.Texture.fromImage("./img/subtle_white_mini_waves.png"),
    renderer.width,
    renderer.height
);

bg.alpha = 0.3;
stage.addChild(bg);
stage.interactive = true;

const layers = new PIXI.Graphics();

layers.x = -100;
layers.y = -300;
const layerRailways = new PIXI.Graphics();

layers.scale.set(0.5);

let dragging = false;

function onDragEnd() {
    dragging = false;
}

layers.interactive = true;
layers
    .on("pointerdown", () => {
        dragging = true;
    })
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd)
    .on("pointermove", e => {
        if (dragging) {
            layers.x += e.data.originalEvent.movementX;
            layers.y += e.data.originalEvent.movementY;
        }
    });

// layerRailways.rotation = 5.4;
stage.addChild(layers);
layers.addChild(layerRailways);

const layerTrains = new PIXI.Graphics();

layers.addChild(layerTrains);

const title = new PIXI.Text("bcn subway", {
    align: "right",
    fill: 0x9e9e9e,
    fontSize: 18
});

title.x = window.innerWidth - (title.width + 20);
title.y = 20;
stage.addChild(title);

const brand = new PIXI.Text("@singuerinc", {
    align: "right",
    fill: 0x3e3e3e,
    fontSize: 16
});

brand.interactive = true;
brand.buttonMode = true;
brand.x = window.innerWidth - (brand.width + 20);
brand.y = window.innerHeight - (brand.height + 20);
brand.on("click", () => {
    document.location.href = "https://www.singuerinc.com/";
});
stage.addChild(brand);

const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(stage);
};

const net = new Net();

net.lines.forEach(line => {
    const rw = new RailWay({ id: line.id, line });

    if (line.id !== "L1" && line.id !== "L5" && line.id !== "L9") {
        rw.visible = false;
    }

    layerRailways.addChild(rw);
});

net.trains.forEach((train: Train) => {
    const randomRouteIndex = Math.floor(
        Math.random() * train.itinerary.routes.length
    );
    const route = train.itinerary.routes[randomRouteIndex];

    train.itinerary.currentRoute = route;

    const randomIndex = Math.floor(
        Math.random() * train.itinerary.currentRoute.size
    );

    train.parkIn(route, randomIndex);
    train.run();

    layerTrains.addChild(train);

    // if (index === 0) {
    //   train.openTrainInfo();
    // }
});

const settings = new Settings({ net, railways: layerRailways });

stage.addChild(settings);

loop();
