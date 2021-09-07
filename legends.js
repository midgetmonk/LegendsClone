import { legends } from "./module/config.js";
import LegendsItem from "./module/LegendsItem.js";
import LegendsActorSheet from "./module/sheets/LegendsActorSheet.js";
import LegendsNpcActorSheet from "./module/sheets/LegendsNpcActorSheet.js";
import LegendsItemSheet from "./module/sheets/LegendsItemSheet.js";
import preloadHandlebarsTemplates from "./module/preload.js";
import * as Chat from "./module/chat.js";

Hooks.once("init", function(){
  console.log("legends | Initialising Avatar Legends RPG system...");

  CONFIG.legends = legends;
  CONFIG.Item.documentClass = LegendsItem;

  Items.registerSheet("legends", LegendsItemSheet, { makeDefault: true });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("legends", LegendsActorSheet, {
    types: ["player"],
    makeDefault: true
  });
  Actors.registerSheet("legends", LegendsNpcActorSheet, {
    types: ["npc"],
    makeDefault: true
  });

  preloadHandlebarsTemplates();

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

Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));
