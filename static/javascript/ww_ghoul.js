/* Start Class Ghoul */
/* 
 * Ghoul Constructor. Take stage position (x, y). 
 */
function Ghoul(stage_ref, team_id, hit_points, damage, x, y, floor_num, image_source=null) {
	// Check default image source	
	var default_image_source = "ghoul-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 1;
	this.dy = 1;

	//Special ghoul property that defines how far it can "see"
	this.sightRange = 2;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, team_id, hit_points, damage, x, y, floor_num, default_image_source, 350);
}

Ghoul.prototype.getTeamId = function() {
	return this._monster.getTeamId();
}

Ghoul.prototype.setTeamId = function(team_id) {
	this._monster.setTeamId(team_id);
}

Ghoul.prototype.getDamage = function() {
	return this._monster.getDamage();
}

Ghoul.prototype.hit = function(attacker_actor, damage_amount) {
	this._monster.hit(attacker_actor, damage_amount);
}

Ghoul.prototype.heal = function(hit_points) {
	this._monster.heal(hit_points);
}

Ghoul.prototype.getPosition = function() {
	return this._monster.getPosition();
}

Ghoul.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._monster.setPosition(x, y, floor_num, subclass_actor);
}

Ghoul.prototype.getImage = function() {
	return this._monster.getImage();
}

Ghoul.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

Ghoul.prototype.getDelay = function() {
	return this._monster.getDelay();
}

Ghoul.prototype.setDelay = function(tick_delay) {
	return this._monster.setDelay(tick_delay);
}

Ghoul.prototype.isGrabbable = function() {
	return this._monster.isGrabble();
}

/*
 *	If the ghoul is surrounded remove all actors in the 3x3 grid around and including the ghoul
 */
Ghoul.prototype.tick = function(force_update, subclass_actor=this) {
	var ghoul_pos = this.getPosition();
	if(this.isDead()) {
		for (var dx = -1; dx <= 1; dx++) {
			for (var dy = -1; dy <= 1; dy++) {
				var actor = this._stage.getActor(ghoul_pos[0] + dx, ghoul_pos[1] + dy, ghoul_pos[2]);
				//Prevent explosions from taking out walls
				if(!(actor instanceof Wall)) {
					this._stage.removeActor(actor);
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
 *	Ghoul roams around randomly
 */
Ghoul.prototype.monsterMove = function(unused_dx, unused_dy, floor_num, subclass_actor=this) {
	var possibleMoves = new Array();	
	var pos = this.getPosition();
	var num_surrounding_actors = 0;
	var chase = false;

	for (var dx = -1; dx <= 1; dx++) {
		for (var dy = -1; dy <= 1; dy++) {
			if (dx == 0 && dy == 0) continue; // Don't need to check player

			//Reference to surrounding actors
			var actor = this._stage.getActor(pos[0] + dx, pos[1] + dy, pos[2]);
			
			if (!actor) {
				//Only checks current floor, need to change if vertical rotations are implemented
				possibleMoves.push([pos[0] + dx, pos[1] + dy]);
				/*
				//Look ahead and check if we can "see" the player
				for (var los = 1; los <= this.sightRange; los++) {
					var ghoul_sight = this._stage.getActor(pos[0] + dx + los, pos[1] + dy + los, pos[2]);

					//If a target is spotted and is hostile then set chase to true
					if (ghoul_sight && this._stage.hostileTeamInteraction(this, ghoul_sight)) {
						chase = true;

					}
				}
				*/
			}
			//If the actor is hostile then attack the target
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
	this.dx = random_pos[0] - pos[0];
	this.dy = random_pos[1] - pos[1];
	this.setPosition(pos[0] + this.dx, pos[1] + this.dy, floor_num, subclass_actor);
	return true;
}

/*
 *	Calls Monster's move
 */
Ghoul.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.move(dx, dy, floor_num, subclass_actor);
}







