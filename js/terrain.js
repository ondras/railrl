Game.Terrain = function() {
	this._noise = {
		height: new ROT.Noise.Simplex(),
		water: new ROT.Noise.Simplex()
	}

	this._noTrees = {};
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

/**
 * @returns {object} Keys: type, 
 */
Game.Terrain.prototype.get = function(x, y) {
	var key = x+","+y;
	var result = {};
	
	if (key in this._bridges) { 
		result.type = Game.Terrain.TYPE_BRIDGE;
		return result;
	}

	var water = this._noise.water.get(x/60, y/60);
	if (Math.abs(water) < this._waterThreshold) {
		result.type = Game.Terrain.TYPE_WATER;
	} else {
		var height = this._noise.height.get(x/20, y/20);
		
		if (height > this._mountainThreshold) {
			result.type = Game.Terrain.TYPE_MOUNTAIN;
			result.amount = (height-this._mountainThreshold) / (1-this._mountainThreshold);
		} else if (height > this._forestThreshold && !(key in this._noTrees)) {
			result.type = Game.Terrain.TYPE_FOREST;
			result.amount = (height-this._forestThreshold)/(this._mountainThreshold-this._forestThreshold);
		} else {
			result.type = Game.Terrain.TYPE_LAND;
			result.amount = (height+1)/(1+this._mountainThreshold);
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

Game.Terrain.prototype.cutTree = function(x, y) {
	this._noTrees[x+","+y] = true;
	Game.display.draw(x, y);
}
