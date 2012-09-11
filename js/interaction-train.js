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
	list.addItem("Change orientation", this._swap.bind(this));
	list.addItem("Add car", this._add.bind(this));
	list.addItem("Remove car", this._remove.bind(this), (this._locomotive.getCars().length ? null : "no car available"));
	list.addItem("Adjust speed", this._speed.bind(this));
	list.addItem("Adjust logic", this._logic.bind(this), "not implemented");
	list.show();
}

Game.Interaction.Train.prototype._getLabel = function() {
	var count = this._locomotive.getCars().length;
	var str = "You are looking at a train. There is a locomotive and ";
	str += count + " car" + (count == 1 ? "" : "s") + ". It's current speed is ";
	str += this._locomotive.getSpeed() + ".";
	return str;
}

Game.Interaction.Train.prototype._cancel = function() {
	this._callback(Game.Interaction.RESULT_NOOP);
}

Game.Interaction.Train.prototype._swap = function() {
	var o = this._locomotive.getOrientation();
	this._locomotive.setOrientation((o+3) % 6);
	
	/* reverse cars */
	var all = [this._locomotive].concat(this._locomotive.getCars());
	while (all.length) {
		var first = all.shift();
		if (!all.length) { continue; }
		var second = all.pop();
		
		/* swap first and second */
		var p1 = first.getPosition();
		var p2 = second.getPosition();
		Game.setBeing(p2[0], p2[1], first);
		Game.setBeing(p1[0], p1[1], second);
	}
	
	this._callback(Game.Interaction.RESULT_AGAIN);
}

/**
 * FIXME should adding/removing/swapping result in end turn?
 */
Game.Interaction.Train.prototype._add = function() {
	var car = new Game.Train();
	this._locomotive.addCar(car);
	this._callback(Game.Interaction.RESULT_AGAIN);
}

Game.Interaction.Train.prototype._remove = function() {
	this._locomotive.removeLastCar();
	this._callback(Game.Interaction.RESULT_AGAIN);
}

Game.Interaction.Train.prototype._logic = function() {
}

Game.Interaction.Train.prototype._speed = function() {
	var label = "The train's current speed is " + this._locomotive.getSpeed() + ".";
	var list = new Game.List(label, this._build.bind(this));
	list.addItem("Set speed to slow ("+this._speeds.slow + ")", this._speedSlow.bind(this));
	list.addItem("Set speed to normal ("+this._speeds.normal + ")", this._speedNormal.bind(this));
	list.addItem("Set speed to fast ("+this._speeds.fast + ")", this._speedFast.bind(this));
	list.show();
}

Game.Interaction.Train.prototype._speedSlow = function() {
	this._locomotive.setSpeed(this._speeds.slow);
	this._build();
}

Game.Interaction.Train.prototype._speedNormal = function() {
	this._locomotive.setSpeed(this._speeds.normal);
	this._build();
}

Game.Interaction.Train.prototype._speedFast = function() {
	this._locomotive.setSpeed(this._speeds.fast);
	this._build();
}

