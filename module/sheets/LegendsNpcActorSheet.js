import { filter_and_sort, filter_techniques } from "../helpers.js";
import * as Dice from "../dice.js";
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

    console.log(context);

    return context;
  }

  activateListeners(html) {
    if(this.actor.owner){
      html.find('.decrease-fatigue').click(this._onDecreaseNPCFatigue.bind(this));
      html.find('.increase-fatigue').click(this._onIncreaseNPCFatigue.bind(this));
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
}