/* Start Class Ghoul */
/* 
 * Ghoul Constructor. Take stage position (x, y). 
 */
function Ghoul(stage_ref, x, y, floor_num, image_source=null) {
	// Check default image source	
	var default_image_source = "ghoul-24.png";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Default movement deltas	
	this.dx = 1;
	this.dy = 1;

	this._stage = stage_ref;
	this._monster = new Monster(stage_ref, x, y, floor_num, default_image_source, 350);
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
				this._stage.removeActor(this._stage.getActor(ghoul_pos[0] + dx, ghoul_pos[1] + dy, ghoul_pos[2]));
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
Ghoul.prototype.monsterMove = function(dx, dy, floor_num, subclass_actor=this) {
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
		}
	}
	random_pos_index = Math.floor((Math.random() * possibleMoves.length));
	random_pos = possibleMoves[random_pos_index];
	dx = random_pos[0] - pos[0];
	dy = random_pos[1] - pos[1];
	this.setPosition(pos[0]+dx, pos[1]+dy, floor_num, subclass_actor);
	return true;
}

/*
 *	Calls Monster's move
 */
Ghoul.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return this._monster.move(dx, dy, floor_num, subclass_actor);
}







