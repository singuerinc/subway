import Utils from "./utils";

export default class Station extends PIXI.Graphics {
    constructor({id, position}) {
        super();
        // console.log(`Station ${id} created.`);
        this._id = id;
        this._color = "0xFF0000";
        this._cargo = 0;
        this._currentTrain = null;

        // this.x = Utils.convert(position.x);
        // this.y = Utils.convert(position.y);

        this.x = position.x;
        this.y = position.y;

        this.nameText = new PIXI.Text(this._id,{fontFamily : 'HelveticaNeue', fontSize: 16, fill : 0xadb5bd, align : 'left'});
        this.nameText.x = 20;
        this.nameText.y = -10;
        this.addChild(this.nameText);

        this._render();

        // this.cargoText = new PIXI.Text("",{fontFamily : 'HelveticaNeue', fontSize: 12, fill : 0xffffff, align : 'left'});
        // this.addChild(this.cargoText);

        setInterval(() =>  {
            this.addCargo(Math.floor(Math.random() * 10));
        }, 2000);
    }

    enter(train){
        if(this._currentTrain === null){
            // console.log(`Train ${train._id} in entering in Station ${this._id}.`);
            this._currentTrain = train;
        } else {
            throw new Error("A train is in this station!");
        }
    }

    leave(train){
        if(train === this._currentTrain){
            // console.log(`Train ${train._id} in leaving Station ${this._id}.`);
            this._currentTrain = null;
        }
    }

    getCurrentTrain(){
        return this._currentTrain;
    }

    hasTrain(){
        return this._currentTrain !== null;
    }

    getTheCargo(){
        const cargo = this._cargo;
        this._cargo = 0;
        this._render();
        return cargo;
    }

    addCargo(value){
        this._cargo += value;
        this._render();
    }

    _render(){
        this.clear();
        //this.lineStyle(1, "0xFFFFFF", 0.5);
        this.beginFill("0x000000", 0.1);
        this.drawCircle(0, 0, 10 + this._cargo);
        this.lineStyle(3, "0x000000", 1);
        this.beginFill("0xFFFFFF", 1);
        this.drawCircle(0, 0, 10);
        this.endFill();
        // this.cargoText.x = this._cargo;
        // this.cargoText.y = this._cargo;
        // this.cargoText.text = this._cargo;
    }
}
