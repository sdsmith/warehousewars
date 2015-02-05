/* START Class Box */
/*
 * Box constructor. Take stage position (x,y).
 */
function Box(x, y, image_source=null) {
	// Check default image source
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}

	this._actor = new Actor(x, y, default_image_source, 0);
}

/*
 * Return position of actor relative to the stage as an array [x,y].
 */
Box.prototype.getPosition = function() {
	return self._actor.getPosition();
}

/*
 * Return the actor's image.
 */
Box.prototype.getImage = function() {
	return this._actor.getImage();
}

/*
 * Set actor's image.
 */
Box.prototype.setImage = function(image_source) {
	self._actor.setImage(image_source);
}

/*
 * Called by the stage every tick. Since it is a box, it does not perform any
 * action on a tick.
 */ 
Box.prototype.tick = function() {
}

/*
 * Called when object would like to move. Return false, as a wall will never
 * move.
 */
Box.prototype.move = function(dx, dy) {
	return this._actor.move(dx, dy);
}
/* END Class Box */
