import { filter_items } from "../helpers.js";
import LegendsActorSheet from "./LegendsActorSheet.js";

export default class LegendsNpcActorSheet extends LegendsActorSheet {
  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      width: 650,
      height: 750
    });
  }

  async getData(){
    const context = await super.getData();
    context.principle = filter_items(context.items, 'npc-principle')[0];
    context.techniques = filter_items(context.items, 'technique');
    console.log(context);
    return context;
  }

  activateListeners(html) {
    if(this.actor.isOwner){
      html.find('.decrease-fatigue').click(this._onDecreaseNPCFatigue.bind(this));
      html.find('.increase-fatigue').click(this._onIncreaseNPCFatigue.bind(this));
    }
    super.activateListeners(html);
  }

  /**
   * Increase the number of Fatigue boxes by one.
   * Also adjusts the current and remaining fatigue.
   * @param {Event} event
   */
  _onIncreaseNPCFatigue(event){
    event.preventDefault();

    let newFatigueMax = this.actor.system.fatigue.max + 1;
    let currentFatigue = this.actor.system.fatigue.value;
    let newFatigueRemaining = newFatigueMax - currentFatigue;

    this.actor.update({
      fatigue: {
        max: newFatigueMax
      },
      fatigueRemaining: {
        value: newFatigueRemaining,
        max: newFatigueMax
      }
    });
  }

  /**
   * Reduce the number of Fatigue boxes by one, to a minimum of 0.
   * Also adjusts current and remaining fatigue.
   * @param {Event} event 
   */
  _onDecreaseNPCFatigue(event){
    event.preventDefault();

    let newFatigueMax = Math.max((this.actor.system.fatigue.max - 1), 0);
    let currentFatigue = Math.min(this.actor.system.fatigue.value, newFatigueMax);
    let newFatigueRemaining = Math.min((newFatigueMax - currentFatigue), 0);

    this.actor.update({
      data: {
        fatigue: {
          value: currentFatigue,
          max: newFatigueMax
        },
        fatigueRemaining: {
          value: newFatigueRemaining,
          max: newFatigueMax
        }
      }
    });
  }
}
