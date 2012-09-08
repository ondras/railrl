Game.Display = function(options) {
	var options = {
		fontSize: 20,
		layout: "hex",
		fontFamily: "monospace"
	}
	ROT.Display.call(this, options)
	this._offset = [0, 0]; /* cell in left-top of canvas */

	this._colors = {};
	this._colors[Game.TERRAIN_MOUNTAIN] = ["#ff0", "#fc0", "#cf0", "#f80", "#8f0"];
	this._colors[Game.TERRAIN_FOREST] = ["#0f0", "#0c0", "#0a0"];
	this._colors[Game.TERRAIN_WATER] = ["#00f", "#00c", "#00a"];
	this._colors[Game.TERRAIN_NONE] = ["#333", "#666", "#999", "#ccc"];

	this._sqrt32 = Math.sqrt(3)/2;
	this._dirty = true; /* true = all; object = list of dirty cells */

	this._visible = null;

	setInterval(this._update.bind(this), 1000/25);
}
Game.Display.extend(ROT.Display);

Game.Display.prototype.draw = function(x, y) {
	if (this._dirty === true) { return; }

	/* FIXME check outside visibility range */
	if (!this._dirty) { this._dirty = {}; }
	this._dirty[x+","+y] = [x, y];
}

Game.Display.prototype.setCenter = function(x, y) {
	this._offset[1] = y-Math.floor(this._options.height/2);
	this._offset[0] = x-Math.floor(this._options.width/2);

	if ((this._offset[0] + this._offset[1]) % 2) { this._offset[0]--; }

	this._dirty = true;
}

Game.Display.prototype.forceUpdate = function() {
	this._update();
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
	if (rail) {
		this._drawRail(x, y, rail);
	}

	/* foreground */
	var being = Game.beings[key];
	if (being) {
		this._context.fillStyle = being.getColor();
		this._context.fillText(being.getChar(), cx, cy);
	} else {
		this._drawTerrain(x, y, cx, cy);
	}

}

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
	var ch;
	var int = Math.round(1000*Math.abs(Math.sin(x*y)));

	var terrain = Game.terrain[x+","+y] || Game.TERRAIN_NONE;
	switch (terrain) {
		case Game.TERRAIN_MOUNTAIN:
			ch = "*";
		break;

		case Game.TERRAIN_WATER:
			ch = "=";
		break;

		case Game.TERRAIN_FOREST:
			ch = "T";
		break;

		case Game.TERRAIN_NONE:
			ch = ".";
			cy -= 4; /* FIXME */
		break;

	}

	var arr = this._colors[terrain];
	this._context.fillStyle = arr[int % arr.length];
	this._context.fillText(ch, cx, cy);
}
