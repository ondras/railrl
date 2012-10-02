Game.Interaction.Rail = function(x, y, callback) {
	this._x = x;
	this._y = y;
	this._callback = callback;

	this._build();
}

Game.Interaction.Rail.prototype._build = function() {
	var label = this._getLabel();
	var list = new Game.List(label, this._cancel.bind(this));

	var req = Game.Rules.PRICE_PAINT_RAIL;
	var disabled = null;
	if (!Game.player.hasItems(req)) { disabled = req; }
	list.addItem("Adjust color", this._color.bind(this), req);

	list.addItem("Remove rail", this._removeRail.bind(this));
	
	var req = Game.Rules.PRICE_TRAIN;
	var disabled = null;
	if (!Game.player.hasItems(req)) { disabled = req; }
	list.addItem("Add new train", this._addTrain.bind(this), disabled);
	
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
	Game.setBeing(this._x, this._y, train);
	
	Game.player.adjustItems(Game.Rules.PRICE_TRAIN, -1);

	/* orientation towards an empty rail */
	var dirs = ROT.DIRS[6];
	for (var i=0;i<dirs.length;i++) {
		var dir = dirs[i];
		var x = this._x + dir[0];
		var y = this._y + dir[1];
		var key = x+","+y;
		if (Game.rail[key] && !Game.beings[key]) {
			train.setOrientation(i);
			break;
		}
	}

	Game.engine.addActor(train);
	this._callback(Game.Interaction.RESULT_AGAIN);
}

Game.Interaction.Rail.prototype._color = function() {
	var label = "Paint the railway track:";
	var list = new Game.List(label, this._build.bind(this));

	list.addItem("Default", this._colorChange.bind(this));

	var str = "<span style='color:#0f0'>Green</span>";
	list.addItem(str, this._colorChange.bind(this, Game.ITEM_GEM_GREEN));

	var str = "<span style='color:#ff0'>Yellow</span>";
	list.addItem(str, this._colorChange.bind(this, Game.ITEM_GEM_YELLOW));

	list.show();
}

Game.Interaction.Rail.prototype._colorChange = function(color) {
	Game.setRail(this._x, this._y, color)

	Game.player.adjustItems(Game.Rules.PRICE_PAINT_RAIL, -1);
	Game.log("You paint the railway track.");

	this._build();
}
