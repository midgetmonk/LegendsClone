export async function RollStat({
  statValue = null,
  statName = null
} = {}){
  const messageTemplate = "systems/legends/templates/partials/stat-roll.hbs";

  let neg = statValue < 0;
  let abs_stat = Math.abs(statValue);

  let rollData = {
    oStat: (neg ? '-' : '+'),
    vStat: abs_stat
  }

  let rollFormula = "2d6 @oStat @vStat";

  let rollOptions = await GetRollOptions(statName);

  if(rollOptions.cancelled){
    return;
  }

  let penalty = rollOptions.penalty;
  if(penalty != 0){
    rollData.vPenalty = Math.abs(penalty)
    rollFormula += " - @vPenalty"
  }

  let bonus = rollOptions.bonus;
  if(bonus != 0){
    rollData.vBonus = Math.abs(bonus)
    rollFormula += " + @vBonus"
  }

  let rollResult = new Roll(rollFormula, rollData).roll();
  
  let renderedRoll = await rollResult.render();

  let templateContext = {
    name: statName,
    roll: renderedRoll,
    total: rollResult._total
  }

  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    roll: rollResult,
    content: await renderTemplate(messageTemplate, templateContext),
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL
  };

  ChatMessage.create(chatData);
}

async function GetRollOptions(statName){
  const template = "systems/legends/templates/partials/dialog/roll-dialog.hbs";
  const html = await renderTemplate(template, {});

  return new Promise(resolve => {
    const data = {
      title: game.i18n.format("legends.roll.dialog.title", { name: statName }),
      content: html,
      buttons: {
        normal: {
          label: `<i class="fas fa-dice"></i> ${game.i18n.localize("legends.roll.dialog.submit")}`,
          callback: html => resolve(_processRollOptions(html))
        },
        cancel: {
          label: `<i class="fas fa-times"></i> ${game.i18n.localize("legends.dialog.cancel")}`,
          callback: html => resolve({ cancelled: true })
        }
      },
      default: "normal",
      close: () => resolve({ cancelled: true })
    };
    new Dialog(data, { classes: ["dialog", "legends-dialog"] }).render(true);
  });
}

function _processRollOptions(html){
  const form = html[0].querySelector('form');

  return {
    penalty: parseInt(form.penalty.value),
    bonus: parseInt(form.bonus.value)
  }
}