/* Start Class Ghoul */
/* 
 * Ghoul Constructor. Take stage position (x, y). 
 */
function Ghoul(stage_ref, x, y, image_source=null) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 1;
	this.dy = 1;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, x, y, default_image_source, 100);
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
 *	If the ghoul dies remove all its surrounding boxes, then calls Monster's tick
 */
Ghoul.prototype.tick = function(force_update, subclass_actor=this) {
	var ghoul_pos = this.getPosition();
	if(this.isDead) {
		for (var dx = -1; dx <= 1; dx++) {
			for (var dy = -1; dy <= 1; dy++) {
				if (dx == 0 && dy == 0) continue;
				this._stage.removeActor(
					this._stage.getActor(
						ghoul_pos[0] + delta[i], 
						ghoul_pos[1] + delta[j]));
			}
		}
	}

	return this._monster.tick(force_update, subclass_actor=this);
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
Ghoul.prototype.monsterMove = function(dx, dy, floor_num, subclass_actor=this) {
	this.dx = Math.floor((Math.random() * 1) -1);
	this.dy = Math.floor((Math.random() * 1) -1);
	//Add LoS system
	return this._monster.monsterMove(this.dx, this.dy, floor_num, subclass_actor);
}

/*
 *	Calls Monster's move
 */
Ghoul.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.move(dx, dy, floor_num, subclass_actor);
}







