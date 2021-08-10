export default class LegendsItemSheet extends ItemSheet {
  get template(){
    return `systems/legends/templates/sheets/${this.item.data.type}-sheet.hbs`;
  };

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;
    return context;
  }
};