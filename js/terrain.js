Game.Terrain = function() {
	this._noise = {
		height: new ROT.Noise.Simplex(),
		water: new ROT.Noise.Simplex(),
		city: new ROT.Noise.Simplex()
	}

	this._cleared = {};
	this._bridges = {};
	this._waterThreshold = 0.06;
	this._mountainThreshold = 0.7;
	this._forestThreshold = 0.4;
}

Game.Terrain.TYPE_LAND		= 0;
Game.Terrain.TYPE_WATER		= 1;
Game.Terrain.TYPE_MOUNTAIN	= 2;
Game.Terrain.TYPE_FOREST	= 3;
Game.Terrain.TYPE_BRIDGE	= 4;
Game.Terrain.TYPE_CITY		= 5;

/**
 * @returns {object} Keys: type, 
 */
Game.Terrain.prototype.get = function(x, y) {
	var key = x+","+y;
	var result = {};
	
	var city = this._noise.city.get(x, y);
	if (city > .98) {
		result.type = Game.Terrain.TYPE_CITY;
		return result;
	}
	
	if (key in this._bridges) { 
		result.type = Game.Terrain.TYPE_BRIDGE;
		return result;
	}
	
	var water = this._noise.water.get(x/60, y/60);
	if (Math.abs(water) < this._waterThreshold) {
		result.type = Game.Terrain.TYPE_WATER;
	} else {
		var height = this._noise.height.get(x/20, y/20);
		
		if (key in this._cleared) {/* cleared terrain */
			result.type = Game.Terrain.TYPE_LAND;
			result.amount = (height+1)/2;
		} else if (height > this._mountainThreshold) { /* mountain */
			result.type = Game.Terrain.TYPE_MOUNTAIN;
			result.amount = (height-this._mountainThreshold) / (1-this._mountainThreshold);
		} else if (height > this._forestThreshold) { /* forest */
			result.type = Game.Terrain.TYPE_FOREST;
			result.amount = (height-this._forestThreshold)/(this._mountainThreshold-this._forestThreshold);
		} else {
			result.type = Game.Terrain.TYPE_LAND;
			result.amount = (height+1)/2;
		}
	}
	
	return result;
}

Game.Terrain.prototype.setBridge = function(x, y) {
	this._bridges[x+","+y] = true;
	Game.display.draw(x, y);
}

Game.Terrain.prototype.removeBridge = function(x, y) {
	delete this._bridges[x+","+y];
	Game.display.draw(x, y);
}

Game.Terrain.prototype.clear = function(x, y) {
	this._cleared[x+","+y] = true;
	Game.display.draw(x, y);
}
