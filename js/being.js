Game.Being = function() {
	this._position = null;
	this._name = "";
	this._speed = 100;
}

Game.Being.prototype.getColor = function() {

}

Game.Being.prototype.getChar = function() {
	
}

Game.Being.prototype.getSpeed = function() {
	return this._speed;
}

Game.Being.prototype.getName = function() {
	return this._name;
}

Game.Being.prototype.setPosition = function(x, y) {
	this._position = (x === null ? null : [x, y]);
	return this;
}

Game.Being.prototype.getPosition = function() {
	return this._position;
	
}

Game.Being.prototype.act = function() {

}

Game.Being.prototype.die = function() {
	Game.removeBeing(this);
}

Game.Being.prototype.directionTo = function(being) {
	var pos1 = this.getPosition();
	var pos2 = being.getPosition();
	var dx = pos2[0]-pos1[0];
	var dy = pos2[1]-pos1[1];
	var dirs = ROT.DIRS[6];
	for (var i=0;i<dirs.length;i++) {
		var dir = dirs[i];
		if (dir[0] == dx && dir[1] == dy) { return i; }
	}
	return null;
}
