Game.Display = function(options) {
	var options = {
		fontSize: 20,
		layout: "hex",
		fontFamily: "droid sans mono",
		spacing: .9
	}
	ROT.Display.call(this, options)
	this._offset = [0, 0]; /* cell in left-top of canvas */

	this._sqrt32 = Math.sqrt(3)/2;
	this._dirty = true; /* true = all; object = list of dirty cells */

	this._visible = null;

	setInterval(this._update.bind(this), 1000/25);
	window.addEventListener("resize", this.resize.bind(this));
}
Game.Display.extend(ROT.Display);

Game.Display.prototype.draw = function(x, y) {
	if (this._dirty === true) { return; }

	/* in visiblity range? */
	var dx = x-this._offset[0];
	var dy = y-this._offset[1];
	if (dx < -1 || dy < -1 || dx > this._options.width + 1 || dy > this._options.height + 1) { return; }

	if (!this._dirty) { this._dirty = {}; }
	this._dirty[x+","+y] = [x, y];
}

Game.Display.prototype.setCenter = function() {
	var pos = Game.player.getPosition();
	this._offset[0] = pos[0]-Math.floor(this._options.width/2);
	this._offset[1] = pos[1]-Math.floor(this._options.height/2);

	if ((this._offset[0] + this._offset[1]) % 2) { this._offset[0]--; }

	this._dirty = true;
}

Game.Display.prototype.forceUpdate = function() {
	this._update();
}

Game.Display.prototype.resize = function() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	w -= document.querySelector("#column").offsetWidth;
	this._options.width = Math.floor(w/this._spacingX)-1;
	this._options.height = Math.floor(h/this._spacingY);

	this._compute();
	this.setCenter();
}

/**
 * Called in interval
 */
Game.Display.prototype._update = function() {
	if (!this._dirty) { return; }

	if (this._dirty === true) { /* draw all */
		this.clear();

		for (var j=0;j<this._options.height;j++) {
			for (var i=j%2;i<this._options.width;i+=2) {
				this._drawCell(i+this._offset[0], j+this._offset[1], false);
			}
		}

	} else { /* draw only dirty */
		for (var key in this._dirty) {
			var pos = this._dirty[key];
			this._drawCell(pos[0], pos[1], true);
		}
	}

	this._dirty = false;
}

/**
 * @param {int} x
 * @param {int} y
 * @param {bool} clear Clear the hexagon before drawing?
 */
Game.Display.prototype._drawCell = function(x, y, clear) {
	var key = x+","+y;

	var cx = (x-this._offset[0]+1) * this._spacingX;
	var cy = (y-this._offset[1]) * this._spacingY + this._hexSize;

	if (clear) { /* background */
		this._context.fillStyle = this._options.bg;
		this._fillHex(cx, cy);
	}
		
	/* rail */
	var rail = Game.rail[key];

	/* foreground */
	var being = Game.beings[key];
	if (being) {
		this._context.fillStyle = being.getColor();
		this._context.fillText(being.getChar(), cx, cy);
	} else if (rail) {
		this._context.fillStyle = "brown";
		this._context.fillText("#", cx, cy);
	} else {
		this._drawTerrain(x, y, cx, cy);
	}

}

/**
 * Obsolete.
 */
Game.Display.prototype._drawRail = function(x, y, rail) {
	this._inCenter = false;
	var a = this._hexSize;
	var l = this._spacingX;
	var cx = (x-this._offset[0]+1) * l;
	var cy = (y-this._offset[1]) * this._spacingY + a;

	this._context.save();

	this._context.strokeStyle = "#333";
	this._context.lineWidth = 5;
	this._context.lineJoin = "round";


	this._context.beginPath();

	if (rail & Game.Rail.SEGMENT_L) { this._drawSegment(cx, cy, -l, 0) ;}
	if (rail & Game.Rail.SEGMENT_R) { this._drawSegment(cx, cy, +l, 0) ;}

	if (rail & Game.Rail.SEGMENT_LT) { this._drawSegment(cx, cy, -l/2, -l*this._sqrt32) ;}
	if (rail & Game.Rail.SEGMENT_RT) { this._drawSegment(cx, cy, +l/2, -l*this._sqrt32) ;}

	if (rail & Game.Rail.SEGMENT_LB) { this._drawSegment(cx, cy, -l/2, +l*this._sqrt32) ;}
	if (rail & Game.Rail.SEGMENT_RB) { this._drawSegment(cx, cy, +l/2, +l*this._sqrt32) ;}

	this._context.stroke();

	this._context.restore();
}


Game.Display.prototype._drawSegment = function(cx, cy, dx, dy) {
	if (this._inCenter) {
		this._context.lineTo(cx+dx, cy+dy);
	} else {
		this._context.moveTo(cx+dx, cy+dy);
		this._context.lineTo(cx, cy);
	}
	this._inCenter = !this._inCenter;
}


Game.Display.prototype._drawTerrain = function(x, y, cx, cy) {
	var color, ch;

	var terrain = Game.terrain.get(x, y);
	switch (terrain.type) {
		case Game.Terrain.TYPE_MOUNTAIN:
			ch = "*";
			var colors = ["#d99", "#ff3", "#ccc", "#fff"];
			color = colors[Math.floor(terrain.amount * colors.length)];
		break;

		case Game.Terrain.TYPE_WATER:
			ch = "=";
			color = "#00f"
		break;

		case Game.Terrain.TYPE_BRIDGE:
			ch = "=";
			color = "goldenrod";
		break;

		case Game.Terrain.TYPE_FOREST:
			var chars = ["t", "T"];
			ch = chars[Math.floor(terrain.amount * chars.length)];
			color = "#090";
		break;

		case Game.Terrain.TYPE_LAND:
			ch = ".";
			var colors = ["#666", "#960"];
			color = colors[Math.floor(terrain.amount * colors.length)];
			cy -= 4; /* FIXME */
		break;
	}

	this._context.fillStyle = color;
	this._context.fillText(ch, cx, cy);
}
