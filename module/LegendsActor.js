export default class LegendsActor extends Actor {
  _preCreate(data, _options, _userId){
    const img = CONFIG.legends.defaultTokens[data.type];
    this.updateSource({ img: img });
  }
}
