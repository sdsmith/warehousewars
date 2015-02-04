/* START Class Player */
/*
 * Player constructor.
 */
function Player(x, y) {
	var image_source = ;
	this._actor = new Actor(x, y, image_source);
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

Player.prototype.keyboardMove = function() {
	return false;
}
/* END Class Player */
