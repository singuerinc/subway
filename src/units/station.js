import EventEmitter from 'wolfy87-eventemitter';
import WayPoint from './waypoint';
import anime from 'animejs';

export default class Station extends WayPoint {
    constructor({ id, name, type, position }) {
        super({ id, name, type, position });

        const initialCargo = anime.random(20, 50);

        this.cargo = initialCargo;

        // simulate cargo arriving
        setInterval(() => {
            const value = anime.random(1, 10);
            this.cargo += value;
        }, 10000);
    }

    /**
     * @returns {number}
     */
    get type() {
        return 1;
    }

    /**
     * Set the cargo for this station.
     * @param {Number} value
     */
    set cargo(value) {
        this._cargo = value;
        this.emitter.emitEvent('cargo:changed', [this._cargo]);
    }

    /**
     * The cargo waiting in this station.
     * @returns {Number}
     */
    get cargo() {
        return this._cargo;
    }
}
