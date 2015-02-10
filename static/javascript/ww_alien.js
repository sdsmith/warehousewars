/* Start Class Alien */
/* 
 * Alien Constructor. Take stage position (x, y). 
 */
function Alien(stage_ref, team_id, hit_points, damage, x, y, floor_num, image_source=null) {
	// Check default image source	
	var default_image_source = "static/icons/alien-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 0;
	this.dy = 0;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, team_id, hit_points, damage, x, y, floor_num, default_image_source, 100);
}

Alien.prototype.getTeamId = function() {
	return this._monster.getTeamId();
}

Alien.prototype.setTeamId = function(team_id) {
	this._monster.setTeamId(team_id);
}

Alien.prototype.getDamage = function() {
	return this._monster.getDamage();
}

Alien.prototype.hit = function(attacker_actor, damage_amount) {
	this._monster.hit(attacker_actor, damage_amount);
}

Alien.prototype.heal = function(hit_points) {
	this._monster.heal(hit_points);
}

Alien.prototype.getPosition = function() {
	return this._monster.getPosition();
}

Alien.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._monster.setPosition(x, y, floor_num, subclass_actor);
}

Alien.prototype.getImage = function() {
	return this._monster.getImage();
}

Alien.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

Alien.prototype.getDelay = function() {
	return this._monster.getDelay();
}

Alien.prototype.setDelay = function(tick_delay) {
	return this._monster.setDelay(tick_delay);
}

Alien.prototype.isGrabbable = function() {
	return this._monster.isGrabble();
}

/*
 *	Calls Monster's tick
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
 *	Alien moves randomly
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







