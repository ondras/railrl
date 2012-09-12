Game.Interaction.Terrain = function(x, y, callback) {
	this._x = x;
	this._y = y;
	this._callback = callback;
	
	var terrain = Game.terrain.get(x, y);
	var label = this._getLabel(terrain);
	var list = new Game.List(label, this._cancel.bind(this));

	var railDisabled = [];
	var wood = Game.player.getItem(Game.ITEM_WOOD);
	var iron = Game.player.getItem(Game.ITEM_IRON);
	if (!wood) { railDisabled.push("wood"); }
	if (!iron) { railDisabled.push("iron"); }
	railDisabled = (railDisabled.length ? railDisabled.join(" &amp; ") + " needed" : null);

	switch (terrain.type) {
		case Game.Terrain.TYPE_MOUNTAIN:
			list.addItem("Mine ore", this._mine.bind(this));
		break;

		case Game.Terrain.TYPE_WATER:
			var disabled = (Game.player.getItem(Game.ITEM_WOOD) > 0 ? null : "wood needed");
			list.addItem("Build bridge", this._buildBridge.bind(this), disabled);
			list.addItem("Get water", this._getWater.bind(this));
		break;

		case Game.Terrain.TYPE_BRIDGE:
			list.addItem("Build rail", this._buildRail.bind(this), railDisabled);
			list.addItem("Destroy bridge", this._removeBridge.bind(this));
		break;

		case Game.Terrain.TYPE_FOREST:
			list.addItem("Cut down a tree", this._cutTree.bind(this));
		break;

		case Game.Terrain.TYPE_LAND:
			list.addItem("Build rail", this._buildRail.bind(this), railDisabled);
		break;
	}
	list.show();
}

Game.Interaction.Terrain.prototype._getLabel = function(terrain) {
	var str = "You are looking at ";
	switch (terrain.type) {
		case Game.Terrain.TYPE_MOUNTAIN:
			str += "a mountain range. It may contain valuable ores as well as precious gems.";
		break;

		case Game.Terrain.TYPE_WATER:
			str += "a flowing water. Neither you nor trains may pass it.";
		break;

		case Game.Terrain.TYPE_BRIDGE:
			str += "a bridge. Water flows below.";
		break;

		case Game.Terrain.TYPE_FOREST:
			str += "a beautiful tree.";
		break;

		case Game.Terrain.TYPE_LAND:
			str += "a piece of plain land.";
		break;
	}

	return str;
}

Game.Interaction.Terrain.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Terrain.prototype._buildRail = function() {
	Game.setRail(this._x, this._y);
	Game.player.adjustItem(Game.ITEM_WOOD, -1);
	Game.player.adjustItem(Game.ITEM_IRON, -1);
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._mine = function() {
	var amount = 2;
	Game.player.adjustItem(Game.ITEM_IRON, amount);
	Game.log("You mine " + amount + " pieces of iron.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._buildBridge = function() {
	Game.terrain.setBridge(this._x, this._y);
	Game.player.adjustItem(Game.ITEM_WOOD, -1);
	Game.log("You build a robust bridge.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._removeBridge = function() {
	Game.terrain.removeBridge(this._x, this._y);
	Game.log("You destroy a bridge.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._getWater = function() {
	var amount = 1;
	Game.player.adjustItem(Game.ITEM_WATER, amount);
	Game.log("You got " + amount + " piece of water.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._cutTree = function() {
	Game.terrain.cutTree(this._x, this._y);

	var amount = 2;
	Game.player.adjustItem(Game.ITEM_WOOD, amount);
	Game.log("You cut down a tree and got " + amount + " pieces of wood.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}
