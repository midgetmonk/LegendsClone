export default class LegendsItemSheet extends ItemSheet {
  get template(){
    return `systems/legends/templates/sheets/items/${this.item.data.type}-sheet.hbs`;
  };

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;

    
    
    return context;
  }

  activateListeners(html){
    html.find('.item-roll').click(this._onItemRoll.bind(this));

    super.activateListeners(html);
  }

  _onItemRoll(event){
    event.preventDefault();
    return this.item.roll();
  }
};