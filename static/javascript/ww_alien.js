/* Start Class Alien */
/* 
 * Alien Constructor. Take stage position (x, y). 
 */
function Alien(stage_ref, x, y, image_source=null) {
	// Check default image source	
	var default_image_source = "static/icons/alien-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 0;
	this.dy = 0;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, x, y, default_image_source, 20);
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
	return this._monster.tick(force_update, subclass_actor);
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
	this.dx = Math.floor((Math.random() * 1) -1);
	this.dy = Math.floor((Math.random() * 1) -1);
	return this._monster.monsterMove(this.dx, this.dy, floor_num, subclass_actor);
}

/*
 *	Calls Monster's move
 */
Alien.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.move(dx, dy, floor_num, subclass_actor);
}







