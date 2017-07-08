export default class Line {
    constructor(id, data) {
        this._id = id;
        // console.log(`Line ${this._id} created.`);
        this._color = 0x00C03A;
        this.list = [];

        for(let i=0; i<data.length; i++){
            const info = data[i];
            const station = {
                id: info.id + "-f",
                name: info.name + "-f",
                line: info.line,
                lat: parseFloat(info.lat),
                lon: info.lon,
                dir: 1
            };
            this.list.push(station);
        }

        // const dataRev = data.reverse();

        for(let j=data.length-1; j>=0; j--){
            const info = data[j];
            const station = {
                id: info.id + "-b",
                name: info.name + "-b",
                line: info.line,
                lat: parseFloat(info.lat) + 0.08,
                lon: parseFloat(info.lon),
                dir: -1
            };
            this.list.push(station);
        }
    }

    set list(value){
        this._list = value;
    }

    get list(){
        return this._list;
    }
}
