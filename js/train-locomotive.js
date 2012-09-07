Game.Train.Locomotive = function() {
	Game.Train.call(this);
	this._cars = [];
	this._locomotive = this;
}
Game.Train.Locomotive.extend(Game.Train);

Game.Train.Locomotive.prototype.addCar = function(train) {
	/* FIXME find position + orientation */
	this._cars.push(train);
}

Game.Train.Locomotive.prototype.act = function() {
	Game.Train.prototype.act.call(this);
	for (var i=0;i<this._cars.length;i++) {
		this._cars[i].act();
	}
}

Game.Train.Locomotive.prototype.setColor = function(color) {
	Game.Train.prototype.setColor.call(this, color);
	for (var i=0;i<this._cars.length;i++) {
		this._cars[i].setColor(color);
	}
}

Game.Train.Locomotive.prototype.getChar = function() {
	return "T";
}
