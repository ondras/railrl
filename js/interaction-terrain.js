Game.Interaction.Terrain = function(x, y, callback) {
	this._x = x;
	this._y = y;
	this._callback = callback;
	
	var list = new Game.List(this._cancel.bind(this));

	var terrain = Game.terrain.get(x, y);
	switch (terrain.type) {
		case Game.Terrain.TYPE_MOUNTAIN:
			list.addItem("Mine ore", this._mine.bind(this));
		break;

		case Game.Terrain.TYPE_WATER:
			list.addItem("Build bridge", this._buildBridge.bind(this)); /* FIXME wood needed */
		break;

		case Game.Terrain.TYPE_BRIDGE:
			list.addItem("Build rail", this._buildRail.bind(this));
			list.addItem("Destroy bridge", this._removeBridge.bind(this)); /* FIXME wood needed */
		break;

		case Game.Terrain.TYPE_FOREST:
			list.addItem("Cut down a tree", this._cutTree.bind(this));
		break;

		case Game.Terrain.TYPE_LAND:
			list.addItem("Build rail", this._buildRail.bind(this));
		break;

	}
	list.show();
}

Game.Interaction.Terrain.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Terrain.prototype._buildRail = function() {
	Game.setRail(this._x, this._y);
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._mine = function() {
	/* FIXME mine stuff */
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._buildBridge = function() {
	Game.terrain.setBridge(this._x, this._y);
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._removeBridge = function() {
	Game.terrain.removeBridge(this._x, this._y);
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._cutTree = function() {
	Game.terrain.cutTree(this._x, this._y); /* FIXME add wood */
	this._callback(Game.Interaction.RESULT_END_TURN);
}
