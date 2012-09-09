/**
 * @class Interaction
 * @param {int} x
 * @param {int} y
 * @param {function} callback Interaction end notification
 *   Being: attack?
 *   Train: direction, add/remove car, adjust logic, paint, name
 *   Rail: remove rail, paint, add train
 *   Tree: cut down
 *   Water: create paint
 *   Mountain: mine
 *   Empty: build rail
 */
Game.Interaction = function(x, y, callback) {
	var key = x+","+y;
	
	if (Game.beings[key]) {			/* being/train */
		var being = Game.beings[key];
		if (being instanceof Game.Train) {
			var locomotive = being.getLocomotive();
			new Game.Interaction.Train(locomotive, callback);
		} else {
			new Game.Interaction.Being(being, callback);
		}
	} else {	/* terrain (possibly with rail) */
		new Game.Interaction.Terrain(x, y, callback);
	}
}
