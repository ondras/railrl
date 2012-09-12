var Game = {
	ITEM_WOOD:	0,
	ITEM_IRON:	1,
	ITEM_WATER:	2,

	rail: {},
	beings: {},

	display: null,
	engine: null,
	player: null,
	terrain: null,

	setRail: function(x, y) {
		var key = x+","+y;
		this.rail[key] = true;
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
	
	log: function(text) {
		var item = document.createElement("p");
		item.innerHTML = text;
		document.querySelector("#log").appendChild(item);
	},
	
	init: function() {
		this.terrain = new Game.Terrain();
		this.engine = new ROT.Engine();
		this.display = new Game.Display();
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
		document.body.appendChild(this.display.getContainer());

		/* find initial position */
		var pos = [0, 0];
		while (Game.terrain.get(pos[0], pos[1]).type == Game.Terrain.TYPE_WATER) { 
			pos[0] += 1;
			pos[1] += 1;
		}
		this.setBeing(pos[0], pos[1], this.player);
		this.display.resize();

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
				this.setRail(cx, cy);
			}
		}
	}
}
