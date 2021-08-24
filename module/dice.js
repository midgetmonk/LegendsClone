export async function RollStat({
  statValue = null,
  statName = null
} = {}){
  const messageTemplate = "systems/legends/templates/partials/stat-roll.hbs";

  let neg = statValue < 0;
  let abs_stat = Math.abs(statValue);

  let rollData = {
    operator: (neg ? '-' : '+'),
    stat: abs_stat
  }

  let rollFormula = "2d6 @operator @stat";
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