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

  activateListeners(html) {
    //Value tracks
    html.find('.set-value').click(this._onSetValue.bind(this));

    //Remove and Toggle Conditions
    html.find('.condition-toggle').click(this._onConditionToggle.bind(this));

    // Create, Edit and Delete Moves and Techniques
    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-edit').click(this._onItemEdit.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));

    // Techniques
    html.find('.set-proficiency').click(this._onSetTechniqueProficiency.bind(this));

    super.activateListeners(html);
  }

  _onSetValue(event){
    let element = event.currentTarget;
    let param = element.dataset.param;
    let newValue = element.dataset.newValue;

    return this.actor.update({
      data: {
        [param]: {
          value: newValue
        }
      }
    })
  }

  _onConditionToggle(event){
    event.preventDefault();

    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.items.get(itemId);

    let state = !item.data.data.checked;

    return item.update({
      data: { "checked": state }
    });
  }

  _onItemCreate(event) {
    event.preventDefault();

    let element = event.currentTarget;
    let type = element.dataset.type;

    let defaultData = {};
    switch(type){
      case 'technique':
        defaultData = { "learned": true }
        break;
      default:
        defaultData = {}
    }

    let itemData = {
      name: game.i18n.localize("legends.items.new.name"),
      type: type,
      data: { description: game.i18n.localize('legends.items.new.description'), ...defaultData }
    }

    return this.actor.createOwnedItem(itemData);
  }

  _onItemEdit(event){
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.getOwnedItem(itemId);

    item.sheet.render(true);
  }

  _onItemDelete(event){
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    return this.actor.deleteOwnedItem(itemId);
  }

  _onSetTechniqueProficiency(event){
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.items.get(itemId);
    let level = element.dataset.level;

    let mastered = false;
    let practiced = false;

    switch(level) {
      case 'mastered':
        mastered = true;
        practiced = true;
        break;
      case 'practiced':
        practiced = true;
        break;
    }
    return item.update({
      data: {
        learned: true,
        practiced: practiced,
        mastered: mastered
      }
    });
  }
};