Game.Display = function(options) {
	options = options || {};
	options.layout = "hex";
	ROT.Display.call(this, options)
	this._offset = [0, 0]; /* cell in left-top */

	this._sqrt32 = Math.sqrt(3)/2;
}
Game.Display.extend(ROT.Display);

Game.Display.prototype.draw = function(x, y) {
	var cx = (x+1) * this._spacingX;
	var cy = y * this._spacingY + this._hexSize;

	var key = x+","+y;
	var bg = Game.terrain[key] || this._options.bg;
	this._context.fillStyle = bg;

	/* background */
	this._fillHex(cx, cy);
	
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
	}
}

Game.Display.prototype.center = function(x, y) {

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

Game.Display.prototype._drawRail = function(x, y, rail) {
	this._inCenter = false;
	var a = this._hexSize;
	var l = this._spacingX;
	var cx = (x+1) * l;
	var cy = y * this._spacingY + a;

	this._context.save();

	this._context.strokeStyle = "#888";
	this._context.lineWidth = 5;
	this._context.globalAlpha = 0.5;


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