export default class LegendsActor extends Actor {
  _preCreate(data, options, userId){
    const img = CONFIG.legends.defaultTokens[data.type];
    data.img = img;
    this.img = img;
    this.update(data);
  }
}
