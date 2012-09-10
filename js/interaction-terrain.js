Game.Interaction.Terrain = function(x, y, callback) {
	this._x = x;
	this._y = y;
	this._callback = callback;
	
	var list = new Game.List(this._cancel.bind(this));
	list.addItem("Build rail", this._buildRail.bind(this));
	list.show();
}

Game.Interaction.Terrain.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Terrain.prototype._buildRail = function() {
	Game.setRail(this._x, this._y);
	this._callback(Game.Interaction.RESULT_END_TURN);
}
