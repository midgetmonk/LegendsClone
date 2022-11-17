import { filter_items, filter_statuses, filter_techniques } from "../helpers.js";
import * as Dice from "../dice.js";

export default class LegendsActorSheet extends ActorSheet {
  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      width: 900,
      height: 850,
      tabs: [{
        navSelector: ".tabs",
        contentSelector: ".body",
        initial: "main"
      }]
    });
  }

  get template(){
    return `systems/legends/templates/sheets/actors/${this.actor.type}-sheet.hbs`;
  };

  /**
   * Define the options in the Item context menu
   */
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
        this.actor.deleteEmbeddedDocuments("Item", [itemId])
      }
    }
  ];

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;
    context.cssClass = game.settings.get("legends", "sheetColour") || "default"

    context.feature = filter_items(context.items, 'feature')[0];
    context.conditions = filter_items(context.items, 'condition', true);
    context.moves = filter_items(context.items, 'move');
    context.momentOfBalance = filter_items(context.items, 'moment-of-balance')[0];
    context.statuses = {
      positive: filter_statuses(context.items, 'positive'),
      negative: filter_statuses(context.items, 'negative')
    }
    context.techniques = filter_items(context.items, 'technique');

    if(this.actor.type == 'player'){
      context.displayTabbed = game.settings.get('legends','tabbedPlayerSheet');
      context.growthQuestions = filter_items(context.items, 'growth-question');

      context.techniquesByApproach = {}
      Object.keys(CONFIG.legends.approaches).forEach(k => {
        context.techniquesByApproach[k] ||= [];
        context.techniquesByApproach[k] = filter_techniques(context.techniques, k);
      })

      context.movesVisible = {}
      const keys = ['basic','balance', 'playbook'];
      keys.forEach(k => {
        let visible = this.actor.getFlag('legends', `moves-${k}`);
        context.movesVisible[k] = visible === undefined ? true : visible;
      });
    }
    return context;
  }

  activateListeners(html) {
    if(this.isEditable){
      //Generic value tracks
      html.find('.set-value').click(this._onSetValue.bind(this));
      html.find('.set-value').contextmenu(this._onClearValue.bind(this));

      // Fatigue tracks
      html.find('.set-fatigue').click(this._onSetFatigue.bind(this));
      html.find('.set-fatigue').contextmenu(this._onClearFatigue.bind(this));

      if(this.actor.type == 'player'){
        //trainings
        html.find('.training-type').click(this._onToggleTrainingType.bind(this));

        // Set balance and center
        html.find('.set-balance').click(this._onSetBalanceValue.bind(this));
        html.find('.set-balance-center').click(this._onSetBalanceCenter.bind(this));

        // Techniques proficiency
        html.find('.set-proficiency').click(this._onSetTechniqueProficiency.bind(this));

        // Advancements
        html.find('.set-adv-value').click(this._onSetAdvancementValue.bind(this));
        html.find('.set-adv-value').contextmenu(this._onClearAdvancement.bind(this));

        html.find('.toggle-category').click(this._onToggleCategory.bind(this));
      }

      // toggle collapsible moves
      html.find('.toggle-drawer').click(this._onToggleCollapsible.bind(this));

      //Remove and Toggle Conditions
      html.find('.condition-toggle').click(this._onConditionToggle.bind(this));

      // Create, Edit and Delete Moves and Techniques
      html.find('.item-create').click(this._onItemCreate.bind(this));
      html.find('.item-edit').click(this._onItemEdit.bind(this));
      html.find('.item-delete').click(this._onItemDelete.bind(this));

      // Context Menus
      new ContextMenu(html, ".item .menu", this.itemContextMenu);
    }

    if(this.actor.isOwner){
      if(this.actor.type == 'player'){
        // Only players need to roll
        html.find('.stat-roll').click(this._onStatRoll.bind(this));
        html.find('.principle-roll').click(this._onPrincipleRoll.bind(this));
        html.find('.move-roll').click(this._onMoveRoll.bind(this));
      }
      // TODO: Maybe rename this as it's not actually rolling anything.
      html.find('.item-roll').click(this._onItemRoll.bind(this));
    }

    super.activateListeners(html);
  }

  /**
   * Update the Actor's Balance value (used for both tracks)
   * @param {Event} event
   */
  _onSetBalanceValue(event){
    event.preventDefault();
    
    let element = event.currentTarget;
    this.actor.update({
      data: {
        balance: {
          value: parseInt(element.dataset.currentBalance)
        }
      }
    });
  }

  /**
   * Update the Actor's Center on the Balance track
   * @param {Event} event
   */
  _onSetBalanceCenter(event){
    event.preventDefault();

    let element = event.currentTarget;
    this.actor.update({
      data: {
        balance: {
          center: parseInt(element.dataset.currentCenter)
        }
      }
    });
  }

  /**
   * Send an Item's description to the chat
   * @param {Event} event
   */
  _onItemRoll(event){
    event.preventDefault();
    let element = event.currentTarget;
    let dataset = element.closest('.item').dataset;
    let itemId = dataset.itemId;
    let item = this.actor.items.get(itemId);
    let npc = dataset.npc;

    item.roll(npc);
  }

  /**
   * Roll the stat for a Move. Calls the Dice#RollStat method with the name of the Move for display.
   * @param {Event} event
   */
  _onMoveRoll(event){
    event.preventDefault();

    const moveName = event.currentTarget.dataset.moveName;
    const statName = event.currentTarget.dataset.moveStat;
    const statValue = this.actor.system.stats[statName];

    const name = statName ? game.i18n.localize(`legends.stats.${statName}`) : null;

    Dice.RollStat({
      statValue: statValue,
      statName: name,
      moveName: moveName
    });
  }

  /**
   * Send an Actor's stat roll to the Chat.
   * @param {Event} event
   */
  _onStatRoll(event){
    event.preventDefault();

    const name = event.currentTarget.dataset.statName;

    Dice.RollStat({
      statValue: this.actor.system.stats[name],
      statName: game.i18n.localize(`legends.stats.${name}`)
    });
  }

  /**
   * Roll with a Principle and send it to the Chat.
   * @param {Event} event
   */
  _onPrincipleRoll(event){
    event.preventDefault();
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

  /**
   * Toggle a plsyer Actor's training
   * @param {Event} event
   */
  _onToggleTrainingType(event){
    event.preventDefault();
    let element = event.currentTarget;
    let type = element.dataset.type;
    let newValue = !this.actor.system.training[type];

    this.actor.update({
      data: {
        training: {
          [type]: newValue
        }
      }
    });
  }

  /**
   * Set the fatigue and fatigueRemaining values when Fatigue is
   * adjusted on this Actor.
   * @param {Event} event The triggering event
   */
   _onSetFatigue(event){
    event.preventDefault();
    let element = event.currentTarget;
    let checked = element.classList.contains('filled');
    let currentValue = parseInt(this.actor.system.fatigue.value);

    let max = this.actor.system.fatigue.max;

    let newValue = checked ? currentValue - 1 : currentValue + 1;
    let newRemaining = max - newValue;

    this.actor.update({
      data: {
        fatigue: {
          value: newValue
        },
        fatigueRemaining: {
          value: newRemaining,
          max: max
        }
      }
    });
  }

  /**
   * Set an Actor's Fatigue to 0 and fatigueRemaining to max.
   * @param {Event} event The triggering Event
   */
  _onClearFatigue(event){
    event.preventDefault();
    let max = this.actor.system.fatigue.max;

    this.actor.update({
      data: {
        fatigue: {
          value: 0
        },
        fatigueRemaining: {
          value: max,
          max: max
        }
      }
    });
  }

  /**
   * Set the value of an arbitrary Actor or Item parameter, depending on
   * the triggering event's target's data attributes.
   * @param {Event} event The triggering Event
   */
  _onSetValue(event){
    event.preventDefault();
    let element = event.currentTarget;
    let param = element.dataset.param;
    let obj = null;
    let newValue = null;
    
    if(element.dataset.type == 'item'){
      let dataset = element.closest('.item').dataset;
      let itemId = dataset.itemId;

      obj = this.actor.items.get(itemId);
      newValue = element.dataset.newValue;
    }
    else{
      let checked = element.classList.contains('filled');
      let currentValue = this.actor.system[param].value;

      newValue = checked ? currentValue - 1 : currentValue + 1;
      obj = this.actor
    }

    obj.update({
      data: {
        [param]: {
          value: parseInt(newValue)
        }
      }
    });
  }

  /**
   * Set an arbitrary parameter's value to zero.
   * @param {Event} event The triggering Event
   */
  _onClearValue(event){
    event.preventDefault();
    let element = event.currentTarget;
    let param = element.dataset.param;

    if(element.dataset.type == 'item'){
      // Currently only used for NPC Principle tracks
      let dataset = element.closest('.item').dataset;
      let itemId = dataset.itemId;
      let item = this.actor.items.get(itemId);

      item.update({
        data: {
          [param]: {
            value: 0
          }
        }
      });
    }
    else{
      this.actor.update({
        data: {
          [param]: {
            value: 0
          }
        }
      });
    }
  }

  /**
   * Update the progress on a Growth Advancement track.
   * 
   * This needed its own custom method due to nesting in the
   * object template.
   * @param {Event} event
   */
  _onSetAdvancementValue(event){
    event.preventDefault();
    let element = event.currentTarget;
    let name = element.dataset.param;
    let checked = element.classList.contains('filled');
    let currentValue = this.actor.system.growth.advancements[name].value;
    let newValue = checked ? currentValue - 1 : currentValue + 1;

    this.actor.update({
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

  /**
   * Clear the progress on a Growth Advancement track.
   * 
   * This needed its own custom method due to nesting in the
   * object template.
   * @param {Event} event
   */
  _onClearAdvancement(event){
    event.preventDefault();
    let element = event.currentTarget;
    let name = element.dataset.param;

    this.actor.update({
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

  /**
   * Toggle a Condition
   * @param {Event} event
   */
  _onConditionToggle(event){
    event.preventDefault();

    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.items.get(itemId);

    let state = !item.system.checked;

    item.update({
      data: { "checked": state }
    });
  }

  /**
   * Create a new Item and assign it to the calling Actor
   * @param {Event} event 
   */
  _onItemCreate(event) {
    event.preventDefault();

    let element = event.currentTarget;
    let type = element.dataset.type;

    let defaultData = {};
    switch(type) {
      case 'technique':
        defaultData = { "learned": true }
        break;
      default:
        defaultData = {}
    }

    let itemData = {
      name: game.i18n.format('legends.items.new.name', {type: type}),
      type: type,
      data: { description: game.i18n.localize('legends.items.new.description'), ...defaultData }
    }

    this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  /**
   * Show the sheet for an Item
   * @param {Event} event
   */
  _onItemEdit(event){
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.items.get(itemId);

    item.sheet.render(true);
  }

  /**
   * Delete an owned item
   * @param {Event} event 
   */
  _onItemDelete(event){
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    this.actor.deleteEmbeddedDocuments("Item", [itemId]);
  }

  /**
   * Update the Proficiency level on an Actor's owned Technique
   * @param {Event} event
   */
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
    item.update({
      data: {
        learned: true,
        practiced: practiced,
        mastered: mastered
      }
    });
  }

  /**
   * Toggle the content drawer for a move or technique
   * @param {Event} event 
   */
  _onToggleCollapsible(event){
    event.preventDefault();

    let element = event.currentTarget;
    $(element.closest('.item')).find('.drawer').slideToggle();
  }

  _onToggleCategory(event){
    event.preventDefault();

    const category = event.currentTarget.dataset.category;
    let visible = this.actor.getFlag('legends', `moves-${category}`);
    visible = visible === undefined ? true : visible;
    this.actor.setFlag('legends', `moves-${category}`, !visible);
  }
};
