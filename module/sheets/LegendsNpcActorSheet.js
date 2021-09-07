import { filter_and_sort } from "../helpers.js";
import LegendsActorSheet from "./LegendsActorSheet.js";

export default class LegendsNpcActorSheet extends LegendsActorSheet {
  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      width: 650,
      height: 750
    });
  }

  getData(){
    const context = super.getData();
    context.principle = filter_and_sort(context.items, 'npc-principle')[0];
    context.technique = filter_and_sort(context.items, 'technique')[0];

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
   * Increase the number of Fatigue boxes by one
   * @param {Event} event
   */
  _onIncreaseNPCFatigue(event){
    event.preventDefault();

    let newFatigueMax = this.actor.data.data.fatigue.max + 1;
    this.actor.update({
      data: {
        fatigue: {
          max: newFatigueMax
        }
      }
    });
  }

  /**
   * Reduce the number of Fatigue boxes by one, to a minimum of 0.
   * @param {Event} event 
   */
  _onDecreaseNPCFatigue(event){
    event.preventDefault();

    let newFatigueMax = Math.max((this.actor.data.data.fatigue.max - 1), 0);
    this.actor.update({
      data: {
        fatigue: {
          max: newFatigueMax
        }
      }
    });
  }
}
