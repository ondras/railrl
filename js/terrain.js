Game.Terrain = function() {
	this._noise = {
		height: new ROT.Noise.Simplex(),
		water: new ROT.Noise.Simplex()
	}

	this._noTrees = {};
	this._bridges = {};
	this._waterThreshold = 0.1;
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
	if (key in this._bridges) { 
		return {type:Game.Terrain.TYPE_BRIDGE};
	}

	var water = this._noise.water.get(x/50, y/50);
	if (Math.abs(water) < this._waterThreshold) {
		return {type:Game.Terrain.TYPE_WATER, color: water};
	} else {
		return {type:Game.Terrain.TYPE_LAND};
	}
}
