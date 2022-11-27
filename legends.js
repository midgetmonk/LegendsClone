import { legends } from "./module/config.js";
import LegendsItem from "./module/LegendsItem.js";
import LegendsActor from "./module/LegendsActor.js";
import LegendsActorSheet from "./module/sheets/LegendsActorSheet.js";
import LegendsNpcActorSheet from "./module/sheets/LegendsNpcActorSheet.js";
import LegendsCampaignActorSheet from "./module/sheets/LegendsCampaignActorSheet.js";
import LegendsItemSheet from "./module/sheets/LegendsItemSheet.js";
import preloadHandlebarsTemplates from "./module/preload.js";
import * as Chat from "./module/chat.js";
import * as Migrations from "./module/migrations.js";
import LegendsJournalSheet from "./module/sheets/LegendsJournalSheet.js";

function registerSystemSettings(){
  game.settings.register("legends", "systemMigrationVersion", {
    config: false,
    scope: "world",
    type: String,
    default: ""
  });

  game.settings.register(
    "legends", "tabbedPlayerSheet", {
      config: true,
      scope: "client",
      name: "SETTINGS.tabbedPlayerSheet.label",
      hint: "SETTINGS.tabbedPlayerSheet.hint",
      type: Boolean,
      default: true
    });

    game.settings.register(
      "legends", "sheetColour", {
        config: true,
        scope: "client",
        name: "SETTINGS.sheetColour.label",
        hint: "SETTINGS.sheetColour.hint",
        type: String,
        choices: {
          "default": "SETTINGS.sheetColour.default",
          "quickstart": "SETTINGS.sheetColour.quickstart"
        },
        default: "default"
      }
    )
}

Hooks.once("init", function(){
  console.log("legends | Initialising Avatar Legends RPG (Unofficial) system...");

  // Config
  CONFIG.legends = legends;
  CONFIG.Actor.documentClass = LegendsActor;
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
  Actors.registerSheet("legends", LegendsCampaignActorSheet, {
    types: ["campaign"],
    makeDefault: true
  });

  // Journal sheet
  Journal.registerSheet("legends", LegendsJournalSheet, { makeDefault: true })

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

  Handlebars.registerHelper("tr_path", (path, key) => {
    return path+"."+key;
  });

  Handlebars.registerHelper("modulus", (mod, index, content) =>{
    if(index % mod == 0){
      return content;
    }
  });

  Handlebars.registerHelper("moveCategoryVisible", (category, movesVisible) => {
    if(category === "" || movesVisible[category]){
      return true
    }
    return false
  })

  Handlebars.registerHelper("getByKey", (object, key) => {
    return object[key]
  })

  Handlebars.registerHelper("rollApproach", approach => {
    let path = "legends.none"
    let params = {}
    switch (approach) {
      case "defend-maneuver":
        path = "legends.roll.with"
        params = {
          approach: game.i18n.localize("legends.techniques.approaches.defend-maneuver"),
          stat: "focus",
          name: game.i18n.localize("legends.stats.focus")
        }
        break;
      case "advance-attack":
        path = "legends.roll.with";
        params = {
          approach: game.i18n.localize("legends.techniques.approaches.advance-attack"),
          stat: "passion",
          name: game.i18n.localize("legends.stats.passion")
        }
        break;
      default:
        path = "legends.roll.evade-observe";
        params = {}
        break;
    }
    return game.i18n.format(path, params)
  })

  Handlebars.registerHelper("enrichHTML", html => {
    return TextEditor.enrichHTML(html, { async: false })
  })

  CONFIG.TinyMCE.content_css = "systems/legends/styles/tinymce.css";
  CONFIG.TinyMCE.style_formats.push(
    {
      title: 'Legends',
      items: [
        { title: 'Skill name', inline: 'span', classes: 'skill-name' }
      ]
    }
  )
});

// Allow buttons in chat messages
Hooks.on("renderChatLog", (_app, html, _data) => Chat.addChatListeners(html));

Hooks.on("renderPause", (_app, html, _options) => {
  html.find('img[src="icons/svg/clockwork.svg"]').attr("src", "systems/legends/images/pause.png");
});

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

