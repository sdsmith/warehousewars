// Stage
// Note: Yet another way to declare a class, using .prototype.

function Stage(width, height, stageElementID) {
	// the logical width and height of the stage
	this.width = width;
	this.height = height;

	this.actors = []; // all actors on this stage (monsters, player, boxes, ...)
	this.player = new Player(Math.floor(this.width / 2), Math.floor(this.height / 2)); // a special actor, the player

	// the element containing the visual representation of the stage
	this.stageElementID = stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc = document.getElementById('blankImage').src;
	this.monsterImageSrc = document.getElementById('monsterImage').src;
	this.playerImageSrc = document.getElementById('playerImage').src;
	this.boxImageSrc = document.getElementById('boxImage').src;
	this.wallImageSrc = document.getElementById('wallImage').src;
}

// initialize an instance of the game
Stage.prototype.initialize = function() {
	// Create a table of blank images, give each image an ID so we can reference it later
	var board_html = '<table>\n';

	for (var x = 0; x < this.width; x++) {
		board_html += "<tr>\n";
		for (var y = 0; y < this.height; y++) {
			board_html += "<td><img id='stage_"+x+"_"+y+"' src='"+ this.blankImageSrc + "' /></td>\n";
		}
		board_html += "</tr>\n";
	}
	board_html += "</table>\n";
	
	// Put it in the stageElementID (innerHTML)
	document.getElementById(this.stageElementID).innerHTML = board_html;

	// Add walls around the outside of the stage, so actors can't leave the stage
	for(var x = 0; x < this.width; x++){
		for(var y = 0; y < this.height; y++){
			this.addActor(new Wall(x, y));
		}
	}

	// Add some Boxes to the stage
	

	// Add in some Monsters
	

}
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId = function(x,y) {
	return "stage_"+x+"_"+y;
}

Stage.prototype.addActor = function(actor) {
	this.actors.push(actor);
}

/*
 * Removes the given actor from the stage and return the removed actor.
 */
Stage.prototype.removeActor = function(actor) {
	// Lookup javascript array manipulation (indexOf and splice).
	var actor_index = this.actors.indexOf(actor);
	return this.actors.splice(actor_index, 1);
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage = function(x, y, src) {
	document.getElementById(this.getStageId(x,y)).innerHTML = "<img src=\""+src+" />";
}

// Take one step in the animation of the game.  
Stage.prototype.tick = function() {
	for(var i = 0; i < this.actors.length; i++){
		this.actors[i].tick();
	}
}

// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor = function(x, y) {
	return null;
}
// End Class Stage






