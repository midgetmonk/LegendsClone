export default class LegendsActorSheet extends ActorSheet {
  get template(){
    return `systems/legends/templates/sheets/actors/${this.actor.data.type}-sheet.hbs`;
  };

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;

    context.conditions = context.items.filter(function(item){
      return item.type == 'condition';
    });
    context.moves = context.items.filter(function(item) {
      return item.type == 'move';
    }).sort(function(a,b){
      if (a.name < b.name){
        return -1;
      }
      return 1;
    });
    context.techniques = context.items.filter(function(item){
      return item.type == 'technique'
    });

    console.log(context);
    return context;
  }
};