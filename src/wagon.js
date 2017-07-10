export default class Wagon {
    constructor(train) {
        this._cargo = 0;
        this._train = train;
    }

    get maxCargo(){
        return 80;
    }

    calcSpeed(speed){
        return speed * 0.8;
    }

    set cargo(value){
        this._cargo = value;
    }

    get cargo(){
        return this._cargo;
    }
}
