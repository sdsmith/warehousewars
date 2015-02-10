/* START Class Box */
/*
 * Box constructor. Take stage position (x,y).
 */
function Box(stage_ref, team_id, x, y, floor_num, image_source=null) {
	// Check default image source
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}

	this._actor = new Actor(stage_ref, team_id, -1, 0, 0, x, y, floor_num, default_image_source, 0);
}

/*
 * Get actor's team id.
 */
Box.prototype.getTeamId = function() {
	return this._actor.getTeamId();
}

/*
 * Return position of actor relative to the stage as an array [x,y,floor_num].
 */
Box.prototype.getPosition = function() {
	return this._actor.getPosition();
}

/*
 * Set actor's position to the given co-ordinates.
 */
Box.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	this._actor.setPosition(x, y, floor_num, subclass_actor);
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
	this._actor.setImage(image_source);
}

/*
 * Called by the stage every tick. Since it is a box, it does not perform any
 * action on a tick. Return whether its state changed.
 * NOTE: Can be force updated, and will be notified through the force_update
 * parameter.
 */ 
Box.prototype.tick = function(force_update) {
	return false;
}

/*
 * Called when object would like to move. Return true if there is available  
 * space move.
 */
Box.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._actor.move(dx, dy, floor_num, subclass_actor);
}

Box.prototype.isGrabbable = function() {
	return true;
}
/* END Class Box */
