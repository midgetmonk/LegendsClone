import { legends } from "./module/config.js";
import LegendsItem from "./module/LegendsItem.js";
import LegendsActorSheet from "./module/sheets/LegendsActorSheet.js";
import LegendsNpcActorSheet from "./module/sheets/LegendsNpcActorSheet.js";
import LegendsItemSheet from "./module/sheets/LegendsItemSheet.js";
import preloadHandlebarsTemplates from "./module/preload.js";
import * as Chat from "./module/chat.js";

Hooks.once("init", function(){
  console.log("legends | Initialising Avatar Legends RPG system...");

  // Config
  CONFIG.legends = legends;
  CONFIG.Item.documentClass = LegendsItem;

  // Item sheets
  Items.registerSheet("legends", LegendsItemSheet, { makeDefault: true });

  // Actor sheets
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
    return path+"."+key;
  });

  Handlebars.registerHelper("modulus", function(mod, index, content){
    if(index % mod == 0){
      return content;
    }
  });
});

// Allow buttons in chat messages
Hooks.on("renderChatLog", (_app, html, _data) => Chat.addChatListeners(html));

/**
 * TODO: Default images for actors & items
 */
// Hooks.on('createActor', (data, _options, _id) => {
//   let actor = data;
//   let type = actor.data.type;
//   let img = CONFIG.legends.defaultTokens[type];
//   actor.data.img = img;
// });

// Hooks.on('createItem', (data, _options, _id) => {
//   let item = data;
//   let type = item.data.type;
//   let img = CONFIG.legends.defaultTokens[type];
//   item.data.img = img;
// });
