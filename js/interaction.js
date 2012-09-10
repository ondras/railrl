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
	this._x = x;
	this._y = y;
	this._callback = callback;

	this._build();
}

Game.Interaction.prototype._build = function() {
	var key = this._x+","+this._y;
	var result = this._result.bind(this);
	
	if (Game.beings[key]) {			/* being/train */
		var being = Game.beings[key];
		if (being instanceof Game.Train) {
			var locomotive = being.getLocomotive();
			new Game.Interaction.Train(locomotive, result);
		} else {
			new Game.Interaction.Being(being, result);
		}
	} else {	/* terrain (possibly with rail) */
		if (Game.rail[key]) {
			new Game.Interaction.Rail(this._x, this._y, result);
		} else {
			new Game.Interaction.Terrain(this._x, this._y, result);
		}
	}

}

Game.Interaction.prototype._result = function(result) {
	switch (result) {
		case Game.Interaction.RESULT_NOOP:
			this._callback(false);
		break;

		case Game.Interaction.RESULT_END_TURN:
			this._callback(true);
		break;

		case Game.Interaction.RESULT_AGAIN:
			this._build();
		break;
	}
}

Game.Interaction.RESULT_NOOP		= 0;
Game.Interaction.RESULT_END_TURN	= 1;
Game.Interaction.RESULT_AGAIN		= 2;
