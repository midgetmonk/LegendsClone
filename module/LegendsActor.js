export default class LegendsActor extends Actor {
  _onCreate(data, options, userId){
    const img = CONFIG.legends.defaultTokens[data.type];
    data.img = img;
    this.data.img = img;

    super._onCreate(data, options, userId);
  }
}
