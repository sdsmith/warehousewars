/* Start Class Monster */

function Monster(x, y, stage_ref) {
	var image_source = ;
	this._actor = new Actor(x, y, image_source, tick_delay=0);
	this._stage = stage_ref;
	this.tick_delay_count = 0;
	this.tick_delay = tick_delay;
	this.dx = 1;
	this.dy = 1;
}

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

Monster.prototype.delay = function() {
	return this.actor.delay();
}

/*
 *	Checks surrounding squares and adds up the total number of blocks the monster
 *	is surrounded by, if it is surrounded keep alive for 3 more ticks to ensure
 *	it is really dead
 */
Monster.prototype.isDead = function() {
	var counter = 0;	
	var locXCoords = [this.pos_x - 1, this.pos_x, this.pos_x + 1];
	var locYCoords = [this.pos_y - 1, this.pos_y, this.pos_y + 1];


	for(var i = 0; i < locXCoords.length; i++) {
		for(var j = 0; j < locYCoords.length; j++) {

			var surroundCheck = this._stage.getActor(locXCoords[i], locYCoords[j]);
			//Individual square check
			if(surroundCheck !== null || locXCoords[i] > this._stage.width || locYCoords[j] > this._stage.height || locXCoords[i] < 0 || locYCoords[j] < 0) {
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
 *	Monster cannot be moved therefore will return false
 */
Monster.prototype.move = function() {
	return false;
}

/*
 *	Monster will move if there is nothing in it's path, it will move in the 
 *	opposite direction if it hits a box or another monster, kill the player
 * or get stuck on the StickyBox actor.
 */
Monster.prototype.moveBehavior = function(dx, dy){
	new_x = this.pos_x + dx;
	new_y = this.pos_y + dy;
	check = this._stage.getActor(new_x, new_y);

	if(check instanceof Player){
		this._stage.removeActor(Player);
		//end game
	}
	if(check instanceof StickyBox){
		return false;
	}
	if(new_x < 0 || new_x > this._stage.width || check !== this._actor){
		this.dx = -this.dx;
	}
	if(new_y < 0 || new_y > this._stage.width || check !== this._actor){
		this.dy = -this.dy;
	}	
	return this._actor.move(dx, dy);		
}

Monster.prototype.tick = function() {
	if(this.isDead){
		this._stage.removeActor(this);
	}

	if(!this.tick_delay){
		return;
	}
	
	this.move(dx, dy);
	return true;
}








