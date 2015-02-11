/* Start Class Patroller */
/* 
 * Patroller Constructor. Take stage position (x, y).
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
function Patroller(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, image_source=null, tick_delay=50) {
	// Check default image source	
	var default_image_source = "static/icons/face-devil-grin-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 0;
	this.dy = 0;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, team_id, hit_points, damage, score_value, x, y, floor_num, default_image_source, tick_delay);
}

/*
 * Get Monster's score value
 */
Patroller.prototype.getScoreValue = function() {
	return this._monster.getScoreValue();
}

/*
 * Get Monster's team ID
 */
Patroller.prototype.getTeamId = function() {
	return this._monster.getTeamId();
}

/*
 * Set Monster's team ID
 */
Patroller.prototype.setTeamId = function(team_id) {
	this._monster.setTeamId(team_id);
}

/*
 * Get Monster's damage
 */
Patroller.prototype.getDamage = function() {
	return this._monster.getDamage();
}

/*
 * Tells Monster that attacker_actor is applying damage_amount of damage to it.
 */
Patroller.prototype.hit = function(attacker_actor, damage_amount) {
	this._monster.hit(attacker_actor, damage_amount);
}

/*
 * Add hit_points health to Monster
 */
Patroller.prototype.heal = function(hit_points) {
	this._monster.heal(hit_points);
}

/*
 * Get Monster's x, y, z coordinates
 */
Patroller.prototype.getPosition = function() {
	return this._monster.getPosition();
}

/*
 * Set Monster's x, y, z coordinates
 */
Patroller.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._monster.setPosition(x, y, floor_num, subclass_actor);
}

/*
 * Get Monster's image
 */
Patroller.prototype.getImage = function() {
	return this._monster.getImage();
}

/*
 * Set Monster's image
 */
Patroller.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

/*
 * Get Monster's tick_delay
 */
Patroller.prototype.getDelay = function() {
	return this._monster.getDelay();
}

/*
 * Set Monster's tick_delay
 */
Patroller.prototype.setDelay = function(tick_delay) {
	return this._monster.setDelay(tick_delay);
}

/*
 * Monster is not grabable so return false
 */
Patroller.prototype.isGrabbable = function() {
	return this._monster.isGrabble();
}

/*
 *	Calls Monster's tick
 */
Patroller.prototype.tick = function(force_update, subclass_actor=this) {
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
Patroller.prototype.isDead = function() {
	return this._monster.isDead();
}

/*
 *	Calls Monster's monsterMove
 */
Patroller.prototype.monsterMove = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.monsterMove(this.dx, this.dy, floor_num, subclass_actor);
}

/*
 *	Calls Monster's move
 */
Patroller.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.move(dx, dy, floor_num, subclass_actor);
}







