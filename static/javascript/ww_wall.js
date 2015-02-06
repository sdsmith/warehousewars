/* START Class Wall */
/*
 * Wall constructor. Take stage position (x,y).
 */
function Wall(stage_ref, x, y, image_source=null) {
	// Check default image source
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}

	this._actor = new Actor(stage_ref, x, y, default_image_source, 0);
}

/*
 * Return the position of the actor relative to the stage as an array [x, y].
 */
Wall.prototype.getPosition = function() {
	return this._actor.getPosition();
}

/*
 * Return actor's image.
 */
Wall.prototype.getImage = function() {
	return this._actor.getImage();
}

/*
 * Set actor's image.
 */
Wall.prototype.setImage = function(image_source) {
	this._actor.setImage(image_source);
}

/*
 * Called by Stage on every tick. Wall does not do anything, and so performs
 * no operations.
 */
Wall.prototype.tick = function() {
	return false;
}

/*
 * Called when object would like to move. Return false, as a wall will never
 * move.
 */
Wall.prototype.move = function(dx, dy) {
	return false;
}
/* END Class Wall */
