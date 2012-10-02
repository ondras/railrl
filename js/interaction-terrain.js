Game.Interaction.Terrain = function(x, y, callback) {
	this._x = x;
	this._y = y;
	this._callback = callback;
	
	var terrain = Game.terrain.get(x, y);
	var label = this._getLabel(terrain);
	var list = new Game.List(label, this._cancel.bind(this));

	var req = Game.Rules.PRICE_RAIL;
	var railDisabled = null;
	if (!Game.player.hasItems(req)) { railDisabled = req; }

	switch (terrain.type) {
		case Game.Terrain.TYPE_MOUNTAIN:
			list.addItem("Mine ore", this._mine.bind(this));
		break;

		case Game.Terrain.TYPE_WATER:
			var req = Game.Rules.PRICE_BRIDGE;
			var disabled = null;
			if (!Game.player.hasItems(req)) { disabled = req; }
			list.addItem("Build bridge", this._buildBridge.bind(this), disabled);
			list.addItem("Scoop water", this._getWater.bind(this));
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
	Game.createRail(this._x, this._y);
	Game.player.adjustItems(Game.Rules.PRICE_RAIL, -1);
	Game.log("You build a rail section.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._mine = function() {
	Game.terrain.clear(this._x, this._y);
	
	var obj = {};
	var base = Game.Rules.REWARD_MINE;
	for (var p in base) { obj[p] = base[p]; }

	var avail = [Game.ITEM_GEM_RED, Game.ITEM_GEM_BLUE, Game.ITEM_GEM_GREEN, Game.ITEM_GEM_YELLOW];
	for (var i=0;i<avail.length;i++) {
		var item = avail[i];
		if (ROT.RNG.getUniform() > 0.8) {
			obj[item] = 1;
		}
	}
	
	Game.player.adjustItems(obj);
	Game.log("You mine stuff and retrieve %i.", obj);

	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._buildBridge = function() {
	Game.terrain.setBridge(this._x, this._y);
	Game.player.adjustItems(Game.Rules.PRICE_BRIDGE, -1);

	Game.log("You build a robust bridge.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._removeBridge = function() {
	Game.terrain.removeBridge(this._x, this._y);
	Game.log("You destroy a bridge.");
	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._getWater = function() {
	Game.player.adjustItems(Game.Rules.REWARD_GET_WATER);
	Game.log("You scoop some water and get %i.", Game.Rules.REWARD_GET_WATER);

	this._callback(Game.Interaction.RESULT_END_TURN);
}

Game.Interaction.Terrain.prototype._cutTree = function() {
	Game.terrain.clear(this._x, this._y);

	Game.player.adjustItems(Game.Rules.REWARD_CUT_TREE);
	Game.log("You cut down a tree and got %i.", Game.Rules.REWARD_CUT_TREE);
	this._callback(Game.Interaction.RESULT_END_TURN);
}
