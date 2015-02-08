/* Start Class Monster */
/* 
 * Monster Constructor. Take stage position (x, y). 
 */
function Monster(stage_ref, x, y, floor_num, image_source=null) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}	
	
	//Test movement deltas	
	this.dx = 1;
	this.dy = 1;

	this._stage = stage_ref;
	this._actor = new Actor(stage_ref, x, y, floor_num, default_image_source, 50);
}

/*
 * 
 */
Monster.prototype.getPosition = function() {
	return this._actor.getPosition();
}

Monster.prototype.setPosition = function(x, y, floor_num, sub_class=this) {
	return this._actor.setPosition(x, y, floor_num, sub_class);
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
Monster.prototype.tick = function(force_update, subclass_actor=this) {
//	if(force_update) {
	//TODO(SLatychev): force_update being used temporarily as it may not be called just on initialization later
	/*NOTE(SLatychev): The current state of tick is jerry rigged (if it works at all) because without the force_update
	 * check the tick will fall into the isDead code to try and extract a false result, unfortunately this doesn't occur
	 * instead the monster while being initialized will think it is surrounded by default(check if this is actually true and 
	 * not further broken logic) and mess up the spawn sequence
	 *ADDITONAL NOTE(SLatychev): This tick should always be overridden
	 *
	 */
		if (this.isDead()) {
			this._stage.removeActor(this);
			return true;
		} else if (this._actor.delay()) {
			return this.move(this.dx, this.dy, this.getPosition()[2], subclass_actor);
		}
		return false;
/*	}
	return false;
*/}

/*
 *	Checks surrounding squares and adds up the total number of blocks the
 * monster is surrounded by, if it is surrounded keep alive for 3 more ticks
 * to ensure it is really dead
 */
Monster.prototype.isDead = function() {
/*	var counter = 0;	
	var delta = [-1, 0, 1];
	var monster_pos = this.getPosition();

	for(var i = 0; i < delta.length; i++) {
		for(var j = 0; j < delta.length; j++) {

			var surroundCheck = this._stage.getActor(monster_pos[0] + delta[i], monster_pos[1]+ delta[j]);
			//Individual square check
			if(surroundCheck !== null) {
				counter += 1;

				if(counter === 8) {
					this.deathCheck += 1;
					//Checking for death ensurance
					if(deathCheck === 3) {
						return true;
					}
				}
			}
		}
	}
	counter = 0;
	return false; */

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
 *	(According to test deltas) will move diagonally, if it hits a wall will
 * determine if it is being blocked in the x or y directions and "bounce" in
 * the opposite direction (deltas get sign flipped)
 */
Monster.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
/*	var monster_pos = this._actor.getPosition();
	var new_x = monster_pos[0] + dx;
	var new_y = monster_pos[1] + dy;
	var nNew_x = monster_pos[0] - dx;
	var nNew_y = monster_pos[1] - dy;

	var other_actor = this._stage.getActor(new_x, new_y);
	var relativePos_x = this._stage.getActor(nNew_x, new_y);
	var relativePos_y = this._stage.getActor(new_x, nNew_y);


	//Ricochet collision
	if (other_actor !== null) {
		//TODO(SLatychev): Case hit corner, and gets blocked from behind
		if (relativePos_x !== null) {
			dy = -dy;
		}
		if (relativePos_y !== null) {
			dx = -dx;
		}
		return true; 
	}
	
	this._actor.setPosition(monster_pos[0]+dx, monster_pos[1]+dy, sub_class);
	this._stage.immediateActorScreenUpdate(sub_class, monster_pos[0], monster_pos[1]);
	return true;
*/
	// TODO(sdsmith): need to be careful if the floor_num arameter is not on the same floor as the current monstor. Account for this later.
	var old_pos = this.getPosition();
	var actor = this._stage.getActor(old_pos[0]+dx, old_pos[1]+dy, floor_num);
	
	if (actor) {
		this.dx = -this.dx;
		this.dy = -this.dy;
	} else {
		this.setPosition(old_pos[0]+dx, old_pos[1]+dy, floor_num, subclass_actor);
		this._stage.immediateActorScreenUpdate(subclass_actor, old_pos[0], old_pos[1], old_pos[2])
	}
	return false;
}









