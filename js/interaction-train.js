Game.Interaction.Train = function(locomotive, callback) {
	this._locomotive = locomotive;
	this._callback = callback;
	
	this._speeds = {
		slow: 75,
		normal: 100,
		fast: 150
	}
	
	this._build();
}

Game.Interaction.Train.prototype._build = function() {
	var label = this._getLabel();
	var list = new Game.List(label, this._cancel.bind(this));
	list.addItem("Change orientation", this._reverse.bind(this));

	var req = Game.Rules.PRICE_TRAIN;
	var disabled = null;
	if (!Game.player.hasItems(req)) { disabled = req; }
	list.addItem("Add car", this._addCar.bind(this), disabled);

	if (this._locomotive.getCars().length) {
		list.addItem("Remove car", this._removeCar.bind(this));
	} else {
		list.addItem("Destroy train", this._removeTrain.bind(this));
	}

	var req = Game.Rules.PRICE_PAINT_TRAIN;
	var disabled = null;
	if (!Game.player.hasItems(req)) { disabled = req; }
	list.addItem("Adjust color", this._color.bind(this), disabled);

	list.addItem("Adjust speed", this._speed.bind(this));

	list.addItem("Adjust logic", this._logic.bind(this), "not implemented");
	list.show();
}

Game.Interaction.Train.prototype._getLabel = function() {
	var orientation = this._locomotive.getOrientation();
	var labels = {};
	labels[0] = "north-west";
	labels[1] = "north-east";
	labels[2] = "east";
	labels[3] = "south-east";
	labels[4] = "south-west";
	labels[5] = "west";

	var count = this._locomotive.getCars().length + 1;
	var str = "You are looking at a train ("+count+" vehicle" + (count > 1 ? "s" : "") + "). ";
	str += " It is currently oriented towards " + labels[orientation] + ".";
	str += " It's current speed is ";
	str += this._locomotive.getSpeed() + ".";
	return str;
}

Game.Interaction.Train.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Train.prototype._reverse = function() {
	this._locomotive.reverse();
		
	Game.log("You change the train's orientation.");
	this._callback(Game.Interaction.RESULT_AGAIN);
}

/**
 * FIXME should adding/removing/swapping result in end turn?
 */
Game.Interaction.Train.prototype._addCar = function() {
	var car = new Game.Train();
	var result = this._locomotive.addCar(car);

	if (result) {
		Game.player.adjustItems(Game.Rules.PRICE_TRAIN, -1);
		Game.log("You construct and add a new car.");
	} else {
		Game.log("It is not possible to add a new car.");
	}
	this._callback(Game.Interaction.RESULT_AGAIN);
}

Game.Interaction.Train.prototype._removeCar = function() {
	this._locomotive.removeLastCar();
	Game.log("You remove the last train car.");
	this._callback(Game.Interaction.RESULT_AGAIN);
}

Game.Interaction.Train.prototype._removeTrain = function() {
	Game.removeBeing(this._locomotive);
	Game.engine.removeActor(this._locomotive);
	Game.log("You destroy the remaining locomotive.");
	this._callback(Game.Interaction.RESULT_AGAIN);
}

Game.Interaction.Train.prototype._logic = function() {
}

Game.Interaction.Train.prototype._color = function() {
	var label = "Paint the train:";
	var list = new Game.List(label, this._build.bind(this));
	for (var name in Game.Train.COLORS) {
		var color = Game.Train.COLORS[name];
		var str = "<span style='color:" + color + "'>" + name + "</span>";
		list.addItem(str, this._colorChange.bind(this, color));
	}
	list.show();
}

Game.Interaction.Train.prototype._colorChange = function(color) {
	this._locomotive.setColor(color);

	Game.player.adjustItem(Game.ITEM_WATER, -1);
	Game.log("You paint the train.");

	this._build();
}

Game.Interaction.Train.prototype._speed = function() {
	var label = "The train's current speed is " + this._locomotive.getSpeed() + ".";
	var list = new Game.List(label, this._build.bind(this));
	list.addItem("Set speed to slow ("+this._speeds.slow + ")", this._speedChange.bind(this, this._speeds.slow));
	list.addItem("Set speed to normal ("+this._speeds.normal + ")", this._speedChange.bind(this, this._speeds.normal));
	list.addItem("Set speed to fast ("+this._speeds.fast + ")", this._speedChange.bind(this, this._speeds.fast));
	list.show();
}

Game.Interaction.Train.prototype._speedChange = function(speed) {
	this._locomotive.setSpeed(speed);
	this._build();
}


