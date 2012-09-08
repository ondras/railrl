/**
 * @class Interaction
 * @param {int} x
 * @param {int} y
 * @param {function} callback Interaction end notification
 *   Being: attack?
 *   Train: direction, add/remove car, adjust logic, paint
 *   Rail: change type, remove rail, paint, add train
 *   Tree: cut down
 *   Water: create paint
 *   Mountain: mine
 *   Empty: build rail
 */
Game.Interaction = function(x, y, callback) {
	this._callback = callback;
	
	var key = x+","+y;
	
	
	if (Game.beings[key]) {			/* being/train */
		
	} else if (Game.rail[key]) {	/* rail */
	} else { /* terrain */
		
	}
	
	
	var list = new Game.List(this._cancel.bind(this));
	list.show();
}

Game.Interaction.prototype._cancel = function() {
	this._callback(false);
}