Hooks.once('diceSoNiceReady', dice3d => {
  const diceDefaults = {
    category: 'Avatar Legends',
    foreground: '#111111',
    outline: '#F3EFDC',
    visibility: 'visible',
    font: 'Village'
  }

  // Colorsets
  dice3d.addColorset({
    ...diceDefaults,
    name: 'airbending', description: game.i18n.localize('legends.training.air'),
    background: '#D4B450', edge: '#D4B450',
  }, 'default');

  dice3d.addColorset({
    ...diceDefaults,
    name: 'earthbending', description: game.i18n.localize('legends.training.earth'),
    background: '#3C6733', edge: '#3C6733',
  }, 'default');

  dice3d.addColorset({
    ...diceDefaults,
    name: 'firebending', description: game.i18n.localize('legends.training.fire'),
    background: '#B62127', edge: '#B62127',
  }, 'default');

  dice3d.addColorset({
    ...diceDefaults,
    name: 'technology', description: game.i18n.localize('legends.training.technology'),
    background: '#6A2E7E', edge: '#6A2E7E',
  }, 'default');

  dice3d.addColorset({
    ...diceDefaults,
    name: 'waterbending', description: game.i18n.localize('legends.training.water'),
    background: '#4D63A9', edge: '#4D63A9',
  }, 'default');

  dice3d.addColorset({
    ...diceDefaults,
    name: 'weapons', description: game.i18n.localize('legends.training.weapons'),
    background: '#4D4D4F', edge: '#4D4D4F',
  }, 'default');

  // Systems and presets
  dice3d.addSystem({ id: 'legends-air', name: game.i18n.localize('legends.training.air') }, 'default');
  dice3d.addDicePreset({
    type: 'd6',
    labels: ['1','2','3','4','5','systems/legends/images/dice/air.png'],
    bumpMaps: [,,,,,'systems/legends/images/dice/air-b.png'],
    system: 'legends-air', colorset: 'airbending'
  });

  dice3d.addSystem({ id: 'legends-earth', name: game.i18n.localize('legends.training.earth') }, 'default');
  dice3d.addDicePreset({
    type: 'd6',
    labels: ['1','2','3','4','5','systems/legends/images/dice/earth.png'],
    bumpMaps: [,,,,,'systems/legends/images/dice/earth-b.png'],
    system: 'legends-earth', colorset: 'earthbending'
  });

  dice3d.addSystem({ id: 'legends-fire', name: game.i18n.localize('legends.training.fire') }, 'default');
  dice3d.addDicePreset({
    type: 'd6',
    labels: ['1','2','3','4','5','systems/legends/images/dice/fire.png'],
    bumpMaps: [,,,,,'systems/legends/images/dice/fire-b.png'],
    system: 'legends-fire', colorset: 'firebending'
  });

  dice3d.addSystem({ id: 'legends-tech', name: game.i18n.localize('legends.training.technology') }, 'default');
  dice3d.addDicePreset({
    type: 'd6',
    labels: ['1','2','3','4','5','systems/legends/images/dice/tech.png'],
    bumpMaps: [,,,,,'systems/legends/images/dice/tech-b.png'],
    system: 'legends-tech', colorset: 'technology'
  });

  dice3d.addSystem({ id: 'legends-water', name: game.i18n.localize('legends.training.water') }, 'default');
  dice3d.addDicePreset({
    type: 'd6',
    labels: ['1','2','3','4','5','systems/legends/images/dice/water.png'],
    bumpMaps: [,,,,,'systems/legends/images/dice/water-b.png'],
    system: 'legends-water', colorset: 'waterbending'
  });

  dice3d.addSystem({ id: 'legends-weapons', name: game.i18n.localize('legends.training.weapons') }, 'default');
  dice3d.addDicePreset({
    type: 'd6',
    labels: ['1','2','3','4','5','systems/legends/images/dice/weapon.png'],
    bumpMaps: [,,,,,'systems/legends/images/dice/weapon-b.png'],
    system: 'legends-weapons', colorset: 'weapons'
  });
});
