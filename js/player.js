Game.Player = function() {
	Game.Being.call(this);
	
	this._alive = true;
	this._name = "you";
	this._items = {};
	this._dom = {
		items: {}
	}

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

	this._build();
}
Game.Player.extend(Game.Being);

Game.Player.prototype.act = function() {
	Game.engine.lock();
	
	if (this._alive) {
		/* wait for input */
		window.addEventListener("keydown", this);
	} else {
		Game.display.forceUpdate();
		alert("Game over");
	}
}

Game.Player.prototype.getItem = function(item) {
	return (this._items[item] || 0);
}

Game.Player.prototype.setItem = function(item, count) {
	this._items[item] = count;
	this._updateItem(item);
	return this;
}

Game.Player.prototype.adjustItem = function(item, diff) {
	this.setItem(item, this.getItem(item) + diff);
	return this;
}

Game.Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;

	if (!(code in this._keys)) { return; } /* not a direction/noop */
	if (e.ctrlKey) { return; }
	
	e.preventDefault();
	document.querySelector("#log").innerHTML = ""; /* empty the log */
	code = this._keys[code];

	var dir = (code == -1 ? [0,0] : ROT.DIRS[6][code]);
	var x = this._position[0] + dir[0];
	var y = this._position[1] + dir[1];

	if (e.altKey || e.metaKey) { /* modifiers -> interation */
		this._tryInteraction(x, y);
	} else { /* no modifiers -> movement/noop */
		if (code == -1) { /* noop */
			window.removeEventListener("keydown", this);
			Game.engine.unlock();
			return;
		}
		this._tryMove(x, y);
	}



}

Game.Player.prototype.getChar = function() {
	return "@";
}

Game.Player.prototype.getColor = function() {
	return "#ccc";
}

Game.Player.prototype.die = function() {
	Game.Being.prototype.die.call(this);
	this._alive = false;
}

Game.Player.prototype._tryMove = function(x, y) {
	if (x+","+y in Game.beings) { /* occupied */
		Game.log("That place is already occupied!");
		return;
	}

	var terrain = Game.terrain.get(x, y);
	if (terrain.type == Game.Terrain.TYPE_WATER) { /* cannot swim */
		Game.log("The water is deep. Way too deep for your swimming skills.");
		return; 
	} 

	/* move */
	Game.setBeing(x, y, this);
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Game.Player.prototype._tryInteraction = function(x, y) {
	window.removeEventListener("keydown", this);
	new Game.Interaction(x, y, this._endInteraction.bind(this));
}

Game.Player.prototype._endInteraction = function(success) {
	if (success) {
		Game.engine.unlock();
	} else {
		window.addEventListener("keydown", this);
	}
}

Game.Player.prototype._updateItem = function(item) {
	this._dom.items[item].innerHTML = this.getItem(item);
}

Game.Player.prototype._build = function() {
	var t = document.createElement("table");

	var row = document.createElement("tr");
	t.appendChild(row);
	row.appendChild(this._buildItem(Game.ITEM_WOOD));
	row.appendChild(this._buildItem(Game.ITEM_WATER));

	var row = document.createElement("tr");
	t.appendChild(row);
	row.appendChild(this._buildItem(Game.ITEM_IRON));
	row.appendChild(document.createElement("td"));

	document.querySelector("#status").appendChild(t);
}

Game.Player.prototype._buildItem = function(item) {
	var def = Game.Items[item];
	var td = document.createElement("td");
	td.title = def.name;

	var ch = document.createElement("span");
	ch.style.color = def.color;
	ch.innerHTML = def.ch;
	td.appendChild(ch);

	var count = document.createElement("span");
	this._dom.items[item] = count;
	td.appendChild(count);

	td.appendChild(document.createTextNode("×"));

	this._updateItem(item);

	return td;
}