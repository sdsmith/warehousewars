/* Start Class Patroller */
/* 
 * Patroller Constructor. Take stage position (x, y). 
 */
function Patroller(stage_ref, x, y, floor_num, image_source=null) {
	// Check default image source	
	var default_image_source = "static/icons/face-devil-grin-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 0;
	this.dy = 0;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, x, y, floor_num, default_image_source, 50);
}

Patroller.prototype.getPosition = function() {
	return this._monster.getPosition();
}

Patroller.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._monster.setPosition(x, y, floor_num, subclass_actor);
}

Patroller.prototype.getImage = function() {
	return this._monster.getImage();
}

Patroller.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

Patroller.prototype.getDelay = function() {
	return this._monster.getDelay();
}

Patroller.prototype.setDelay = function(tick_delay) {
	return this._monster.setDelay(tick_delay);
}

Patroller.prototype.isGrabbable = function() {
	return this._monster.isGrabble();
}

/*
 *	Calls Monster's tick
 */
Patroller.prototype.tick = function(force_update, subclass_actor=this) {
	return this._monster.tick(force_update, subclass_actor);
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







