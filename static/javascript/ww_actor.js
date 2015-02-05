/* BEGIN Class Actor */
/*
 * Actor constructor. Take stage position (x,y) and the source of the image to
 * be displayed in its position.
 */
function Actor(x, y, image_source, tick_delay) {
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
 */
Actor.prototype.setPosition = function(x, y) {
	this.pos_x = x;
	this.pos_y = y;
}

/*
 * Return actor's image.
 */
Actor.prototype.getImage = function() {
	return this.imgsrc;
}

/*
 * Set actor's image to given image.
 */
Actor.prototype.setImage = function(image_source) {
	this.imgsrc = image_source;
}

//Generic step function to be overridden by specific actors that will use it
Actor.prototype.tick = function() {
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
		canMove = this.move(dx, dy);
	}

	if (canMove) {
		this.setPosition(this.pos_x + dx, this.pos_y + dy);
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

