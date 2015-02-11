/* Start Class Monster */
/* 
 * Monster Constructor. Take stage position (x, y). 
 * 
 * stage_ref		reference to the stage
 * team_id			id of the team this actor belongs too
 *	hit_points		number of maximum damage this actor can take over its lifetime
 *	damage			the amount of damage done to a hostile during an attack
 *	score_value		the amount of points this actor is worth if killed
 *	x					x co-ordinate of grid position
 *	y					y co-ordinate of grid position
 *	floor_num		floor the actor is on
 *	image_source	file path of the image that will be displayed on screen for actor
 *	tick_delay		interval of skipped ticks before it performs its move
 */
function Monster(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, image_source=null, tick_delay=50) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}	
	
	//Default movement deltas	
	this.dx = 1;
	this.dy = 1;

	//Stage Reference
	this._stage = stage_ref;
	
	//Actor Instantiation
	this._actor = new Actor(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, default_image_source, tick_delay);
}

/*
 * Get Monster's score value
 */
Monster.prototype.getScoreValue = function() {
	return this._actor.getScoreValue();
}

/*
 * Get Monster's team ID
 */
Monster.prototype.getTeamId = function() {
	return this._actor.getTeamId();
}

/*
 * Set Monster's team ID
 */
Monster.prototype.setTeamId = function(team_id) {
	this._actor.setTeamId(team_id);
}

/*
 * Get Monster's damage
 */
Monster.prototype.getDamage = function() {
	return this._actor.getDamage();
}

/*
 * Tells Monster that attacker_actor is applying damage_amount of damage to it.
 */
Monster.prototype.hit = function(attacker_actor, damage_amount) {
	this._actor.hit(attacker_actor, damage_amount);
}

/*
 * Add hit_points health to Monster
 */
Monster.prototype.heal = function(hit_points) {
	this._actor.heal(hit_points);
}

/*
 * Get Monster's x, y, z coordinates
 */
Monster.prototype.getPosition = function() {
	return this._actor.getPosition();
}

/*
 * Set Monster's x, y, z coordinates
 */
Monster.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._actor.setPosition(x, y, floor_num, subclass_actor);
}

/*
 * Get Monster's image
 */
Monster.prototype.getImage = function() {
	return this._actor.getImage();
}

/*
 * Set Monster's image
 */
Monster.prototype.setImage = function(image_source) {
	return this._actor.setImage(image_source);
}

/*
 * Return actor's delay function which will give true or false based on calculation done on the 
 * tick_delay_count and the tick_delay
 */
Monster.prototype.delay = function() {
	return this._actor.delay()
}

/*
 * Get Monster's tick_delay
 */
Monster.prototype.getDelay = function() {
	return this._actor.getDelay();
}

/*
 * Set Monster's tick_delay
 */
Monster.prototype.setDelay = function(tick_delay) {
	return this._actor.setDelay(tick_delay);
}

/*
 * Monster is not grabable so return false
 */
Monster.prototype.isGrabbable = function() {
	return false;
}

/*
 * Will check if monster is dead, will appropriately delay itself if need be,
 * and make itself move. If object changes visually it will to return true.
 */
Monster.prototype.tick = function(force_update, subclass_actor=this) {
	if (this.isDead()) {
		this._stage.removeActor(this);
		return true;
	} else if (this.delay()) {
		return this.monsterMove(this.dx, this.dy, this.getPosition()[2], subclass_actor);
	}
	return false;
}

/*
 *	Checks surrounding squares and adds up the total number of blocks the
 * monster is surrounded by, if it is surrounded keep alive for 3 more ticks
 * to ensure it is really dead
 */
Monster.prototype.isDead = function() {
	var pos = this.getPosition();
	var num_surrounding_actors = 0;

	for (var dx = -1; dx <= 1; dx++) {
		for (var dy = -1; dy <= 1; dy++) {
			if (dx == 0 && dy == 0) continue; // Don't need to check player
			
			var actor = this._stage.getActor(pos[0] + dx, pos[1] + dy, pos[2]);
			if (actor) {
				num_surrounding_actors += 1;
			}
		}
	}

	return num_surrounding_actors == 8;
}

/*
 *	Will move diagonally, if it hits a wall will determine if it is being 
 * blocked in the x or y directions and "bounce" in the opposite direction
 * NOTE(SLatychev): This funciton is only called during an update via tick.
 */
Monster.prototype.monsterMove = function(dx, dy, floor_num, subclass_actor=this) {
	var old_pos = this.getPosition();

	var backward_pos_actor = this._stage.getActor(old_pos[0]-this.dx, old_pos[1]-this.dy, floor_num);
	var forward_pos_actor = this._stage.getActor(old_pos[0]+this.dx, old_pos[1]+this.dy, floor_num);
	var rev_dx_pos_actor = this._stage.getActor(old_pos[0]-this.dx, old_pos[1]+this.dy, floor_num);
	var rev_dy_pos_actor = this._stage.getActor(old_pos[0]-this.dx, old_pos[1]-this.dy, floor_num);
	
	if (forward_pos_actor) {
		// Apply damage
		if (this._stage.hostileTeamInteraction(this, forward_pos_actor)) {
			forward_pos_actor.hit(this, this.getDamage());
		}

		//Check if actor in position if we reverse dx
		if (!rev_dx_pos_actor) {
			this.dx = -this.dx;
		}
		//Check if actor in position if we reverse dy
		if (!rev_dy_pos_actor) {
			this.dy = -this.dy;
		}
		//Check 
		if (rev_dx_pos_actor && rev_dy_pos_actor) {
			//Cannot move in a "forward" direction
			if (!backward_pos_actor) {
				this.dx = -this.dx;
				this.dy = -this.dy;
			}
		}
		return false;
	} else {
		this.setPosition(old_pos[0]+this.dx, old_pos[1]+this.dy, floor_num, subclass_actor);
		//NOTE(sdsmith, SLatychev): This is unecessary as it make the screen update call twice
		//this._stage.immediateActorScreenUpdate(subclass_actor, old_pos[0], old_pos[1], old_pos[2]);
		return true;
	}
}

/*
 * Monster cannot be moved by other actors and so returns false.
 */
Monster.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return false;
}







