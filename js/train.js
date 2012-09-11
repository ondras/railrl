Game.Train = function() {
	Game.Being.call(this);

	this._locomotive = null;
	this._color = Game.Train.COLORS.gray;
}
Game.Train.extend(Game.Being);

Game.Train.COLORS = {
	gray: "#999",
	red: "#f00",
	green: "#0f0",
	blue: "#00f",
	yellow: "#ff0",
	cyan: "#0ff",
	magenta: "#f0f",
	white: "#fff"
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

Game.Train.prototype.getChar = function() {
	return "o";
}

Game.Train.prototype.getColor = function() {
	return this._color;
}
