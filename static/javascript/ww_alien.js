/* Start Class Alien */
/* 
 * Alien Constructor. Take stage position (x, y).
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
function Alien(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, image_source=null, tick_delay=20) {
	// Check default image source	
	var default_image_source = "static/icons/alien-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 0;
	this.dy = 0;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, default_image_source, 100);
}

/*
 * Get Alien's team ID
 */
Alien.prototype.getTeamId = function() {
	return this._monster.getTeamId();
}

/*
 * Set Alien's team ID
 */
Alien.prototype.setTeamId = function(team_id) {
	this._monster.setTeamId(team_id);
}

/*
 * Get Alien's damage
 */
Alien.prototype.getDamage = function() {
	return this._monster.getDamage();
}

/*
 * Get Alien's score value
 */
Alien.prototype.getScoreValue = function() {
	return this._monster.getScoreValue();
}

/*
 * Get Alien's x, y, z coordinates
 */
Alien.prototype.getPosition = function() {
	return this._monster.getPosition();
}

/*
 * Set Alien's x, y, z coordinates
 */
Alien.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._monster.setPosition(x, y, floor_num, subclass_actor);
}

/*
 * Get Alien's image
 */
Alien.prototype.getImage = function() {
	return this._monster.getImage();
}

/*
 * Set Alien's image
 */
Alien.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

/*
 * Get Alien's tick_delay
 */
Alien.prototype.getDelay = function() {
	return this._monster.getDelay();
}

/*
 * Set Alien's tick_delay
 */
Alien.prototype.setDelay = function(tick_delay) {
	return this._monster.setDelay(tick_delay);
}

/*
 *	Alien will check if it's dead and remove itself accordingly, otherwise it will move according to the delay
 */
Alien.prototype.tick = function(force_update, subclass_actor=this) {
	if (this.isDead()) {
		this._stage.removeActor(this);
		return true;
	} else if (this._monster.delay()) {
		return this.monsterMove(this.dx, this.dy, this.getPosition()[2], subclass_actor);
	}
	return false;
}

/*
 *	Calls Monster's isDead
 */
Alien.prototype.isDead = function() {
	return this._monster.isDead();
}

/*
 * Tells Alien that attacker_actor is applying damage_amount of damage to it.
 */
Alien.prototype.hit = function(attacker_actor, damage_amount) {
	this._monster.hit(attacker_actor, damage_amount);
}

/*
 * Add hit_points health to Alien
 */
Alien.prototype.heal = function(hit_points) {
	this._monster.heal(hit_points);
}

/*
 *	Alien will check surrounding non occupied tiles and randomly select one of those tiles to move to,
 * if a player is in any of the immediately surrounding tiles, the Alien will switch it's delta vectors
 * to point to the player and not move, but instead apply damage to the player at the rate of it's delay
 */
Alien.prototype.monsterMove = function(dx, dy, floor_num, subclass_actor=this) {	
	var possibleMoves = new Array();	
	var pos = this.getPosition();
	var num_surrounding_actors = 0;

	for (var _dx = -1; _dx <= 1; _dx++) {
		for (var _dy = -1; _dy <= 1; _dy++) {
			if (_dx == 0 && _dy == 0) continue; // Don't need to check player
			
			var actor = this._stage.getActor(pos[0] + _dx, pos[1] + _dy, pos[2]);
			if (!actor) {
				//This will only check surrounding tiles on current floor
				//NOTE(SLatychev): will need to change if we decide to implement vertical movement.
				possibleMoves.push([pos[0] + _dx, pos[1] + _dy]);
			}
			else if (this._stage.hostileTeamInteraction(this, actor)) {
				var actor_pos = actor.getPosition();
				this.dx = actor_pos[0] - pos[0];
				this.dy = actor_pos[1] - pos[1];
				//Apply Damage
				var actor = this._stage.getActor(pos[0] + this.dx, pos[1] + this.dy, pos[2])
				if (actor && this._stage.hostileTeamInteraction(this, actor)) {
					actor.hit(this, this.getDamage());
				}
				return true;
			}
		}
	}
	random_pos_index = Math.floor((Math.random() * possibleMoves.length));
	random_pos = possibleMoves[random_pos_index];
	dx = random_pos[0] - pos[0];
	dy = random_pos[1] - pos[1];
	this.dx = dx;
	this.dy = dy;
	this.setPosition(pos[0]+dx, pos[1]+dy, floor_num, subclass_actor);
	return true;
}

/*
 *	Calls Monster's move
 */
Alien.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.move(dx, dy, floor_num, subclass_actor);
}

/*
 * Alien is not grabable so return false
 */
Alien.prototype.isGrabbable = function() {
	return this._monster.isGrabble();
}





