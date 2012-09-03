var Game = {
	terrain: {},
	rail: {},
	beings: {},

	display: null,
	engine: null,

	setRail: function(x, y, type) {
		var key = x+","+y;
		this.rail[key] = type;
		this.display.draw(x, y);
	},

	setBeing: function(x, y, being) {
		var key = x+","+y;
		this.beings[key] = being;
		this.display.draw(x, y);
	},

	init: function() {
		this.display = new Game.Display({fontSize:20});

		document.body.appendChild(this.display.getContainer());

		this.setRail(0, 0, Game.Rail.TYPE_CROSS_L);
		this.setRail(2, 0, Game.Rail.TYPE_CROSS_R);
		this.setRail(4, 0, Game.Rail.TYPE_LINE_H);
		this.setRail(6, 0, Game.Rail.TYPE_LINE_S);
		this.setRail(8, 0, Game.Rail.TYPE_LINE_B);
		this.setRail(1, 1, Game.Rail.TYPE_LINE_HS);
		this.setRail(3, 1, Game.Rail.TYPE_LINE_HB);
		this.setRail(5, 1, Game.Rail.TYPE_LINE_SB);
		this.setRail(0, 2, Game.Rail.TYPE_CORNER_L);
		this.setRail(2, 2, Game.Rail.TYPE_CORNER_R);
		this.setRail(4, 2, Game.Rail.TYPE_CORNER_LT);
		this.setRail(6, 2, Game.Rail.TYPE_CORNER_LB);
		this.setRail(8, 2, Game.Rail.TYPE_CORNER_RT);
		this.setRail(10, 2, Game.Rail.TYPE_CORNER_RB);

		this.engine = new ROT.Engine();
		this.engine.start();
	}
}
