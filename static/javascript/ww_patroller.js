/* Start Class Patroller */
/* 
 * Patroller Constructor. Take stage position (x, y). 
 */
function Patroller(stage_ref, x, y, image_source=null) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 0;
	this.dy = 0;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, x, y, default_image_source, 50);
}

Patroller.prototype.getPosition = function() {
	return this._monster.getPosition();
}

Patroller.prototype.setPosition = function(x, y) {
	return this._monster.setPosition(x, y);
}

Patroller.prototype.getImage = function() {
	return this._monster.getImage();
}

Patroller.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

/*
 *	Calls Monster's tick
 */
Patroller.prototype.tick = function() {
	return this._monster.tick();
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
Patroller.prototype.monsterMove = function() {
	return this._monster.monsterMove(this.dx, this.dy);
}

/*
 *	Calls Monster's move
 */
Patroller.prototype.move = function() {
	return this._monster.move(this.dx, this.dy);
}







