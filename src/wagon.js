export default class Wagon {
    constructor() {
        this._cargo = 0;
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
