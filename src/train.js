import Utils from "./utils";

export default class Train {
    constructor(ctx, id, position) {
        console.log(`Train ${id} created.`);
        this._id = id;
        this._position = position;
        this._parent = parent;
        this._ctx = ctx;
        this._moving = false;
    }

    get position() {
        return this._position;
    }

    moveTo(position){
        if(this.position.x === position.x && this.position.y === position.y){
            this._moving = false;
        } else {
            this._moving = true;
            const dx = position.x - this.position.x;
            const dy = position.y - this.position.y;
            const angle = Math.atan2(dy, dx);
            const magnitude = 1.0;
            const velX = Math.cos(angle) * magnitude;
            const velY = Math.sin(angle) * magnitude;
            this.position.x += velX;
            this.position.y += velY;
        }
    }

    render() {
        this._ctx.beginPath();
        this._ctx.fillStyle = "#000";
        this._ctx.arc(Utils.convert(this.position.x), Utils.convert(this.position.y), 7, 0, 2 * Math.PI);
        this._ctx.fill();
    }
}
