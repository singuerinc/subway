import RailWay from "./railway";
import StationSprite from "./station.sprite";
import Line from "./units/line";
import Net from "./units/net";
import PIXI = require("pixi.js");

class StationNameButton extends PIXI.Graphics {
    public nameVisible: boolean;

    constructor() {
        super();
    }
}

class CargoButton extends PIXI.Graphics {
    public cargoVisible: boolean;

    constructor() {
        super();
    }
}

class StationsButton extends PIXI.Graphics {
    public stationsVisible: boolean;

    constructor() {
        super();
    }
}

class LineButton extends PIXI.Graphics {
    public railway: PIXI.Graphics;

    constructor() {
        super();
    }
}

export default class Settings extends PIXI.Sprite {
    constructor({net, railways}: { net: Net, railways: PIXI.Graphics }) {
        super();

        const lines = new PIXI.Graphics();

        lines.x = 20;
        lines.y = 20;

        this.addChild(lines);

        lines.clear();
        let i = 0;

        net.lines.forEach((line: Line, key) => {
            const lineTextBtn = new PIXI.Text(line.name, {
                fill: 0x000000,
                fontSize: 10,
            });

            lineTextBtn.x = 4;
            lineTextBtn.y = 2;
            const lineBtn: LineButton = new LineButton();

            lineBtn.addChild(lineTextBtn);
            lineBtn.buttonMode = true;
            lineBtn.interactive = true;
            lineBtn.railway = railways.getChildAt(i) as PIXI.Graphics;
            lineBtn.on("click", () => {
                this.onOff(lineBtn, net, !lineBtn.railway.visible);
            });

            this.onOff(lineBtn, net, lineBtn.railway.visible);

            lineBtn.beginFill(line.color, 1);
            lineBtn.drawRect(0, 0, 26, 16);
            lineBtn.endFill();
            lineBtn.y = i * 20;
            lines.addChild(lineBtn);
            i += 1;
        });

        const stationsBtn: StationsButton = new StationsButton();
        const stationTextBtn: PIXI.Text = new PIXI.Text("STATIONS", {
            fill: 0x000000,
            fontSize: 10,
        });

        stationTextBtn.x = 4;
        stationTextBtn.y = 2;
        stationsBtn.beginFill(0x777777, 1);
        stationsBtn.drawRect(0, 0, 58, 16);
        stationsBtn.endFill();
        stationsBtn.x = 20;
        stationsBtn.y = lines.y + lines.height + 20;
        stationsBtn.buttonMode = true;
        stationsBtn.interactive = true;
        stationsBtn.addChild(stationTextBtn);
        stationsBtn.stationsVisible = true;
        stationsBtn.on("click", () => {
            stationsBtn.stationsVisible = !stationsBtn.stationsVisible;
            cargoBtn.visible = stationsBtn.stationsVisible;
            railways.children.forEach((railway: RailWay) => {
                railway.layerStations.visible = stationsBtn.stationsVisible;
            });
            stationsBtn.alpha = stationsBtn.stationsVisible ? 1 : 0.5;
        });
        this.addChild(stationsBtn);

        const cargoBtn: CargoButton = new CargoButton();
        const cargoTextBtn: PIXI.Text = new PIXI.Text("CARGO", {
            fill: 0x000000,
            fontSize: 10,
        });

        cargoTextBtn.x = 4;
        cargoTextBtn.y = 2;
        cargoBtn.beginFill(0x777777, 1);
        cargoBtn.drawRect(0, 0, 46, 16);
        cargoBtn.endFill();
        cargoBtn.x = 40;
        cargoBtn.y = stationsBtn.y + 18;
        cargoBtn.buttonMode = true;
        cargoBtn.interactive = true;
        cargoBtn.addChild(cargoTextBtn);
        cargoBtn.cargoVisible = true;
        cargoBtn.on("click", () => {
            cargoBtn.cargoVisible = !cargoBtn.cargoVisible;
            railways.children.forEach((railway: RailWay) => {
                railway.layerStations.children.forEach((station: StationSprite) => {
                    station.info.visible = cargoBtn.cargoVisible;
                });
            });
            cargoBtn.alpha = cargoBtn.cargoVisible ? 1 : 0.5;
        });
        this.addChild(cargoBtn);

        const stationNameBtn: StationNameButton = new StationNameButton();
        const stationNameTextBtn: PIXI.Text = new PIXI.Text("NAME", {
            fill: 0x000000,
            fontSize: 10,
        });

        stationNameTextBtn.x = 4;
        stationNameTextBtn.y = 2;
        stationNameBtn.beginFill(0x777777, 1);
        stationNameBtn.drawRect(0, 0, 46, 16);
        stationNameBtn.endFill();
        stationNameBtn.x = 40;
        stationNameBtn.y = cargoBtn.y + 18;
        stationNameBtn.buttonMode = true;
        stationNameBtn.interactive = true;
        stationNameBtn.addChild(stationNameTextBtn);
        stationNameBtn.nameVisible = false;
        stationNameBtn.alpha = 0.5;
        stationNameBtn.on("click", () => {
            stationNameBtn.nameVisible = !stationNameBtn.nameVisible;
            railways.children.forEach((railway: RailWay) => {
                railway.layerStations.children.forEach((station: StationSprite) => {
                    station.infoNameText.visible = stationNameBtn.nameVisible;
                });
            });
            stationNameBtn.alpha = stationNameBtn.nameVisible ? 1 : 0.5;
        });
        this.addChild(stationNameBtn);
    }

    private onOff(btn, net, show) {
        const railway = btn.railway;

        railway.visible = show;
        btn.alpha = railway.visible ? 1 : 0.2;

        const trainsInRailway = net.trains.reduce((acc, train) => {
            if (train.itinerary.routes[0].id === railway.id) {
                acc.push(train);
            }
            return acc;
        }, []);

        trainsInRailway.forEach((train) => {
            train.visible = railway.visible;
        });
    }
}
