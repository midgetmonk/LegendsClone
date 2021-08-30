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
}