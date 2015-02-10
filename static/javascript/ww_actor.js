/* BEGIN Class Actor */
/*
 * Actor constructor.
 * 	stage_ref		reference to the stage
 * 	team_id			id of the team this actor belongs too
 *	hit_points		number of maximum damage this actor can take over its lifetime
 *	damage			the amount of damage done to a hostile during an attack
 *	x				x co-ordinate of grid position
 *	y				y co-ordinate of grid position
 *	floor_num		floor the actor is on
 *	image_source	file path of the image that will be displayed on screen for actor
 *	tick_delay		interval of skipped ticks before it performs its move
 */
function Actor(stage_ref, team_id, hit_points, damage, x, y, floor_num, image_source, tick_delay) {
	this._stage = stage_ref;
	this.team_id = team_id;
	this.max_hit_points = hit_points;		// maximum actor health
	this.hit_points = this.max_hit_points;	// current actor health
	this.damage = damage;
	this.pos_x = x;
	this.pos_y = y;
	this.floor_num = floor_num;
	this.image_source = image_source;
	this.tick_delay_count = 0;
	this.tick_delay = tick_delay;
}

/*
 * Get actor's team id.
 */
Actor.prototype.getTeamId = function() {
	return this.team_id;
}

/*
 * Set actor to the given team id.
 */
Actor.prototype.setTeamId = function(team_id) {
	this.team_id = team_id;
}

/*
 * Return array of (x,y,floor_num) position relative to the stage.
 */
Actor.prototype.getPosition = function() {
	return [this.pos_x, this.pos_y, this.floor_num];
}

/*
 * Set actor's position on the stage to the given co-ordinates.
 * Auto informs the stage of to updates its map position.
 * NOTE: Must supply subclass_actor parameter in order to tell the stage that
 * it is the subclass that has moved that is using Actor via composition, NOT
 * the actual Actor instance itself.
 */
Actor.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	var old_x = this.pos_x;
	var old_y = this.pos_y;	
	var old_floor_num = this.floor_num;
	this.pos_x = x;
	this.pos_y = y;
	this.floor_num = floor_num;

	// inform the stage of position update
	this._stage.updateActorMapPosition(subclass_actor, old_x, old_y, old_floor_num);
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
 * Return actor's delay.
 */
Actor.prototype.getDelay = function() {
	return this.tick_delay;
}

/*
 * Set actor's delay.
 */
Actor.prototype.setDelay = function(tick_delay) {
	return this.tick_delay = tick_delay;
}

/*
 * Generic tick function to be overridden by specific actors that will use it.
 * Return whether its state changed.
 */
Actor.prototype.tick = function(force_update) {
	return false;	// NOTE(sdsmith): This means be default it will not render.
}

//Generic is_dead function to be overridden by specific actors
Actor.prototype.isDead = function() {
	return false;
}

/*
 * Tells actor there attacker_actor is applying damage_amount of damage to it.
 */
Actor.prototype.hit = function(attacker_actor, damage_amount) {
	// apply damage
	this.hit_points -= damage_amount;

	if (this.hit_points < 0) {
		// actor is 'dead'
		this._stage.removeActor(this);
	}
}

/*
 * Adds the given hit_points to the actor's current hit_points.
 * NOTE: Cannot go over the maximum health.
 */
Actor.prototype.heal = function(hit_points) {
	this.hit_points += hit_points;
	if (this.hit_points > this.max_hit_points) {
		this.hit_points = this.max_hit_points;
	}
}

/*
 * Generic move function that moves the actor by dx, dy relative to their 
 * position.
 * NOTE: Must supply subclass_actor parameter in order to tell the stage that
 * it is the subclass that has moved that is using Actor via composition, NOT
 * the actual Actor instance itself.
 */
Actor.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	var new_x = this.pos_x + dx;
	var new_y = this.pos_y + dy;

	// Check if the new spot is available to move into
	var canMove = true;
	var other_actor = this._stage.getActor(new_x, new_y, floor_num);
	if (other_actor) {
		if (floor_num == this.floor_num) {
			// being asked to move on the same floor
			canMove = other_actor.move(dx, dy, floor_num);
		} else {
			// being asked to move to a different floor
			canMove = false;
		}
	}

	if (canMove) {
		var old_x = this.pos_x;
		var old_y = this.pos_y;
		var old_floor_num = this.floor_num;

		// Update the actor's position and force them to re-render on stage 
		this.setPosition(new_x, new_y, floor_num, subclass_actor);
		this._stage.immediateActorScreenUpdate(subclass_actor, old_x, old_y, old_floor_num);
		return true;
	}

	return false;
}

//Delay function that will allow for speed settings of different actors relative to the base delay amount.
Actor.prototype.delay = function() {
	this.tick_delay_count = (this.tick_delay_count + 1) % this.tick_delay;
	return this.tick_delay_count == 0;
}

/* 
 * Return whether the actor can be grabbed by another actor.
 */
Actor.prototype.isGrabbable = function() {
	return false;
}
/* END Class Actor */

