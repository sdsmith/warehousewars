/* BEGIN Class Actor */
/*
 * Actor constructor. Take stage position (x,y) and the source of the image to
 * be displayed in its position.
 */
function Actor(stage_ref, x, y, image_source, tick_delay) {
	this._stage = stage_ref;
	this.pos_x = x;
	this.pos_y = y;
	this.image_source = image_source;
	this.tick_delay_count = 0;
	this.tick_delay = tick_delay;
}

/*
 * Return array of x, y position relative to the stage.
 */
Actor.prototype.getPosition = function() {
	return [this.pos_x, this.pos_y];
}

/*
 * Set actor's position on the stage to the given co-ordinates.
 * Auto informs the stage of to updates its map position.
 */
Actor.prototype.setPosition = function(x, y) {
	var old_x = this.pos_x;
	var old_y = this.pos_y;	
	this.pos_x = x;
	this.pos_y = y;

	// inform the stage of position update
	this._stage.updateActorPosition(this, old_x, old_y);
}

/*
 * Return actor's image.
 */
Actor.prototype.getImage = function() {
	return this.image_source;
}

/*
 * Set actor's image to given image.
 */
Actor.prototype.setImage = function(image_source) {
	this.image_source = image_source;
}

/*
 * Generic tick function to be overridden by specific actors that will use it.
 * Return whether its state changed.
 */
Actor.prototype.tick = function() {
	return false;	// NOTE(sdsmith): This means be default it will not render.
}

//Generic is_dead function to be overridden by specific actors
Actor.prototype.isDead = function() {
	return false;
}

//Generic move function that moves the actor by dx, dy relative to their position
Actor.prototype.move = function(dx, dy) {
	var new_x = this.pos_x + dx;
	var new_y = this.pos_y + dy;

	// Check if the new spot is available to move into
	var canMove = true;
	var other_actor = this._stage.getActor(new_x, new_y);
	if (other_actor) {
		canMove = other_actor.move(dx, dy);
	}

	if (canMove) {
		var old_x = this.pos_x;
		var old_y = this.pos_y;

		// Update the actor's position and force them to re-render on stage 
		this.setPosition(new_x, new_y);
		this._stage.immediateMoveUpdate(this, old_x, old_y);
		return true;
	}
	return false;
}

//Delay function that will allow for speed settings of different actors relative to the base delay amount.
Actor.prototype.delay = function() {
	this.tick_delay_count = (this.tick_delay_count + 1) % this.tick_delay;
	return this.tick_delay_count == 0;
}
/* END Class Actor */

