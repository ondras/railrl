var Game = {
	TERRAIN_NONE:		0,
	TERRAIN_MOUNTAIN:	1,
	TERRAIN_FOREST:		2,
	TERRAIN_WATER:		3,

	terrain: {},
	rail: {},
	beings: {},

	display: null,
	engine: null,
	player: null,

	setRail: function(x, y) {
		var key = x+","+y;
		this.rail[key] = true;
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
		this.beings[key] = being;

		this.display.draw(x, y);

		if (being == this.player) { this.display.setCenter(x, y); }
	},
	
	removeBeing: function(being) {
		var oldPosition = being.getPosition();
		if (!oldPosition) { return; }
		var oldKey = oldPosition.join(",");
		if (this.beings[oldKey] == being) { delete this.beings[oldKey]; }
		this.display.draw(oldPosition[0], oldPosition[1]);
	},
	
	init: function() {
		ROT.DEFAULT_WIDTH = 40;
		ROT.DEFAULT_HEIGHT = 24;
		this.display = new Game.Display();

		document.body.appendChild(this.display.getContainer());

		this.setRail(2, 0);
		this.setRail(4, 0);
		this.setRail(6, 0);
		this.setRail(8, 0);
		this.setRail(9, 1);
		this.setRail(10, 2);
		this.setRail(9, 3);
		this.setRail(8, 4);
		this.setRail(6, 4);
		this.setRail(4, 4);
		this.setRail(2, 4);
		this.setRail(1, 3);
		this.setRail(0, 2);
		this.setRail(1, 1);

		this.setRail(9, 5);
		this.setRail(10, 6);
		this.setRail(9, 7);
		this.setRail(8, 8);
		this.setRail(6, 8);
		this.setRail(4, 8);
		this.setRail(2, 8);
		this.setRail(1, 7);
		this.setRail(0, 6);
		this.setRail(1, 5);


		this.engine = new ROT.Engine();

		this.player = new Game.Player();
		this.setBeing(7, 3, this.player);
		this.engine.addActor(this.player);

		var train = new Game.Train.Locomotive().setOrientation(2);
		this.setBeing(4, 0, train);
		this.engine.addActor(train);

		var car = new Game.Train();
		this.setBeing(2, 0, car);
		train.addCar(car);

		train.setColor("#f00");

		this.engine.start();
	}
}
