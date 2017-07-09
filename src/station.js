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

        // setInterval(() => {
        //     const value = anime.random(1, 10);
        //     this.cargo += value;
        // }, 2000);

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

    draw(cargo) {
        const c = cargo ? cargo : this.cargo;
        this.clear();
        this.lineStyle(1, 0x00FF00, 0.5);
        this.beginFill(0x00FF00, 0.1);
        this.drawCircle(0, 0, 26 + (c * 0.1));
        this.lineStyle(8, 0x000000, 1);
        this.beginFill(this._color, 1);
        this.drawCircle(0, 0, 25);
        this.endFill();
        this.closePath();
        this.infoNameText.text = `${this._id} → ${c}`;
    }
}
