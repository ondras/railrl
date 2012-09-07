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

	setRail: function(x, y, type) {
		var key = x+","+y;
		this.rail[key] = type;
		this.display.draw(x, y);
	},

	setBeing: function(x, y, being) {
		var oldPosition = being.getPosition();
		if (oldPosition) {
			delete this.beings[oldPosition.join(",")];
			this.display.draw(oldPosition[0], oldPosition[1]);
		}

		var key = x+","+y;
		being.setPosition(x, y);
		this.beings[key] = being;

		this.display.draw(x, y);

		if (being == this.player) { this.display.setCenter(x, y); }
	},

	init: function() {
		ROT.DEFAULT_WIDTH = 20;
		ROT.DEFAULT_HEIGHT = 12;
		this.display = new Game.Display();

		document.body.appendChild(this.display.getContainer());

		this.setRail(2, 0, Game.Rail.TYPE_CORNER_RB);
		this.setRail(4, 0, Game.Rail.TYPE_LINE_H);
		this.setRail(6, 0, Game.Rail.TYPE_LINE_H);
		this.setRail(8, 0, Game.Rail.TYPE_CORNER_LB);
		this.setRail(9, 1, Game.Rail.TYPE_LINE_B);
		this.setRail(10, 2, Game.Rail.TYPE_CORNER_L);
		this.setRail(9, 3, Game.Rail.TYPE_LINE_S);
		this.setRail(8, 4, Game.Rail.TYPE_CORNER_LT);
		this.setRail(6, 4, Game.Rail.TYPE_LINE_H);
		this.setRail(4, 4, Game.Rail.TYPE_LINE_H);
		this.setRail(2, 4, Game.Rail.TYPE_CORNER_RT);
		this.setRail(1, 3, Game.Rail.TYPE_LINE_B);
		this.setRail(0, 2, Game.Rail.TYPE_CORNER_R);
		this.setRail(1, 1, Game.Rail.TYPE_LINE_S);

		this.engine = new ROT.Engine();

		this.player = new Game.Player();
		this.setBeing(0, 0, this.player);
		this.engine.addActor(this.player);

		var train = new Game.Train.Locomotive().setOrientation(2);
		this.setBeing(4, 0, train);
		this.engine.addActor(train);

		var car = new Game.Train().setOrientation(2);
		this.setBeing(2, 0, car);
		train.addCar(car);

		train.setColor("#f00");

		this.engine.start();
	}
}
