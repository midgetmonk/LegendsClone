export default class LegendsActor extends Actor {
  _preCreate(data, _options, _userId){
    const img = CONFIG.legends.defaultTokens[data.type];
    data.img = img;
    this.data.img = img;
    this.data.update(data);
  }
}
