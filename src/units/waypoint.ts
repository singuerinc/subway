import { EventEmitter } from "fbemitter";
import Train from "../train";

export default class WayPoint {
    protected _currentTrain: Train | null;
    protected _type: number;
    protected _position: { x: number; y: number };
    protected _name: string;
    protected _id: string;
    protected _emitter: EventEmitter;

    constructor({
        id,
        name,
        position
    }: {
        id: string;
        name: string;
        position: any;
    }) {
        this._emitter = new EventEmitter();
        this._id = id;
        this._name = name;
        this._position = position;
        this.type = 0;
        this._currentTrain = null;
    }

    get emitter(): EventEmitter {
        return this._emitter;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set type(value: number) {
        this._type = value;
    }

    get type(): number {
        return this._type;
    }

    get position(): { x: number; y: number } {
        return this._position;
    }

    public reserve(train: Train): void {
        if (this.getCurrentTrain() === null) {
            this._currentTrain = train;
            this.emitter.emit("train:reserve", train);
        } else {
            throw new Error("A train is in this station!");
        }
    }

    public enter(train: Train): void {
        if (train === this.getCurrentTrain()) {
            this.emitter.emit("train:enter", train);
        } else {
            throw new Error("A train is in this station!");
        }
    }

    public leave(train: Train): void {
        if (train === this.getCurrentTrain()) {
            this._currentTrain = null;
            this.emitter.emit("train:leave", train);
        }
    }

    public getCurrentTrain(): Train | null {
        return this._currentTrain;
    }
}
