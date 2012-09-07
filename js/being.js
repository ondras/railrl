var Being = function() {
	this._position = null;
}

Being.prototype.getColor = function() {

}

Being.prototype.getChar = function() {
	
}

Being.prototype.getSpeed = function() {
	return 100;
}

Being.prototype.setPosition = function(x, y) {
	this._position = [x, y];
}

Being.prototype.getPosition = function() {
	return this._position;
	
}

Being.prototype.act = function() {

}
