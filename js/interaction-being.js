Game.Interaction.Being = function(locomotive, callback) {
	this._locomotive = locomotive;
	this._callback = callback;
	
	var list = new Game.List(this._cancel.bind(this));
	list.addItem("Change orientation", this._swap.bind(this));
	list.addItem("Add car", this._add.bind(this));
	list.addItem("Remove car", this._remove.bind(this), (this._locomotive.getCars().length ? null : "no car available"));
	list.addItem("Adjust logic", this._logic.bind(this));
	list.show();
}

Game.Interaction.Being.prototype._cancel = function() {
	this._callback(false);
}

/**
 * FIXME schedule as Being's next action?
 */
Game.Interaction.Being.prototype._swap = function() {
	var o = this._locomotive.getOrientation();
	this._locomotive.setOrientation((o+3) % 6);
	
	/* reverse cars */
	var all = [this._locomotive].concat(this._locomotive.getCars());
	while (all.length) {
		var first = all.shift();
		if (!all.length) { continue; }
		var second = all.pop();
		
		/* swap first and second */
		var p1 = first.getPosition();
		var p2 = second.getPosition();
		Game.setBeing(p2[0], p2[1], first);
		Game.setBeing(p1[0], p1[1], second);
	}
	
	this._callback(true);
}

Game.Interaction.Being.prototype._add = function() {
	this._callback(true);
}

Game.Interaction.Being.prototype._remove = function() {
	this._callback(true);
}

Game.Interaction.Being.prototype._logic = function() {
}