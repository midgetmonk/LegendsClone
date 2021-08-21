export async function RollStat({
  statValue = null,
  statName = null
} = {}){
  const messageTemplate = "systems/legends/templates/partials/stat-roll.hbs";
  let rollData = {
    stat: statValue
  }
  let rollFormula = "2d6 + @stat";
  let rollResult = new Roll(rollFormula, rollData).roll();
  
  let renderedRoll = await rollResult.render();

  let templateContext = {
    name: game.i18n.localize(`legends.stats.${statName}`),
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