import { legends } from "./module/config.js";
import LegendsItem from "./module/LegendsItem.js";
import LegendsActorSheet from "./module/sheets/LegendsActorSheet.js";
import LegendsNpcActorSheet from "./module/sheets/LegendsNpcActorSheet.js";
import LegendsItemSheet from "./module/sheets/LegendsItemSheet.js";
import preloadHandlebarsTemplates from "./module/preload.js";
import * as Chat from "./module/chat.js";
import * as Migrations from "./module/migrations.js";

function registerSystemSettings(){
  game.settings.register("legends", "systemMigrationVersion", {
    config: false,
    scope: "world",
    type: String,
    default: ""
  });
}

Hooks.once("init", function(){
  console.log("legends | Initialising Avatar Legends RPG (Unofficial) system...");

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
    return path+"."+key;
  });

  Handlebars.registerHelper("modulus", function(mod, index, content){
    if(index % mod == 0){
      return content;
    }
  });

  CONFIG.TinyMCE.toolbar = "styleselect bullist numlist hr link removeformat code save";
  CONFIG.TinyMCE.content_css = "systems/legends/styles/tinymce.css";
});

// Allow buttons in chat messages
Hooks.on("renderChatLog", (_app, html, _data) => Chat.addChatListeners(html));

Hooks.once("ready", () => {
  if(!game.user.isGM) return;

  const currentVersion = game.settings.get("legends", "systemMigrationVersion");
  const NEEDS_MIGRATION_VERSION = "0.2.2";

  const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);

  if(needsMigration){
    Migrations.migrateWorld();
    game.settings.set('legends', 'systemMigrationVersion', NEEDS_MIGRATION_VERSION);
  }
});
