Game.Interaction.Player = function(callback) {
	this._callback = callback;
	
	var label = this._getLabel();
	var list = new Game.List(label, this._cancel.bind(this));
	list.addItem("Save game", this._save.bind(this), "not implemented");
	list.addItem("Load game", this._load.bind(this), "not implemented");
	list.show();
}

Game.Interaction.Player.prototype._getLabel = function() {
	return "This is yourself, a brave adventurer!";
	/* FIXME naimplementovat */
}

Game.Interaction.Player.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Player.prototype._save = function() {

}

Game.Interaction.Player.prototype._load = function() {
	
}
