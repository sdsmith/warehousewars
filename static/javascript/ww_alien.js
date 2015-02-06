/* Start Class Alien */
/* 
 * Alien Constructor. Take stage position (x, y). 
 */
function Alien(stage_ref, x, y, image_source=null) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Test movement deltas	
	this.dx = 0;
	this.dy = 0;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, x, y, default_image_source, 2);
}

Alien.prototype.getPosition = function() {
	return this._monster.getPosition();
}

Alien.prototype.setPosition = function(x, y) {
	return this._monster.setPosition(x, y);
}

Alien.prototype.getImage = function() {
	return this._monster.getImage();
}

Alien.prototype.setImage = function(image_source) {
	return this._monster.setImage(image_source);
}

Alien.prototype.tick = function() {
	return this._monster.tick();
}

/*
 *	Checks surrounding squares and adds up the total number of blocks the monster
 *	is surrounded by, if it is surrounded keep alive for 3 more ticks to ensure
 *	it is really dead
 */
Alien.prototype.isDead = function() {
	return this._monster.isDead();
}

/*
 *	Alien cannot be moved therefore will return false
 */
Alien.prototype.move = function() {
	var deltas = [-1, 0, 1];
	this.dx = Math.floor((Math.random() * 1) -1);
	this.dy = Math.floor((Math.random() * 1) -1);
	return this._monster.move(this.dx, this.dy);
}









