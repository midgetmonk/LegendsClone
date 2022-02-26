import * as Dice from './dice.js';

/**
 * Catch interactions with Chat messages
 * @param {Text} html 
 */
export function addChatListeners(html){
  html.on('click', '.move-roll', onMoveRoll);
}

/**
 * Roll a stat from a chat-based Move card
 * @param {Event} event 
 */
function onMoveRoll(event){
  const card = event.currentTarget;
  let character = game.user.character;
  if(character === undefined){
    let message = game.i18n.localize('legends.roll.no-actor')
    ui.notifications.error(message);
    return;
  }
  let moveName = card.dataset.moveName;
  let statName = card.dataset.statName;
  let statValue = character.data.data.stats[statName]

  Dice.RollStat({
    statValue: statValue,
    statName: statName,
    moveName: moveName
  });
}
