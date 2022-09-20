export default class LegendsJournalSheet extends JournalSheet {
  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      classes: ["sheet journal-sheet journal-entry legends-journal-sheet"]
    });
  }
}
