export default class LegendsItemSheet extends ItemSheet {
  get template(){
    return `systems/legends/templates/sheets/items/${this.item.data.type}-sheet.hbs`;
  };

  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      width: 500,
      height: 475
    });
  }

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;
    console.log(context);
    return context;
  }

  activateListeners(html){
    html.find('.item-roll').click(this._onItemRoll.bind(this));
    super.activateListeners(html);
  }

  /**
   * Show this item in the chat.
   * @param {Event} event
   */
  _onItemRoll(event){
    event.preventDefault();
    this.item.roll();
  }
};
