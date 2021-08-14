import { filter_and_sort } from "../helpers.js";
export default class LegendsActorSheet extends ActorSheet {
  get template(){
    return `systems/legends/templates/sheets/actors/${this.actor.data.type}-sheet.hbs`;
  };

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;

    context.feature = filter_and_sort(context.items, 'feature')[0];
    context.conditions = filter_and_sort(context.items, 'condition');
    context.moves = filter_and_sort(context.items, 'move');
    context.techniques = filter_and_sort(context.items, 'technique');

    console.log(context);
    return context;
  }
};