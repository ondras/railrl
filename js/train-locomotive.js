Train.Locomotive = function() {
	Train.call(this);
	this._cars = [];
	this._locomotive = this;
}
Train.Locomotive.extend(Train);

Train.Locomotive.prototype.addCar = function(train) {
	/* FIXME find position + orientation */
	this._cars.push(train);
}

Train.Locomotive.prototype.act = function() {
	Train.prototype.act.call(this);
	for (var i=0;i<this._cars.length;i++) {
		this._cars[i].act();
	}
}

Train.Locomotive.prototype.setColor = function(color) {
	Train.prototype.setColor.call(this, color);
	for (var i=0;i<this._cars.length;i++) {
		this._cars[i].setColor(color);
	}
}

Train.Locomotive.prototype.getChar = function() {
	return "T";
}
