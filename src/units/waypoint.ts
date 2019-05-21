import { EventEmitter } from "fbemitter";
import Train from "../train";

export interface IWayPoint {
    id: string;
    name: string;
    type: number;
    position: { x: number; y: number };
    currentTrain: Train;
    emitter: EventEmitter;
    reserve: (train: Train) => void;
    enter: (train: Train) => void;
    leave: (train: Train) => void;
}

const isEmpty = waypoint => waypoint.train === null;

export class WayPoint implements IWayPoint {
    public emitter: EventEmitter = new EventEmitter();
    public type: number = 0;
    public currentTrain: Train = null;

    constructor(
        public id: string,
        public name: string,
        public position: { x: number; y: number }
    ) {}

    public reserve(train: Train) {
        if (isEmpty(this)) {
            this.currentTrain = train;
            this.emitter.emit("train:reserve", train);
        } else {
            // FIXME
            throw new Error("A train is in this station!");
        }
    }

    public enter(train: Train) {
        if (isEmpty(this)) {
            this.emitter.emit("train:enter", train);
        } else {
            // FIXME
            throw new Error("A train is in this station!");
        }
    }

    public leave(train: Train) {
        if (this.currentTrain === train) {
            this.currentTrain = null;
            this.emitter.emit("train:leave", train);
        }
    }
}
