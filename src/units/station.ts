import * as anime from 'animejs';
import WayPoint from './waypoint';

export default class Station extends WayPoint {
    private _cargo: number;

    constructor({id, name, position}: { id: string, name: string, position: any }) {
        super({id, name, position});

        this.type = 1;

        const initialCargo = anime.random(20, 150);

        this.cargo = initialCargo;

        // simulate cargo arriving
        setInterval(() => {
            const value = anime.random(1, 50);

            this.cargo += value;
        }, 10000);
    }

    set cargo(value: number) {
        this._cargo = value;
        this.emitter.emit('cargo:changed', this._cargo);
    }

    get cargo(): number {
        return this._cargo;
    }
}
