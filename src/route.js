import Utils from "./utils";
import Stop from "./stop";
import Train from "./train";

export default class Route {
    constructor(ctx, id, routeInfo, color) {
        console.log(`Route ${id} created.`);
        this._ctx = ctx;
        this._routeInfo = routeInfo;
        this._color = color;
        this._stops = [];

        let lastStop;

        for (let s in this._routeInfo.stops) {
            const info = this._routeInfo.stops[s];
            const stop = new Stop(this._ctx, info.id, info.position, lastStop, this._color);

            this._stops.push(stop);

            lastStop = stop;
        }

        this._t = new Train(ctx, "t1", lastStop.position);
    }

    render(){
        this._stops.forEach((s) => {
            console.log(s);
            s.render();
        });

        this._t.render();
    }

    start() {
        this._interval = setInterval(() => {
            this._t.moveTo(this._stops[0].position);
            this._t.render();
        }, 1000);
    }
}
