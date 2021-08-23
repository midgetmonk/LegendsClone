export default class LegendsItem extends Item {
  chatTemplate = {
    "move": "systems/legends/templates/partials/move-card.hbs",
    "technique": "systems/legends/templates/partials/technique-card.hbs",
    "feature": "systems/legends/templates/partials/feature-card.hbs",
    "moment-of-balance": "systems/legends/templates/partials/moment-card.hbs"
  };

  async roll(){
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker()
    };

    let cardData = {
      ...this.data,
      owner: this.actor.id
    }

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
    chatData.roll = true;
    return ChatMessage.create(chatData);
  }
}