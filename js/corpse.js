Game.Corpse = function() {
	Game.Item.call(this);
}
Game.Corpse.extend(Game.Item);

Game.Corpse.prototype.getChar = function() {
	return "%";
}

Game.Corpse.prototype.getColor = function() {
	return "#f00";
}
