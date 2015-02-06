/* Start Class Monster */
/* 
 * Monster Constructor. Take stage position (x, y). 
 */
function Monster(stage_ref, x, y, image_source=null) {
	// Check default image source	
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}
	
	//Test movement deltas	
	this.dx = 1;
	this.dy = 1;

	this._stage = stage_ref;
	this._actor = new Actor(stage_ref, x, y, default_image_source, 5);
}

/*
 * 
 */
Monster.prototype.getPosition = function() {
	return this._actor.getPosition();
}

Monster.prototype.setPosition = function(x, y) {
	return this._actor.setPosition(x, y);
}

Monster.prototype.getImage = function() {
	return this._actor.getImage();
}

Monster.prototype.setImage = function(image_source) {
	return this._actor.setImage(image_source);
}

/*
 * Will check if monster is dead, will appropriately delay itself if need be,
 * and make itself move
 */
Monster.prototype.tick = function() {
	/*
	if(this.isDead){
		this._stage.removeActor(this);
	}
	*/
	if(!this._actor.delay()){
		return;
	}
	
	this._actor.move(this.dx, this.dy);
	return true;
}

/*
 *	Checks surrounding squares and adds up the total number of blocks the
 * monster is surrounded by, if it is surrounded keep alive for 3 more ticks
 * to ensure it is really dead
 */
Monster.prototype.isDead = function() {
	var counter = 0;	
	var delta = [-1, 0, 1];

	for(var i = 0; i < delta.length; i++) {
		for(var j = 0; j < delta.length; j++) {

			var surroundCheck = this._stage.getActor(this.pos_x + delta[i], 
																this.pos_y + delta[j]);
			//Individual square check
			if(surroundCheck !== null) {
				counter += 1;

				if(counter === 8)	{
					this.deathCheck += 1;
					//Checking for death ensurance
					if(deathCheck === 3){
						return true;
					}
				}
			}
		}
	}
	counter = 0;
	return false;
}

/*
 *	(According to test deltas) will move diagonally, if it hits a wall will
 * determine if it is being blocked in the x or y directions and "bounce" in
 * the opposite direction (deltas get sign flipped)
 */
Monster.prototype.move = function(dx, dy) {

	/*	
	var new_x = this.pos_x + dx;
	var new_y = this.pos_y + dy;
	var nNew_x = this.pos_x - dx;
	var nNew_y = this.pos_y - dy;

	var other_actor = this._stage.getActor(new_x, new_y);
	var bounce_x = this._stage.getActor(nNew_x, new_y);
	var bounce_y = this._stage.getActor(new_x, nNew_y);

	if (other_actor === this._stage.player) {
		//Assuming this property exists
		this._stage.player.killed = true;
	}

	if (other_actor instanceof StickyBox){
		return false;
	}

	//Checks if (dx, -dy) is free to move to
	if (other_actor !== null && bounce_x !== null){
		dy = -dy;
	}

	//Checks if (-dx, dy) is free to move to
	if (other_actor !== null && bounce_y !== null){
		dx = -dx;
	}
	*/

	return this._actor.move(dx, dy);
}









