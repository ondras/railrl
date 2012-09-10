Game.Interaction.Rail = function(x, y, callback) {
	this._x = x;
	this._y = y;
	this._callback = callback;
	
	var list = new Game.List(this._cancel.bind(this));
	list.addItem("Remove rail", this._removeRail.bind(this));
	list.show();
}

Game.Interaction.Rail.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Rail.prototype._removeRail = function() {
	Game.removeRail(this._x, this._y);
	this._callback(Game.Interaction.RESULT_END_TURN);
}
