import Utils from "./utils";

export default class Station extends PIXI.Graphics {
    constructor({ id, position, dir, line, type }) {
        super();
        this.interactive = true;
        // console.log(`Station ${id} created.`);
        this._id = id;
        this._color = 0xFFFFFF;
        this.dir = dir;
        this._cargo = 0;
        this._currentTrain = null;

        // this.x = Utils.convert(position.x);
        // this.y = Utils.convert(position.y);

        this.x = position.x;
        this.y = position.y;

        this.interactive = true;
        this.buttonMode = true;

        this.infoNameText = new PIXI.Text(this._id, {
            fontFamily: 'Nunito-ExtraLight',
            fontSize: 18,
            fill: 0xffffff,
            align: 'left'
        });
        this.infoNameText.visible = false;
        this.infoNameText.x = 20;
        this.infoNameText.y = -10;
        this.addChild(this.infoNameText);

        this.on('click', () => {
            this.infoNameText.visible = !this.infoNameText.visible;
        });

        setInterval(() => {
            this.addCargo(Math.floor(Math.random() * 10));
        }, 2000);

        this._render();
    }

    reserve(train) {
        if (this._currentTrain === null) {
            // console.log(`Train ${train._id} in entering in Station ${this._id}.`);
            this._currentTrain = train;
            this._color = 0xFFFF00;
            this._render();
        }
        else {
            throw new Error("A train is in this station!");
        }
    }

    enter(train) {
        if (this._currentTrain === train) {
            // console.log(`Train ${train._id} in entering in Station ${this._id}.`);
            this._color = 0xFF0000;
            this._render();
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
            this._render();
        }
    }

    getCurrentTrain() {
        return this._currentTrain;
    }

    hasTrain() {
        return this._currentTrain !== null;
    }

    get waitingCargo() {
        return this._cargo;
    }

    getTheCargo() {
        const cargo = this._cargo;
        this._cargo = 0;
        this._render();
        return cargo;
    }

    addCargo(value) {
        this._cargo += value;
        this._render();
    }

    _render() {
        this.clear();
        // this.lineStyle(1, "0xFFFFFF", 0.5);
        this.beginFill(0xFF0000, 0.1);
        this.drawCircle(0, 0, 10 + (this._cargo * 0.1));
        this.lineStyle(4, 0x222222, 1);
        this.beginFill(this._color, 1);
        this.drawCircle(0, 0, 10);
        this.endFill();
        this.infoNameText.text = `${this._id} → ${this._cargo}`;
        // this.cargoText.x = this._cargo;
        // this.cargoText.y = this._cargo;
    }
}
