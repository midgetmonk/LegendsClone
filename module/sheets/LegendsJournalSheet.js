export default class LegendsJournalSheet extends JournalSheet {
  static get defaultOptions(){
    let classes = ["sheet journal-sheet journal-entry legends-journal-sheet"];
    classes.push(game.settings.get("legends", "sheetColour"));
    return mergeObject(super.defaultOptions, {
      classes: classes
    });
  }
}
