/* Keycode constants */
var key_Q = 81;
var key_W = 87;
var key_E = 69;
var key_A = 65;
var key_D = 68;
var key_Z = 90;
var key_X = 88;
var key_C = 67;



/* START Class Player */
/*
 * Player constructor.
 */
function Player(x, y, stage_ref) {
	var image_source = ;
	this._actor = new Actor(x, y, image_source);
	this._stage = stage_ref;
}

Player.prototype.getPosition = function() {
	return this._actor.getPosition();
}

Player.prototype.setPosition = function() {
	return this._actor.setPosition();
}

Player.prototype.getImage = function() {
	return this._actor.getImage();
}

Player.prototype.setImage = function(image_source) {
	return this._actor.setImage(image_source);
}

/*
 * Called by objects that want to move Player. The player cannot be moved, and
 * so always returns false.
 */
Player.prototype.move = function(dx, dy) {
	return false;
}

/*
 * Move the player dx by dy units relative to the current position immediately.
 * Because this is the player, they skip the normal update loop when moving.
 */
Player.prototype.immediateMove = function(dx, dy) {
	this._actor.move(dx, dy);
	var pos = this.getPosition();
	this._stage.setImage(pos[0], pos[1], this.getImage());
}

/*
 * Take the given keydown event and perform the appropriate action based on the
 * keycode.
 */
Player.prototype.handleKeydown = function(event) {
	/*
		Move
		q-NW 	w-N 	e-NE 
		a-E 	s- 		d-W 
		z-SW 	x-S 	c-SE
	 */
	var keyCode = event.keyCode;

	switch (keyCode) {
		case key_Q:
			this.immediateMove(-1, -1);

		case key_W:
			this.immediateMove(0, -1);

		case key_E:
			this.immediateMove(1, -1);

		case key_A:
			this.immediateMove(-1, 0);

		case key_D:
			this.immediateMove(1, 0);

		case key_Z:
			this.immediateMove(-1, 1);

		case key_X:
			this.immediateMove(0, 1);

		case key_C:
			this.immediateMove(1, 1);
	}
}
/* END Class Player */
