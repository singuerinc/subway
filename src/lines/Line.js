export default class Line {
    constructor(id, color, data) {
        this._id = id;
        // console.log(`Line ${this._id} created.`);
        this._color = color;
        this.list = [];

        for(let i=0; i<data.length; i++){
            const info = data[i];
            const station = {
                id: info.id + "-f",
                name: info.name + "-f",
                line: info.line,
                lat: parseFloat(info.lat),
                lon: parseFloat(info.lon),
                dir: 1
            };
            this.list.push(station);
        }

        const dataRev = data.reverse();

        for(let j=0; j<dataRev.length; j++){
            const info = dataRev[j];
            const station = {
                id: info.id + "-b",
                name: info.name + "-b",
                line: info.line,
                lat: parseFloat(info.lat),
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
