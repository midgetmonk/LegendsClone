export async function RollStat({
  statValue = null
} = {}){
  const messageTemplate = "systems/legends/templates/partials/stat-roll.hbs";
  let rollData = {
    stat: statValue
  }
  let rollFormula = "2d6 + @stat";
  let rollResult = new Roll (rollFormula, rollData).roll();
  let renderedRoll = await rollResult.render({ template: messageTemplate });

  
  let messageData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: renderedRoll
  };

  rollResult.toMessage(messageData);
}