Game.Interaction.Rail = function(x, y, callback) {
	this._x = x;
	this._y = y;
	this._callback = callback;
	
	var label = this._getLabel();
	var list = new Game.List(label, this._cancel.bind(this));
	list.addItem("Remove rail", this._removeRail.bind(this));
	list.addItem("Add new train", this._addTrain.bind(this));
	list.show();
}

Game.Interaction.Rail.prototype._getLabel = function() {
	var str = "You are looking at a rail section. This is a suitable place for a new train.";
	return str;
}

Game.Interaction.Rail.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Rail.prototype._removeRail = function() {
	Game.removeRail(this._x, this._y);
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Rail.prototype._addTrain = function() {
	var train = new Game.Train.Locomotive();
	/* FIXME orientation */
	Game.setBeing(this._x, this._y, train);
	Game.engine.addActor(train);
	this._callback(Game.Interaction.RESULT_AGAIN);
}
