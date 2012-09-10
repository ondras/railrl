Game.Terrain = function() {
	this._noise = {
		height: new ROT.Noise.Simplex(),
		water: new ROT.Noise.Simplex()
	}

	this._noTrees = {};
	this._bridges = {};
	this._waterThreshold = 0.08;
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

	var water = this._noise.water.get(x/50, y/50);
	if (Math.abs(water) < this._waterThreshold) {
		result.type = Game.Terrain.TYPE_WATER;
	} else {
		var height = this._noise.height.get(x/20, y/20);
		
		if (height > this._mountainThreshold) {
			result.type = Game.Terrain.TYPE_MOUNTAIN;
		} else if (height > this._forestThreshold && !(key in this._noTrees)) {
			result.type = Game.Terrain.TYPE_FOREST;
		} else {
			result.type = Game.Terrain.TYPE_LAND;
		}
	}
	
	return result;
}
