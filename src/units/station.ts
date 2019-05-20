import anime from "animejs";
import { IWayPoint, WayPoint } from "./waypoint";

export interface IStation extends IWayPoint {
    cargo: (value: number) => void;
}

interface IProps {
    id: string;
    name: string;
    position: { x: number; y: number };
}

export const Station = function({ id, name, position }: IProps) {
    let _cargo: number = anime.random(20, 150);

    const w = WayPoint({ id, name, position });
    w.type = 1;

    // simulate cargo arriving
    setInterval(() => {
        const value = anime.random(1, 50);
        _cargo += value;
    }, 10000);

    return {
        ...w,
        set cargo(value: number) {
            _cargo = value;
            w.emitter.emit("cargo:changed", this._cargo);
        },

        get cargo(): number {
            return _cargo;
        }
    };
};
