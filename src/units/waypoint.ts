import { EventEmitter } from "fbemitter";
import Train from "../train";

export interface IWayPoint {
    id: string;
    name: string;
    type: number;
    position: { x: number; y: number };
    currentTrain: Train;
    emitter: EventEmitter;
    reserve: (current: Train, train: Train) => void;
    enter: (current: Train, train: Train) => void;
    leave: (current: Train, train: Train) => void;
}

interface IProps {
    id: string;
    name: string;
    position: { x: number; y: number };
}

export const WayPoint = function({ id, name, position }: IProps): IWayPoint {
    let _currentTrain: Train | null;
    const emitter = new EventEmitter();

    return {
        id,
        name,
        position,
        type: 0,
        get currentTrain() {
            return _currentTrain;
        },
        emitter,
        reserve: function(current: Train, train: Train) {
            if (current === null) {
                _currentTrain = train;
                emitter.emit("train:reserve", train);
            } else {
                // FIXME
                throw new Error("A train is in this station!");
            }
        },
        enter: function(current: Train, train: Train) {
            if (current === train) {
                emitter.emit("train:enter", train);
            } else {
                // FIXME
                throw new Error("A train is in this station!");
            }
        },
        leave: function(current: Train, train: Train) {
            if (current === train) {
                _currentTrain = null;
                emitter.emit("train:leave", train);
            }
        }
    };
};
