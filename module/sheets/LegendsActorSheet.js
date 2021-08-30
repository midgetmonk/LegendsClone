import { filter_and_sort, filter_techniques } from "../helpers.js";
import * as Dice from "../dice.js";
export default class LegendsActorSheet extends ActorSheet {
  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      width: 850,
      height: 850
    });
  }

  get template(){
    return `systems/legends/templates/sheets/actors/${this.actor.data.type}-sheet.hbs`;
  };

  itemContextMenu = [
    {
      name: game.i18n.localize("legends.context-menu.edit"),
      icon: '<i class="fas fa-edit"></i>',
      callback: element => {
        let itemId = element.closest('.item').data('item-id');
        const item = this.actor.items.get(itemId);
        item.sheet.render(true);
      }
    },
    {
      name: game.i18n.localize("legends.context-menu.delete"),
      icon: '<i class="fas fa-trash"></i>',
      callback: element => {
        let itemId = element.closest('.item').data('item-id');
        this.actor.deleteOwnedItem(itemId)
      }
    }
  ];

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;

    context.feature = filter_and_sort(context.items, 'feature')[0];
    context.conditions = filter_and_sort(context.items, 'condition');
    context.moves = filter_and_sort(context.items, 'move');
    context.techniques = {}; //filter_and_sort(context.items, 'technique');

    for (const [k, _v] of Object.entries(context.config.approaches)) { 
      let sorted = filter_and_sort(context.items, 'technique');
      let filtered = filter_techniques(sorted, k);
      context.techniques[k] = filtered;
    }
    context.momentOfBalance = filter_and_sort(context.items, 'moment-of-balance')[0];

    console.log(context);
    return context;
  }

  activateListeners(html) {
    if(this.isEditable){
      //Generic value tracks
      html.find('.set-value').click(this._onSetValue.bind(this));
      html.find('.set-value').contextmenu(this._onClearValue.bind(this));

      // Advancements
      html.find('.set-adv-value').click(this._onSetAdvancementValue.bind(this));
      html.find('.set-adv-value').contextmenu(this._onClearAdvancement.bind(this));

      //trainings
      html.find('.training-type').click(this._onToggleTrainingType.bind(this));

      // Set balance and center
      html.find('.set-balance').click(this._onSetBalanceValue.bind(this));
      html.find('.set-balance-center').click(this._onSetBalanceCenter.bind(this));

      //Remove and Toggle Conditions
      html.find('.condition-toggle').click(this._onConditionToggle.bind(this));

      // Create, Edit and Delete Moves and Techniques
      html.find('.item-create').click(this._onItemCreate.bind(this));
      html.find('.item-edit').click(this._onItemEdit.bind(this));
      html.find('.item-delete').click(this._onItemDelete.bind(this));
      // Context Menus
      new ContextMenu(html, ".item .menu", this.itemContextMenu);

      // Techniques
      html.find('.set-proficiency').click(this._onSetTechniqueProficiency.bind(this));
    }

    if(this.actor.owner){
      html.find('.stat-roll').click(this._onStatRoll.bind(this));
      html.find('.item-roll').click(this._onItemRoll.bind(this));

      html.find('.principle-roll').click(this._onPrincipleRoll.bind(this));

      if(this.actor.type == "npc"){
        html.find('.decrease-fatigue').click(this._onDecreaseNPCFatigue.bind(this));
        html.find('.increase-fatigue').click(this._onIncreaseNPCFatigue.bind(this));
      }
    }

    super.activateListeners(html);
  }

  _onIncreaseNPCFatigue(event){
    event.preventDefault();
    let newFatigueMax = this.actor.data.data.fatigue.max + 1;
    return this.actor.update({
      data: {
        fatigue: {
          max: newFatigueMax
        }
      }
    });
  }

  _onDecreaseNPCFatigue(event){
    event.preventDefault();
    let newFatigueMax = Math.max((this.actor.data.data.fatigue.max - 1), 0);
    return this.actor.update({
      data: {
        fatigue: {
          max: newFatigueMax
        }
      }
    });
  }

  _onSetBalanceValue(event){
    event.preventDefault();
    let element = event.currentTarget;
    return this.actor.update({
      data: {
        balance: {
          value: parseInt(element.dataset.currentBalance)
        }
      }
    });
  }

  _onSetBalanceCenter(event){
    event.preventDefault();
    let element = event.currentTarget;
    return this.actor.update({
      data: {
        balance: {
          center: parseInt(element.dataset.currentCenter)
        }
      }
    });
  }

  _onItemRoll(event){
    event.preventDefault();
    let element = event.currentTarget;
    let dataset = element.closest('.item').dataset;
    let itemId = dataset.itemId;
    let item = this.actor.items.get(itemId);
    let npc = dataset.npc;

    return item.roll(npc);
  }

  _onStatRoll(event){
    const value = event.currentTarget.dataset.statValue;
    const name = game.i18n.localize(`legends.stats.${event.currentTarget.dataset.statName}`);
    Dice.RollStat({
      statValue: value,
      statName: name
    });
  }

  _onPrincipleRoll(event){
    const name = event.currentTarget.dataset.name;
    const negative = event.currentTarget.dataset.negative;
    let value = event.currentTarget.dataset.value;

    if(negative === 'true'){
      value = -value;
    }

    Dice.RollStat({
      statValue: value,
      statName: name
    });
  }

  _onToggleTrainingType(event){
    let element = event.currentTarget;
    let type = element.dataset.type;
    let newValue = !this.actor.data.data.training[type];

    return this.actor.update({
      data: {
        training: {
          [type]: newValue
        }
      }
    });
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

  _onSetAdvancementValue(event){
    let element = event.currentTarget;
    let name = element.dataset.param;
    let newValue = element.dataset.newValue;

    return this.actor.update({
      data: {
        growth: {
          advancements: {
            [name]: {
              value: newValue
            }
          }
        }
      }
    });
  }

  _onClearAdvancement(event){
    let element = event.currentTarget;
    let name = element.dataset.param;

    return this.actor.update({
      data: {
        growth: {
          advancements: {
            [name]: {
              value: 0
            }
          }
        }
      }
    });
  }

  _onClearValue(event){
    let element = event.currentTarget;
    let param = element.dataset.param;

    return this.actor.update({
      data: {
        [param]: {
          value: 0
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
    let item = this.actor.items.get(itemId);

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