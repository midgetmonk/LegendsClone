export default class LegendsItem extends Item {
  chatTemplate = {
    "move": "systems/legends/templates/partials/chat/move.hbs",
    "technique": "systems/legends/templates/partials/technique-card.hbs",
    "feature": "systems/legends/templates/partials/feature-card.hbs",
    "moment-of-balance": "systems/legends/templates/partials/moment-card.hbs",
    "condition": "systems/legends/templates/partials/condition-card.hbs",
    "status": "systems/legends/templates/partials/condition-card.hbs"
  };

  /**
   * Send an Item to the chat
   * @param {Boolean} npc If this represents an NPC's Item
   * @returns ChatMessage#create
   */
  async roll(npc = false){
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker()
    };

    let owner_id = (this.actor != undefined ? this.actor.id : null)

    let cardData = {
      name: this.name,
      system: { ...this.system },
      owner: owner_id,
      npc: npc
    }
    
    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
    return ChatMessage.create(chatData);
  }

  _preCreate(data, _options, _userId){
    const img = CONFIG.legends.defaultTokens[data.type];
    this.updateSource({ img: img });
  }
}
