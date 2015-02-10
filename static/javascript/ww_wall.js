/* START Class Wall */
/*
 * Wall constructor. Take stage position (x,y).
 */
function Wall(stage_ref, team_id, x, y, floor_num, image_source=null) {
	// Check default image source
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}

	this._actor = new Actor(stage_ref, team_id, -1, 0, 0, x, y, floor_num, default_image_source, 0);
}

/*
 * Return actor's team id.
 */
Wall.prototype.getTeamId = function() {
	return this._actor.getTeamId();
}

/*
 * Return position of actor relative to the stage as an array [x,y,floor_num].
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
 * no operations. Return whether its state changed.
 * NOTE: Can be force updated, and will be notified through the force_update
 * parameter.
 */
Wall.prototype.tick = function(force_update) {
	return false;
}

/*
 * Called when object would like to move. Return false, as a wall will never
 * move.
 */
Wall.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return false;
}

/*
 * Return whether the actor can be grabbed by another actor.
 */
Wall.prototype.isGrabbable = function() {
	return false;
}
/* END Class Wall */
