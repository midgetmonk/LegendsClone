import { legends } from "./module/config.js";
import LegendsItemSheet from "./module/sheets/LegendsItemSheet.js";

Hooks.once("init", function(){
  console.log("legends | Initialising Avatar Legends RPG system...");

  CONFIG.legends = legends;

  //DataTransferItemList.unregisterSheet("core", ItemSheet);
  Items.registerSheet("legends", LegendsItemSheet, { makeDefault: true });

  Handlebars.registerHelper("times", function(n, content) {
    let result = "";
    for (let i = 0; i < n; i++){
      result += content.fn(i)
    }
    return result;
  });
});
