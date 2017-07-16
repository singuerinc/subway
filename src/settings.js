export default class Settings extends PIXI.Sprite {
  /**
   * @param {Net} net
   */
  constructor({ net, railways }) {
    super();

    const lines = new PIXI.Graphics();

    lines.x = 20;
    lines.y = 20;

    this.addChild(lines);

    lines.clear();
    let i = 0;

    net.lines.forEach((line, key) => {
      const lineTextBtn = new PIXI.Text(line.name, {
        fontSize: 10,
        fill: 0x000000,
      });

      lineTextBtn.x = 4;
      lineTextBtn.y = 2;
      const lineBtn = new PIXI.Graphics();

      lineBtn.addChild(lineTextBtn);
      lineBtn.buttonMode = true;
      lineBtn.interactive = true;
      lineBtn.railway = railways.getChildAt(i);
      lineBtn.on('click', () => {
        this.onOff(lineBtn, net, !lineBtn.railway.visible);
      });

      this.onOff(lineBtn, net, lineBtn.railway.visible);

      lineBtn.beginFill(line.color, 1);
      lineBtn.drawRect(0, 0, 26, 16);
      lineBtn.endFill();
      lineBtn.y = i * 20;
      lines.addChild(lineBtn);
      i += 1;
    });

    const stationsBtn = new PIXI.Graphics();
    const lineTextBtn = new PIXI.Text('STATIONS', {
      fontSize: 10,
      fill: 0x000000,
    });

    lineTextBtn.x = 4;
    lineTextBtn.y = 2;
    stationsBtn.beginFill(0x777777, 1);
    stationsBtn.drawRect(0, 0, 58, 16);
    stationsBtn.endFill();
    stationsBtn.x = 20;
    stationsBtn.y = lines.y + lines.height + 20;
    stationsBtn.buttonMode = true;
    stationsBtn.interactive = true;
    stationsBtn.addChild(lineTextBtn);
    stationsBtn.stationsVisible = true;
    stationsBtn.on('click', () => {
      stationsBtn.stationsVisible = !stationsBtn.stationsVisible;
      cargoBtn.visible = stationsBtn.stationsVisible;
      railways.children.forEach((railway) => {
        railway.layerStations.visible = stationsBtn.stationsVisible;
      });
      stationsBtn.alpha = stationsBtn.stationsVisible ? 1 : 0.5;
    });
    this.addChild(stationsBtn);

    const cargoBtn = new PIXI.Graphics();
    const cargoTextBtn = new PIXI.Text('CARGO', {
      fontSize: 10,
      fill: 0x000000,
    });

    cargoTextBtn.x = 4;
    cargoTextBtn.y = 2;
    cargoBtn.beginFill(0x777777, 1);
    cargoBtn.drawRect(0, 0, 46, 16);
    cargoBtn.endFill();
    cargoBtn.x = 40;
    cargoBtn.y = stationsBtn.y + 18;
    cargoBtn.buttonMode = true;
    cargoBtn.interactive = true;
    cargoBtn.addChild(cargoTextBtn);
    cargoBtn.cargoVisible = true;
    cargoBtn.on('click', () => {
      cargoBtn.cargoVisible = !cargoBtn.cargoVisible;
      railways.children.forEach((railway) => {
        railway.layerStations.children.forEach((station) => {
          station.info.visible = cargoBtn.cargoVisible;
        });
      });
      cargoBtn.alpha = cargoBtn.cargoVisible ? 1 : 0.5;
    });
    this.addChild(cargoBtn);

    const stationNameBtn = new PIXI.Graphics();
    const stationNameTextBtn = new PIXI.Text('NAME', {
      fontSize: 10,
      fill: 0x000000,
    });

    stationNameTextBtn.x = 4;
    stationNameTextBtn.y = 2;
    stationNameBtn.beginFill(0x777777, 1);
    stationNameBtn.drawRect(0, 0, 46, 16);
    stationNameBtn.endFill();
    stationNameBtn.x = 40;
    stationNameBtn.y = cargoBtn.y + 18;
    stationNameBtn.buttonMode = true;
    stationNameBtn.interactive = true;
    stationNameBtn.addChild(stationNameTextBtn);
    stationNameBtn.nameVisible = false;
    stationNameBtn.alpha = 0.5;
    stationNameBtn.on('click', () => {
      stationNameBtn.nameVisible = !stationNameBtn.nameVisible;
      railways.children.forEach((railway) => {
        railway.layerStations.children.forEach((station) => {
          station.infoNameText.visible = stationNameBtn.nameVisible;
        });
      });
      stationNameBtn.alpha = stationNameBtn.nameVisible ? 1 : 0.5;
    });
    this.addChild(stationNameBtn);
  }

  onOff(btn, net, show) {
    const railway = btn.railway;

    railway.visible = show;
    btn.alpha = railway.visible ? 1 : 0.2;

    const trainsInRailway = net.trains.reduce((acc, train) => {
      if (train.itinerary.routes[0].id === railway.id) {
        acc.push(train);
      }
      return acc;
    }, []);

    console.log(trainsInRailway);

    trainsInRailway.forEach((train) => {
      train.visible = railway.visible;
    });
  }
}
