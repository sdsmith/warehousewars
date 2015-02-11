/* Start Class Ghoul */
/* 
 * Ghoul Constructor. Take stage position (x, y).
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
function Ghoul(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, image_source=null, tick_delay=350) {
	// Check default image source	
	var default_image_source = "ghoul-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 1;
	this.dy = 1;

	//Special ghoul property that defines how far it can "see"
	this.sightRange = 3;
	this.compound_dx = 0;
	this.compound_dy = 0;
	this.chase = false;
	this.run_speed = 0;
	this.explosive_damage = 75;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, default_image_source, 350);
}
/*
 * Get Alien's score value
 */
Alien.prototype.getScoreValue = function() {
	return this._monster.getScoreValue();
}

/*
 * Get Ghoul's team ID
 */
Ghoul.prototype.getTeamId = function() {
	return this._monster.getTeamId();
}

/*
 * Set Ghoul's team ID
 */
Ghoul.prototype.setTeamId = function(team_id) {
	this._monster.setTeamId(team_id);
}

/*
 * Get Ghoul's damage
 */
Ghoul.prototype.getDamage = function() {
	return this._monster.getDamage();
}

/*
 * Tells Ghoul that attacker_actor is applying damage_amount of damage to it.
 */
Ghoul.prototype.hit = function(attacker_actor, damage_amount) {
	this._monster.hit(attacker_actor, damage_amount);
}

/*
 * Add hit_points health to Ghoul
 */
Ghoul.prototype.heal = function(hit_points) {
	this._monster.heal(hit_points);
}

/*
 * Get Ghoul's x, y, z coordinates
 */
Ghoul.prototype.getPosition = function() {
	return this._monster.getPosition();
}

/*
 * Set Ghoul's x, y, z coordinates
 */
Ghoul.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._monster.setPosition(x, y, floor_num, subclass_actor);
}

/*
 * Get Ghoul's image
 */
Ghoul.prototype.getImage = function() {
	return this._monster.getImage();
}

/*
 * Set Ghoul's image
 */
Ghoul.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

/*
 * Get Ghoul's tick_delay
 */
Ghoul.prototype.getDelay = function() {
	return this._monster.getDelay();
}

/*
 * Set Ghoul's tick_delay
 */
Ghoul.prototype.setDelay = function(tick_delay) {
	return this._monster.setDelay(tick_delay);
}

/*
 * Ghoul is not grabable so return false
 */
Ghoul.prototype.isGrabbable = function() {
	return this._monster.isGrabble();
}

/*
 *	Ghoul will check if it is dead and then proceed to "explode", it will remove any neutral actors surrounding  * it, other than Walls, and apply explosive_damage damage to any non neutral actors in the surrounding tiles.
 */
Ghoul.prototype.tick = function(force_update, subclass_actor=this) {
	var ghoul_pos = this.getPosition();
	if(this.isDead()) {
		for (var dx = -1; dx <= 1; dx++) {
			for (var dy = -1; dy <= 1; dy++) {
				var actor = this._stage.getActor(ghoul_pos[0] + dx, ghoul_pos[1] + dy, ghoul_pos[2]);
				//Prevent explosions from taking out walls
				if(!(actor instanceof Wall)) {
					if (actor.getTeamId() != TEAM_NEUTRAL) {
						actor.hit(this, this.explosive_damage);
					} else {
						this._stage.removeActor(actor);
					}
				}
			}
		}
	} else if (this._monster.delay()) {
		return this.monsterMove(this.dx, this.dy, this.getPosition()[2], subclass_actor);
	}
	return false;
}

/*
 *	Calls Monster's isDead
 */
Ghoul.prototype.isDead = function() {
	return this._monster.isDead();
}

/*
 *	Ghoul roams around randomly like the alien but at a much slower rate, however if it spot an actor of a 
 * hostile team, will proceed to chase them and damage the actor at it's accelerated tick_delay
 */
Ghoul.prototype.monsterMove = function(unused_dx, unused_dy, floor_num, subclass_actor=this) {
	var distance = [0, 0];
	var possibleMoves = new Array();	
	var pos = this.getPosition();
	var num_surrounding_actors = 0;

	for (var dx = -1; dx <= 1; dx++) {
		for (var dy = -1; dy <= 1; dy++) {
			if (dx == 0 && dy == 0) continue; // Don't need to check player

			//Reference to surrounding actors
			var actor = this._stage.getActor(pos[0] + dx, pos[1] + dy, pos[2]);
			//No actor spotted in surrounding tile and ghoul is not chasing
			if (!actor && !this.chase) {
				//Add position to possible move set
				possibleMoves.push([pos[0] + dx, pos[1] + dy]);
				
				for (var los = 1; los <= this.sightRange; los++) {

					//ghoul's sight in los direction
					var ghoul_sight = this._stage.getActor(pos[0] + dx + this.compound_dx, pos[1] + dy + this.compound_dy, pos[2]);

					//hostile actor spotted, begin the chase
					if (ghoul_sight && this._stage.hostileTeamInteraction(this, ghoul_sight)) {
						this.chase = true;
						this.setDelay(20);
						distance = [ghoul_sight.getPosition()[0] - pos[0], ghoul_sight.getPosition()[1] - pos[1]];
						break;
					} 
					//non hostile actor spotted or no actors in line of sight
					else if (los == this.sightRange || ghoul_sight && !this._stage.hostileTeamInteraction(this, ghoul_sight)){
						this.compound_dx = 0;
						this.compound_dy = 0;
					} 
					//check next tile in los direction
					else {
						this.compound_dx += dx;
						this.compound_dy += dy;
					}
				}
			} 
			//hostile actor spotted in surrounding tile
			else if (actor && this._stage.hostileTeamInteraction(this, actor)) {
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
		
	//Check if we're chasing
	if (!this.chase) {
		//No chase, move randomly and slowly, and reset the compounding deltas
		this.setDelay(350);
		random_pos_index = Math.floor((Math.random() * possibleMoves.length));
		random_pos = possibleMoves[random_pos_index];
		this.dx = random_pos[0] - pos[0];
		this.dy = random_pos[1] - pos[1];
	} else {
		//Chase in progress, get identity deltas to direct direction of movement and move quickly
		this.compound_dx = 0;
		this.compound_dy = 0;
		this.dx = 0;
		this.dy = 0;
		if (Math.abs(distance[0]) > 0) {
			this.dx = (distance[0] / Math.abs(distance[0]));
			distance[0] -= (distance[0] / Math.abs(distance[0]));
		}
		if (Math.abs(distance[1]) > 0) {
			this.dy = (distance[1] / Math.abs(distance[1]));
			distance[1] -= (distance[1] / Math.abs(distance[1]));
		}
		if (distance[0] == 0 && distance[1] == 0) {
			this.chase = false;
		}
	}
	this.setPosition(pos[0] + this.dx, pos[1] + this.dy, floor_num, subclass_actor);
	return true;
}

/*
 *	Calls Monster's move
 */
Ghoul.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.move(dx, dy, floor_num, subclass_actor);
}







