/**
 * Roll a stat with the given statValue, and render it
 * in the Chat with the statName (and moveName, if
 * provided.)
 * @param {Object} param0 
 * @returns 
 */
export async function RollStat({
  statValue = null,
  statName = null,
  moveName = null
} = {}){
  // Fetch the bonus/penalty values from the dialog
  let rollOptions = await GetRollOptions(statName, moveName);

  // Don't bother continuing if the roll was cancelled.
  if(rollOptions.cancelled){ return; }

  // Set up the default roll values
  let neg = statValue < 0;
  let abs_stat = Math.abs(statValue);

  let rollData = {
    oStat: (neg ? '-' : '+'),
    vStat: abs_stat
  }

  // Basic roll formula
  let rollFormula = "2d6 @oStat @vStat";

  // If a non-zero bonus was set
  let bonus = rollOptions.bonus;
  if(bonus != 0){
    rollData.vBonus = Math.abs(bonus); // Ignore negatives
    rollFormula += " + @vBonus"; // Always add
  }

  // If a non-zero penalty was set
  let penalty = rollOptions.penalty;
  if(penalty != 0){
    rollData.vPenalty = Math.abs(penalty); // Ignore negatives
    rollFormula += " - @vPenalty"; // Always subtract
  }

  // Roll the dice and render the result
  let roll = new Roll(rollFormula, rollData);
  let rollResult = await roll.roll();
  let renderedRoll = await rollResult.render();

  // Setup the roll template
  const messageTemplate = "systems/legends/templates/partials/chat/stat-roll.hbs";
  let templateContext = {
    name: statName,
    move: moveName,
    roll: renderedRoll,
    total: rollResult._total
  }

  // Setup the chat message
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    roll: rollResult,
    content: await renderTemplate(messageTemplate, templateContext),
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL
  };

  return ChatMessage.create(chatData);
}

/**
 * Display a Dialog to collect roll options (bonuses, penalties, etc.)
 * @param {String} statName The name of the Stat being rolled
 * @returns A Promise representing the Dialog to be displayed
 */
async function GetRollOptions(statName, moveName = null){
  const template = "systems/legends/templates/partials/dialog/roll-dialog.hbs";
  const html = await renderTemplate(template, {});
  let title = (statName !== null) ? game.i18n.format("legends.roll.stat", { stat: statName }) : game.i18n.format('legends.roll.no-stat');

  if(moveName !== null){
    title = `${title} (${moveName})`
  }

  return new Promise(resolve => {
    const data = {
      title: title,
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

/**
 * A callback to parse and format the values returned from the dialog
 * @param {String} html The HTML returned from the form
 * @returns A hash of the relevant values from the form.
 */
function _processRollOptions(html){
  const form = html[0].querySelector('form');

  return {
    penalty: parseInt(form.penalty.value),
    bonus: parseInt(form.bonus.value)
  }
}
