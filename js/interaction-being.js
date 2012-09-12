Game.Interaction.Being = function(being, callback) {
	this._locomotive = locomotive;
	this._callback = callback;
	
	var label = this._getLabel();
	var list = new Game.List(label, this._cancel.bind(this));
	list.show();
}

Game.Interaction.Being.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}
