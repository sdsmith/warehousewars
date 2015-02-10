/* Start Class Monster */
/* 
 * Monster Constructor. Take stage position (x, y). 
 */
function Monster(stage_ref, team_id, hit_points, damage, x, y, floor_num, image_source=null, tick_delay=50) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}	
	
	//Default movement deltas	
	this.dx = 1;
	this.dy = 1;

	this._stage = stage_ref;
	this._actor = new Actor(stage_ref, team_id, hit_points, damage, x, y, floor_num, default_image_source, tick_delay);
}

Monster.prototype.getTeamId = function() {
	return this._actor.getTeamId();
}

Monster.prototype.setTeamId = function(team_id) {
	this._actor.setTeamId(team_id);
}

Monster.prototype.hit = function(attacker_actor, damage_amount) {
	this._actor.hit(attacker_actor, damage_amount);
}

Monster.prototype.heal = function(hit_points) {
	this._actor.heal(hit_points);
}

Monster.prototype.getPosition = function() {
	return this._actor.getPosition();
}

Monster.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._actor.setPosition(x, y, floor_num, subclass_actor);
}

Monster.prototype.getImage = function() {
	return this._actor.getImage();
}

Monster.prototype.setImage = function(image_source) {
	return this._actor.setImage(image_source);
}

Monster.prototype.getDelay = function() {
	return this._actor.getDelay();
}

Monster.prototype.setDelay = function(tick_delay) {
	return this._actor.setDelay(tick_delay);
}

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
	} else if (this._actor.delay()) {
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







