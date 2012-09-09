Game.Train = function() {
	Game.Being.call(this);

	this._locomotive = null;
	this._color = "#ccc";
}
Game.Train.extend(Game.Being);

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

Game.Train.prototype.getChar = function() {
	return "o";
}

Game.Train.prototype.getColor = function() {
	return this._color;
}
