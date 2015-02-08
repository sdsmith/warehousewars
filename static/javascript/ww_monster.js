/* Start Class Monster */
/* 
 * Monster Constructor. Take stage position (x, y). 
 */
function Monster(stage_ref, x, y, image_source=null) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}	
	
	//default movement deltas	
	this.dx = 1;
	this.dy = 1;
	//TODO(SLatychev): Allow monsters to set their delays to allow them to change the delay

	this._stage = stage_ref;
	this._actor = new Actor(stage_ref, x, y, default_image_source, 50);
}

/*
 * 
 */
Monster.prototype.getPosition = function() {
	return this._actor.getPosition();
}

Monster.prototype.setPosition = function(x, y, sub_class=this) {
	return this._actor.setPosition(x, y, sub_class);
}

Monster.prototype.getImage = function() {
	return this._actor.getImage();
}

Monster.prototype.setImage = function(image_source) {
	return this._actor.setImage(image_source);
}

Monster.prototype.isGrabbable = function() {
	return false;
}

/*
 * Will check if monster is dead, will appropriately delay itself if need be,
 * and make itself move
 */
Monster.prototype.tick = function(force_update, sub_class=this) {
	if (this.isDead()) {
		this._stage.removeActor(this);
	} else if (this._actor.delay()) {
		return this.move(this.dx, this.dy, sub_class);
	}
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
			
			var actor = this._stage.getActor(pos[0] + dx, pos[1] + dy);
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
 */
Monster.prototype.move = function(dx, dy, sub_class=this) {
	var old_pos = this.getPosition();

	//Tracks if the monster has bounced
	var bounce = true;
	
	//Basic movement and awareness: next, previous, and opposite vector 
	var prev = this._stage.getActor(old_pos[0]-dx, old_pos[1]-dy);
	var next = this._stage.getActor(old_pos[0]+dx, old_pos[1]+dy);	
	var bounce_x = this._stage.getActor(old_pos[0]-dx, old_pos[1]+dy);
	var bounce_y = this._stage.getActor(old_pos[0]+dx, old_pos[1]-dy);
	
	
	if (next) {
		if (!bounce_x) {
			this.dx = -this.dx;
			bounce = true;
		}
		if (!bounce_y) {
			this.dy = -this.dy;
			bounce = true;
		}
		if (!bounce) {
			if (!prev){
				this.dx = -this.dx;
				this.dy = -this.dy;
			}
			//else we're about to get #rekt
		}
		bounce = false;
	} else {
		this.setPosition(old_pos[0]+dx, old_pos[1]+dy, sub_class);
		this._stage.immediateMoveUpdate(sub_class, old_pos[0], old_pos[1]);
	}
	return false;
}









