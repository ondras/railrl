Game.Train.Locomotive = function() {
	Game.Train.call(this);
	this._cars = [];
	this._locomotive = this;
	this._orientation = 2; /* ROT.DIRS[6] */
}
Game.Train.Locomotive.extend(Game.Train);

/**
 * @returns {bool} Was successfully added?
 */
Game.Train.Locomotive.prototype.addCar = function(train) {
	/* find position for the new car */

	/* 1. direction */
	var direction = (this._orientation+3)%6;
	if (this._cars.length) { /* compute direction from two last cars */
		var c2 = this._cars[this._cars.length-1];
		var c1 = (this._cars.length > 1 ? this._cars[this._cars.length-2] : this);
		var pos2 = c2.getPosition();
		var pos1 = c1.getPosition();
		var dx = pos2[0]-pos1[0];
		var dy = pos2[1]-pos1[1];
		var dirs = ROT.DIRS[6];
		for (var i=0;i<dirs.length;i++) {
			var dir = dirs[i];
			if (dir[0] == dx && dir[1] == dy) { direction = i; }
		}
	}

	/* 2. current last car */
	var lastCar = (this._cars.length ? this._cars[this._cars.length-1] : this);
	var lastPosition = lastCar.getPosition();

	/* 3. empty rail? */
	if (!this._isSuitable(lastPosition[0], lastPosition[1], direction)) {
		var options = [];
		var left = this._isSuitable(lastPosition[0], lastPosition[1], (direction+5) % 6);
		var right = this._isSuitable(lastPosition[0], lastPosition[1], (direction+1) % 6);
		if (left) { options.push((direction+5)%6); }
		if (right) { options.push((direction+1)%6); }
		if (!options.length) { return false; } /* nowhere to move */
		direction = options.random();
	}

	/* 4. add the new car */
	var d = ROT.DIRS[6][direction];
	Game.setBeing(lastPosition[0] + d[0], lastPosition[1] + d[1], train);
	this._cars.push(train);
	train.setLocomotive(this);
	train.setColor(this._color);

}

Game.Train.Locomotive.prototype.getCars = function() {
	return this._cars;
}

Game.Train.Locomotive.prototype.removeLastCar = function() {
	var car = this._cars.pop();
	car.setLocomotive(null);
	Game.removeBeing(null, null);
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
	var moved = this._move();
	if (!moved) { return; }
	
	for (var i=0;i<this._cars.length;i++) {
		var car = this._cars[i];
		var carPosition = car.getPosition();
		Game.setBeing(oldX, oldY, car);
		oldX = carPosition[0];
		oldY = carPosition[1];
	}
}

/**
 * @returns {bool} Moved?
 */
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
	if (being instanceof Game.Train) { return false; } /* another train there */

	/* destroy previous being */
	if (being) { being.die(); }

	Game.setBeing(tx, ty, this);
	return true;
}

/**
 * @param {int} dir Direction constant
 */
Game.Train.Locomotive.prototype._isRailAtDir = function(dir) {
	var d = ROT.DIRS[6][dir];
	var tx = this._position[0] + d[0];
	var ty = this._position[1] + d[1];
	var key = tx+","+ty;
	return !!Game.rail[key];
}

Game.Train.Locomotive.prototype._isSuitable = function(x, y, dir) {
	var d = ROT.DIRS[6][dir];
	var tx = x + d[0];
	var ty = y + d[1];
	var key = tx+","+ty;
	if (!Game.rail[key]) { return false; }
	if (Game.beings[key]) { return false; }
	return true;
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
