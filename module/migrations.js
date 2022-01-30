/**
 * Run all migrations
 */
export async function migrateWorld() {
  console.log("legends | Migration script called");

  // Move migrations
  migrateMoves();
}

/**
 * Update all moves
 */
async function migrateMoves() {
  // Update world moves
  let moves = game.items.contents.filter(item => {
    return item.data.type == "move"
  });
  moves.forEach((move) => { migrateMove(move) });

  // Update world actor moves
  game.actors.contents.filter(actor => {
    return actor.data.type == "player"
  }).forEach((actor) => {
    let actorMoves = actor.items.contents.filter(item => {
      return item.data.type == 'move'
    });

    if(actorMoves.length > 0){
      console.log("legends | Migrating moves for actor " + actor.id)
      actorMoves.forEach((move) => {
        migrateMove(move);
      });
    }
  });
}

/**
 * Update a single Move item
 * @param {Item} move The Item representing the Move to update
 */
async function migrateMove(move){
  console.log("legends | Migrating Move " + move.id);
  let rollable = move.data.data.rollable;
  let rollStat = move.data.data.rollStat;

  if(rollStat && !rollable){
    move.update({
      data: {
        rollable: true
      }
    });
  }
}
