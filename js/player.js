Game.Player = function() {
	Game.Being.call(this);

	this._keys = {};
	this._keys[103]	= 0; /* top left */
	this._keys[105]	= 1; /* top right */
	this._keys[102]	= 2; /* right */
	this._keys[99]	= 3; /* bottom right */
	this._keys[97]	= 4; /* bottom left */
	this._keys[100]	= 5; /* left */

	this._keys[81]	= 0; /* top left */
	this._keys[87]	= 1; /* top right */
	this._keys[83]	= 2; /* right */
	this._keys[88]	= 3; /* bottom right */
	this._keys[90]	= 4; /* bottom left */
	this._keys[65]	= 5; /* left */

	this._keys[101]	= -1; /* noop */
	this._keys[110]	= -1; /* noop */
	this._keys[190]	= -1; /* noop */
}
Game.Player.extend(Game.Being);

Game.Player.prototype.act = function() {
	Game.engine.lock();

	/* wait for input */
	window.addEventListener("keydown", this);
}

Game.Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;

	if (code in this._keys) {
		code = this._keys[code];
		if (code == -1) { /* noop */
			Game.engine.unlock();
			return;
		}

		var dir = ROT.DIRS[6][code];
		var x = this._position[0] + dir[0];
		var y = this._position[1] + dir[1];

		if (x+","+y in Game.beings) { return; } /* occupied */

		Game.setBeing(x, y, this);
		Game.engine.unlock();
	}
}

Game.Player.prototype.getChar = function() {
	return "@";
}

Game.Player.prototype.getColor = function() {
	return "#ccc";
}
