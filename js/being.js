Game.Being = function() {
	this._position = null;
}

Game.Being.prototype.getColor = function() {

}

Game.Being.prototype.getChar = function() {
	
}

Game.Being.prototype.getSpeed = function() {
	return 100;
}

Game.Being.prototype.setPosition = function(x, y) {
	this._position = [x, y];
}

Game.Being.prototype.getPosition = function() {
	return this._position;
	
}

Game.Being.prototype.act = function() {

}
