export default async function preloadHandlebarsTemplates(){
  const templatePaths = [
    "systems/legends/templates/partials/description-editor.hbs",
    "systems/legends/templates/partials/move-card.hbs",
    "systems/legends/templates/partials/condition-card.hbs",
    "systems/legends/templates/partials/technique-card.hbs",
    "systems/legends/templates/partials/labelled-input.hbs",
    "templates/dice/roll.html"
  ];

  return loadTemplates(templatePaths);
};