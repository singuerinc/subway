export default class Wagon {
    private _cargo: number;
    private _maxCargo: number;

    constructor() {
        this._cargo = 0;
        this._maxCargo = 220;
    }

    get maxCargo(): number {
        return this._maxCargo;
    }

    public calcSpeed(speed): number {
        const v = this.cargo / this.maxCargo;
        const f = 0.03 * v;

        return speed * 0.9 - f;
    }

    set cargo(value: number) {
        this._cargo = value;
    }

    get cargo(): number {
        return this._cargo;
    }
}
