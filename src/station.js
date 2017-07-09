import Utils from "./utils";
import anime from "animejs";

export default class Station extends PIXI.Graphics {
    constructor({ id, position, dir, line, type }) {
        super();
        this.interactive = true;
        // console.log(`Station ${id} created.`);
        this._id = id;
        this._color = 0xFFFFFF;
        this.dir = dir;
        this.cargo = 0;
        this._currentTrain = null;
        this.x = position.x;
        this.y = position.y;

        this.interactive = true;
        this.buttonMode = true;

        this.graph = new PIXI.Graphics();
        this.addChild(this.graph);

        this.info = new PIXI.Graphics();
        this.addChild(this.info);

        this.infoNameText = new PIXI.Text(this._id, {
            fontSize: 22,
            fill: 0x111111
        });

        // this.infoNameText.visible = false;
        this.infoNameText.x = 50;
        this.infoNameText.y = -40;
        this.info.addChild(this.infoNameText);

        this.on('click', () => {
            this.info.visible = !this.info.visible;
        });

        setInterval(() => {
            const value = anime.random(1, 10);
            this.cargo += value;
        }, 2000);

        this.draw();
    }

    reserve(train) {
        if (this._currentTrain === null) {
            // console.log(`Train ${train._id} in entering in Station ${this._id}.`);
            this._currentTrain = train;
            this._color = 0xFFFF00;
            this.draw();
        }
        else {
            throw new Error("A train is in this station!");
        }
    }

    enter(train) {
        if (this._currentTrain === train) {
            // console.log(`Train ${train._id} in entering in Station ${this._id}.`);
            this._color = 0xFF0000;
            this.draw();
        }
        else {
            throw new Error("A train is in this station!");
        }
    }

    leave(train) {
        if (train === this._currentTrain) {
            // console.log(`Train ${train._id} in leaving Station ${this._id}.`);
            this._currentTrain = null;
            this._color = 0xFFFFFF;
            this.draw();
        }
    }

    getCurrentTrain() {
        return this._currentTrain;
    }

    hasTrain() {
        return this._currentTrain !== null;
    }

    set cargo(value) {
        this._cargo = value;
    }

    get cargo() {
        return this._cargo;
    }

    getTheCargo(maxCargo) {
        const cargo = Math.min(this.cargo, maxCargo);
        this.cargo = this.cargo - cargo;

        const duration = (25 * cargo);
        const anim = {
            __cargo: cargo
        };

        anime({
            targets: anim,
            easing: "linear",
            duration,
            __cargo: 0,
            round: 1,
            update: () => {
                this.draw(anim.__cargo);
            }
        });

        return cargo;
    }

    set parentStation(value){
        this._parentStation = value;
        const angle = Utils.angle(this.x, this.y, this._parentStation.x, this._parentStation.y);
        this.rotation = angle + (Math.PI / 2);
    }

    get parentStation() {
        return this._parentStation;
    }

    draw(cargo) {
        const c = cargo ? cargo : this.cargo;

        this.graph.clear();

        // cargo
        // this.info.lineStyle(0);
        // this.info.beginFill(0x00FF00, 0.4);
        // this.info.drawCircle(0, 0, 26 + (c * 0.1));
        for(var i=0; i<Math.floor(c/10); i++){
            this.info.lineStyle(0);
            this.info.beginFill(0x111111, 1);
            this.info.drawRect(50 + (i % 5 * 14), (-5) + (Math.floor(i / 5) * 14), 10, 10);
        }
        this.info.closePath();

        // station
        this.graph.lineStyle(8, 0x000000, 1);
        this.graph.beginFill(this._color, 1);
        this.graph.drawCircle(0, 0, 25);
        this.graph.endFill();


        this.graph.closePath();
    }
}
