export default class LegendsItemSheet extends ItemSheet {
  get template(){
    return `systems/legends/templates/sheets/items/${this.item.data.type}-sheet.hbs`;
  };

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;

    //context.moves = context.items;
    console.log(context);
    return context;
  }
};