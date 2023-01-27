export default class LegendsCampaignActorSheet extends ActorSheet {
  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      width: 650,
      height: 550,
      tabs: [{
        navSelector: ".tabs",
        contentSelector: ".body",
        initial: "main"
      }]
    });
  }

  get template(){
    return `systems/legends/templates/sheets/actors/${this.actor.type}-sheet.hbs`;
  };

  async _onDropItemCreate(_itemData) {
    ui.notifications.error(game.i18n.format('legends.items.not-allowed'));
    return null;
  }

  getData(){
    const context = super.getData();
    context.config = CONFIG.legends;
    context.cssClass = game.settings.get("legends", "sheetColour") || "default";
    return context;
  }

  activateListeners(html) {
    if(this.isEditable){
      // Listener bindings go here
    }

    super.activateListeners(html);
  }

  /**
   * Toggle the content drawer for a move or technique
   * @param {Event} event 
   */
  _onToggleCollapsible(event){
    event.preventDefault();

    let element = event.currentTarget;
    let drawer = $(element.closest('.item')).find('.drawer');
    drawer.slideToggle();
  }
};
