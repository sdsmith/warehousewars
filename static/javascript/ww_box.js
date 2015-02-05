/* START Class Box */
/*
 * Wall constructor. Take stage position (x,y).
 */
function Wall(x, y) {
	var image_source = ;
	this._actor = Actor(x, y, image_source);
}

Wall.prototype.getPosition = function() {
	return self._actor.getPosition();
}

Wall.prototype.getImage = function() {
	return this._actor.getImage();
}

Wall.prototype.tick = function() {
}

/*
 * Called when object would like to move. Return false, as a wall will never
 * move.
 */
Wall.prototype.move = function(dx, dy) {
	return false;
}
/* END Class Box */
