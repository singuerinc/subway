import l3 from "./l3.json";

export default class L3 {
    constructor() {
        this._id = "L3";
        // console.log(`Line ${this._id} created.`);
        this._color = 0x00C03A;
        this.list = [];

        for(let i=0; i<l3.length; i++){
            const info = l3[i];
            const station = {
                id: info.id + "-f",
                name: info.name + "-f",
                line: info.line,
                lat: info.lat,
                lon: info.lon,
            };
            this.list.push(station);
        }

        const l3b = l3.reverse();

        for(let i=0; i<l3b.length; i++){
            const info = l3b[i];
            const station = {
                id: info.id + "-b",
                name: info.name + "-b",
                line: info.line,
                lat: info.lat,
                lon: info.lon,
            };
            this.list.push(station);
        }


        // this.list = stations;
    }

    set list(value){
        this._list = value;
    }

    get list(){
        return this._list;
    }
}
