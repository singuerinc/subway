import anime from "animejs";
import { WayPoint } from "./waypoint";

export class Station extends WayPoint {
    private _cargo: number = anime.random(20, 150);

    constructor(
        public id: string,
        public name: string,
        public position: { x: number; y: number }
    ) {
        super(id, name, position);
        this.type = 1;

        setInterval(() => {
            const value = anime.random(1, 50);
            this.cargo += value;
        }, 10000);
    }

    public set cargo(value: number) {
        this._cargo = value;
        this.emitter.emit("cargo:changed", this._cargo);
    }

    public get cargo(): number {
        return this._cargo;
    }
}
