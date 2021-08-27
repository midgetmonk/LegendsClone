import { legends } from "./module/config.js";
import LegendsItem from "./module/LegendsItem.js";
import LegendsActorSheet from "./module/sheets/LegendsActorSheet.js";
import LegendsItemSheet from "./module/sheets/LegendsItemSheet.js";
import preloadHandlebarsTemplates from "./module/preload.js";

function registerSystemSettings() {
  game.settings.register(
    "legends",
    "showRollOptions",
    {
      config: true,
      scope: "client",
      name: "SETTINGS.showRollOptions.name",
      hint: "SETTINGS.showRollOptions.label",
      type: Boolean,
      default: true
    }
  );
}

Hooks.once("init", function(){
  console.log("legends | Initialising Avatar Legends RPG system...");

  CONFIG.legends = legends;
  CONFIG.Item.entityClass = LegendsItem;

  //DataTransferItemList.unregisterSheet("core", ItemSheet);
  Items.registerSheet("legends", LegendsItemSheet, { makeDefault: true });
  Actors.registerSheet("legends", LegendsActorSheet, { makeDefault: true });

  preloadHandlebarsTemplates();
  registerSystemSettings();

  Handlebars.registerHelper("times", function(n, content) {
    let result = "";
    for (let i = 0; i < n; i++){
      content.data.index = i + 1;
      result += content.fn(i)
    }
    return result;
  });

  Handlebars.registerHelper("tr_path", function(path, key){
    let full_path = path+"."+key;
    return full_path;
  });

  Handlebars.registerHelper("modulus", function(mod, index, content){
    if(index % mod == 0){
      return content;
    }
  });
});
