var Game = {
	terrain: {},
	rail: {},
	display: null,

	init: function() {
		this.display = new Game.Display({fontSize:20});

		document.body.appendChild(this.display.getContainer());

		this.rail["0,0"] = Game.Rail.TYPE_CROSS_L;
		this.rail["2,0"] = Game.Rail.TYPE_CROSS_R;
		this.rail["4,0"] = Game.Rail.TYPE_LINE_H;
		this.rail["6,0"] = Game.Rail.TYPE_LINE_S;
		this.rail["8,0"] = Game.Rail.TYPE_LINE_B;

		this.rail["1,1"] = Game.Rail.TYPE_LINE_HS;
		this.rail["3,1"] = Game.Rail.TYPE_LINE_HB;
		this.rail["5,1"] = Game.Rail.TYPE_LINE_SB;
		this.rail["7,1"] = Game.Rail.TYPE_LINE_HSB;

		this.rail["0,2"] = Game.Rail.TYPE_CORNER_L;
		this.rail["2,2"] = Game.Rail.TYPE_CORNER_R;
		this.rail["4,2"] = Game.Rail.TYPE_CORNER_LT;
		this.rail["6,2"] = Game.Rail.TYPE_CORNER_LB;
		this.rail["8,2"] = Game.Rail.TYPE_CORNER_RT;
		this.rail["10,2"] = Game.Rail.TYPE_CORNER_RB;

		this.display.draw(0, 0);
		this.display.draw(2, 0);
		this.display.draw(4, 0);
		this.display.draw(6, 0);
		this.display.draw(8, 0);
		this.display.draw(1, 1);
		this.display.draw(3, 1);
		this.display.draw(5, 1);
		this.display.draw(7, 1);
		this.display.draw(0, 2);
		this.display.draw(2, 2);
		this.display.draw(4, 2);
		this.display.draw(6, 2);
		this.display.draw(8, 2);
		this.display.draw(10, 2);








	}
}