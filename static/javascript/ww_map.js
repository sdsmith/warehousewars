/* START Class Map */
/*
 * Map constructor. Initializes a 3d array of the given height, width, and 
 * depth with each index containing the given init_value (null by default).
 */
function Map(width, height, depth, init_value=null) {
	this.map = new Array();
	this.init_value = init_value;

	// Initialize map to default_value
	for (var d = 0; d < depth; d++) {
		this.map[d] = new Array();

		for (var x = 0; x < width; x++) {
			this.map[d][x] = new Array();

			for (var y = 0; y < height; y++) {
				this.map[d][x][y] = this.init_value;
			}
		}
	}
}

/*
 * Return value at index.
 */
Map.prototype.get = function(x, y, d) {
	return this.map[d][x][y];
}

/*
 * Set given index to given value.
 */
Map.prototype.set = function(x, y, d, value) {
	this.map[d][x][y] = value;
}

/*
 * Set given index to initial value given when the class was instanced.
 */
Map.prototype.reset = function(x, y, d) {
	this.map[d][x][y] = this.init_value;
}
/* END Class Map */
