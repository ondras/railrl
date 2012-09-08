Game.Train = function() {
	Game.Being.call(this);

	this._orientation = 2; /* ROT.DIRS[6] */
	this._locomotive = null;
	this._color = "#ccc";

	this._keys = {};
	this._keys[103]	= 0; /* top left */
	this._keys[105]	= 1; /* top right */
	this._keys[102]	= 2; /* right */
	this._keys[99]	= 3; /* bottom right */
	this._keys[97]	= 4; /* bottom left */
	this._keys[100]	= 5; /* left */
}
Game.Train.extend(Game.Being);

Game.Train.prototype.setOrientation = function(orientation) {
	this._orientation = orientation;
	return this;
}

Game.Train.prototype.setLocomotive = function(locomotive) {
	this._locomotive = locomotive;
	return this;
}

Game.Train.prototype.getLocomotive = function() {
	return this._locomotive;
}

Game.Train.prototype.setColor = function(color) {
	this._color = color;
	if (this._position) { Game.display.draw(this._position[0], this._position[1]); }
	return this;
}

Game.Train.prototype.move = function() {
	var o = this._orientation;

	/* is there a good target rail? */
	var dir = ROT.DIRS[6][o];
	var tx = this._position[0] + dir[0];
	var ty = this._position[1] + dir[1];
	var key = tx+","+ty;

	var being = Game.beings[key];
	if (being instanceof Game.Train) { return; } /* another train there */

	var target = Game.rail[key];
	if (!target) { return; } /* no rail */

	var opposite = (this._orientation + 3) % 6;
	if (!(target & Game.Rail.DIRS[opposite])) { return; } /* no rail in our direction */

	/* destroy previous being */
	if (being) { being.die(); }

	Game.setBeing(tx, ty, this);

	/* adjust orientation if necessary */
	if (!(target & Game.Rail.DIRS[o])) { /* FIXME logic */
		var options = [];
		var left = (target & Game.Rail.DIRS[(o+5) % 6]);
		var right = (target & Game.Rail.DIRS[(o+1) % 6]);
		if (left) { options.push((o+5)%6); }
		if (right) { options.push((o+1)%6); }
		this._orientation = options.random();
	}

}

Game.Train.prototype.getChar = function() {
	return "o";
}

Game.Train.prototype.getColor = function() {
	return this._color;
}
