Game.Train.Locomotive = function() {
	Game.Train.call(this);
	this._cars = [];
	this._locomotive = this;
	this._orientation = 2; /* ROT.DIRS[6] */
}
Game.Train.Locomotive.extend(Game.Train);

Game.Train.Locomotive.prototype.addCar = function(train) {
	/* FIXME find position + orientation */
	this._cars.push(train);
	train.setLocomotive(this);
}

Game.Train.Locomotive.prototype.getCars = function() {
	return this._cars;
}

Game.Train.Locomotive.prototype.removeLastCar = function() {
	var car = this._cars.pop();
	car.setLocomotive(null);
	Game.setBeing(null, null, car);
}

Game.Train.Locomotive.prototype.setOrientation = function(orientation) {
	this._orientation = orientation;
	return this;
}

Game.Train.Locomotive.prototype.getOrientation = function() {
	return this._orientation;
}

Game.Train.Locomotive.prototype.act = function() {
	var oldX = this._position[0];
	var oldY = this._position[1];
	this._move();
	
	for (var i=0;i<this._cars.length;i++) {
		var car = this._cars[i];
		var carPosition = car.getPosition();
		Game.setBeing(oldX, oldY, car);
		oldX = carPosition[0];
		oldY = carPosition[1];
	}
}

Game.Train.Locomotive.prototype._move = function() {
	var o = this._orientation;

	/* is there a good target rail? */
	if (!this._isRailAtDir(o)) { /* no rail ahead, try turning */ 
		var options = [];
		var left = this._isRailAtDir((o+5) % 6);
		var right = this._isRailAtDir((o+1) % 6);
		if (left) { options.push((o+5)%6); }
		if (right) { options.push((o+1)%6); }
		if (!options.length) { return; } /* nowhere to move */
		this._orientation = o = options.random();
	}

	/* orientation fixed */
	var d = ROT.DIRS[6][o];
	var tx = this._position[0] + d[0];
	var ty = this._position[1] + d[1];
	var key = tx+","+ty;

	var being = Game.beings[key];
	if (being instanceof Game.Train) { return; } /* another train there */

	/* destroy previous being */
	if (being) { being.die(); }

	Game.setBeing(tx, ty, this);
}


Game.Train.Locomotive.prototype._isRailAtDir = function(dir) {
	var d = ROT.DIRS[6][dir];
	var tx = this._position[0] + d[0];
	var ty = this._position[1] + d[1];
	var key = tx+","+ty;
	return !!Game.rail[key];
}

Game.Train.Locomotive.prototype.setColor = function(color) {
	Game.Train.prototype.setColor.call(this, color);
	for (var i=0;i<this._cars.length;i++) {
		this._cars[i].setColor(color);
	}
}

Game.Train.Locomotive.prototype.getChar = function() {
	return "O";
}
