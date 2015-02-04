/* START Class Player */
/*
 * Player constructor.
 */
function Player(x, y, imgsrc) {
	self._actor = new Actor(x, y, imgsrc);
}

Player.prototype.getPosition = function() {
	return self._actor.getPosition();
}

/* END Class Player */
