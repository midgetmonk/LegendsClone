export default async function preloadHandlebarsTemplates(){
  const templatePaths = [
    "systems/legends/templates/partials/description-editor.hbs",
    "systems/legends/templates/partials/move-card.hbs",
    "systems/legends/templates/partials/condition-card.hbs",
    "systems/legends/templates/partials/technique-card.hbs",
    "systems/legends/templates/partials/labelled-input.hbs",
    "systems/legends/templates/partials/npc-principle-card.hbs",
    "systems/legends/templates/sheets/actors/_balance.hbs",
    "systems/legends/templates/sheets/actors/_fatigue.hbs",
    "systems/legends/templates/sheets/actors/_stats.hbs",
    "systems/legends/templates/sheets/actors/_trainings.hbs",
    "templates/dice/roll.html"
  ];

  return loadTemplates(templatePaths);
};
