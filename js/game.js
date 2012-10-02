var Game = {
	ITEM_WOOD:			0,
	ITEM_IRON:			1,
	ITEM_WATER:			2,
	ITEM_GEM_RED:		3,
	ITEM_GEM_BLUE:		4,
	ITEM_GEM_GREEN:		5,
	ITEM_GEM_YELLOW:	6,

	rail: {},
	beings: {},

	display: null,
	engine: null,
	player: null,
	terrain: null,

	createRail: function(x, y) {
		var key = x+","+y;
		this.rail[key] = 1;
		this.display.draw(x, y);
	},

	removeRail: function(x, y) {
		var key = x+","+y;
		delete this.rail[key];
		this.display.draw(x, y);
	},

	setBeing: function(x, y, being) {
		var oldPosition = being.getPosition();
		if (oldPosition) {
			var oldKey = oldPosition.join(",");
			if (this.beings[oldKey] == being) { delete this.beings[oldKey]; }
			this.display.draw(oldPosition[0], oldPosition[1]);
		}

		var key = x+","+y;
		being.setPosition(x, y);

		if (x !== null) {
			this.beings[key] = being;
			this.display.draw(x, y);
		}

		if (being == this.player) { this.display.setCenter(); }
	},
	
	removeBeing: function(being) {
		var oldPosition = being.getPosition();
		if (!oldPosition) { return; }
		var oldKey = oldPosition.join(",");
		if (this.beings[oldKey] == being) { delete this.beings[oldKey]; }
		this.display.draw(oldPosition[0], oldPosition[1]);
	},
	
	/**
	 * @param {string} text May contain %s (string) and %i (itemlist)
	 */
	log: function(text) {
		/* FIXME predelat na pole stringu/uzlu */
		var item = document.createElement("p");
		var startIndex = 0;
		var argIndex = 1;
		var params = arguments;
		
		text.replace(/%([si])/g, function(match, letter, index) {
			if (index != startIndex) { /* start with text node */
				var node = document.createTextNode(text.substring(startIndex, index));
				item.appendChild(node);
			}
			
			var value = params[argIndex++];
			
			switch (letter) {
				case "s":
					var node = document.createTextNode(value);
					item.appendChild(node);
				break;
				case "i":
					Game.logItems(value, item);
				break;
			}
			
			startIndex = index + match.length;
			
			return "";
		});
		
		if (startIndex < text.length) {
			var node = document.createTextNode(text.substring(startIndex));
			item.appendChild(node);
		}
		
		document.querySelector("#log").appendChild(item);
	},
	
	init: function() {
		this.terrain = new Game.Terrain();
		this.engine = new ROT.Engine();
		this.player = new Game.Player();
		this.engine.addActor(this.player);

		this._intro();
	},

	_intro: function() {
		document.querySelector("#intro").addEventListener("click", this._start.bind(this));
	},

	_start: function() {
		var intro = document.querySelector("#intro");
		intro.parentNode.removeChild(intro);

		this.display = new Game.Display();
		document.body.appendChild(this.display.getContainer());

		/* find initial position */
		var pos = [0, 0];
		while (Game.terrain.get(pos[0], pos[1]).type != Game.Terrain.TYPE_LAND || Game.terrain.get(pos[0]-1, pos[1]-1).type != Game.Terrain.TYPE_LAND) { 
			pos[0] += 1;
			pos[1] += 1;
		}
		this.setBeing(pos[0], pos[1], this.player);
		this.display.resize();

		pos[0] += 2;
		pos[1] += 6;

		/* build sample rail */
		this._railFromTemplate(pos[0], pos[1], [
			"  # # # # #",
			" #         #",
			"#           #",
			" #         #",
			"  # # # # #",
			" #         #",
			"#           #",
			" #         #",
			"  # # # # #"
		]);

		var train = new Game.Train.Locomotive();
		this.setBeing(pos[0] + 8, pos[1], train);
		this.engine.addActor(train);

		train.addCar(new Game.Train());
		train.addCar(new Game.Train());

		this.engine.start();
		
		var tmp = {};
		tmp[Game.ITEM_IRON] = 10;
		tmp[Game.ITEM_GEM_YELLOW] = 2;
	},

	_railFromTemplate: function(x, y, template) {
		for (var j=0;j<template.length;j++) {
			var row = template[j];
			for (var i=0;i<row.length;i++) {
				var ch = row.charAt(i);
				if (ch == " ") { continue; }
				var cx = x+i;
				var cy = y+j;
				var terrain = Game.terrain.get(cx, cy);
				if (terrain.type == Game.Terrain.TYPE_WATER) { Game.terrain.setBridge(cx, cy); }
				this.createRail(cx, cy);
			}
		}
	},
	
	logItems: function(items, parent) {
		/* FIXME title */
		/* FIXME nbsp */
		parent.appendChild(document.createTextNode("{"));

		var index = 0;
		for (var id in items) {
			var def = Game.Items[id];
			var count = items[id];
			
			if (index) { 
				var separator = document.createTextNode(", ");
				parent.appendChild(separator);
			}
			
			var span = document.createElement("span");
			span.style.color = def.color;
			span.innerHTML = def.ch;
			parent.appendChild(span);
			
			var count = document.createTextNode(" " + items[id]+"×");
			parent.appendChild(count);
			index++;
		}

		parent.appendChild(document.createTextNode("}"));
	}
}
