// NOTE(sdsmith): To be more efficient, we could use a render (draw) queue that
// only renders items that have been changed. However this is unecessary for 
// the amount of objects we use.
// NOTE(sdsmith): Could add actors to a tick/update queue so that only items
// that need to be updated on a tick get called.

// BEGIN Class Stage
/*
 * Stage class.
 *
 * Stage has the following grid co-ordinates.
 * 		x,y ---- +ve x
 *		 |
 *		 |
 *		+ve y
 */
function Stage(width, height, stageElementID) {
	// the logical width and height of the stage
	this.width = width;
	this.height = height;
	this.num_floors = 1;
	this.square_dimension = 24;

	this.actors = []; // all actors on this stage (monsters, player, boxes, ...)
	this.player = null; // a special actor, the player

	// the element containing the visual representation of the stage
	this.stageElementID = stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc = document.getElementById('blankImage').src;
	this.monsterImageSrc = document.getElementById('monsterImage').src;
	this.playerImageSrc = document.getElementById('playerImage').src;
	this.boxImageSrc = document.getElementById('boxImage').src;
	this.wallImageSrc = document.getElementById('wallImage').src;

	// Stage Constants
	this.game_paused = false;
	this.box_frequency = 0.40;
	this.monster_frequency = 0.05;

	// Map containing actor positions.
	this.actor_map = new Map(this.width, this.height, this.num_floors);
}

/*
 * Initialize an instance of the game.
 */
Stage.prototype.initialize = function() {
	// Create a table of blank images, give each image an ID so we can reference it later
	var board_html = '<table>\n';
	
	for (var x = 0; x < this.width; x++) {
		board_html += "<tr>\n";
		for (var y = 0; y < this.height; y++) {
			board_html += "<td><img id='stage_"+x+"_"+y+"' width='"+this.square_dimension.toString()+"' height='"+this.square_dimension.toString()+"' src='"+ this.blankImageSrc + "' /></td>\n";
		}
		board_html += "</tr>\n";
	}
	board_html += "</table>\n";
	
	// Put it in the stageElementID (innerHTML)
	document.getElementById(this.stageElementID).innerHTML = board_html;

	// Add walls around the outside of the stage, so actors can't leave the stage
	for(var x = 0; x < this.width; x++){
		for(var y = 0; y < this.height; y++){
			if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1) {
				this.addActor(new Wall(this, x, y, this.wallImageSrc));
			}
		}
	}

	// Add Player to the stage
	this.player = new Player(this, Math.floor(this.width / 2), Math.floor(this.height / 2), this.playerImageSrc);
	this.addActor(this.player);

	var player_pos = this.player.getPosition();

	// Add some Boxes to the stage
	for (var x = 1; x < this.width-1; x++) {
		for (var y = 1; y < this.width-1; y++) {
			if (x == player_pos[0] && y == player_pos[1]) {
				continue;
			}

			if (Math.random() < this.box_frequency) {
				this.addActor(new Box(this, x, y, this.boxImageSrc));
			} 
			else if (Math.random() < this.monster_frequency) {
				this.addActor(new Monster(this, x, y, this.monsterImageSrc));
			}
		}
	}

	// Add in some Monsters
	

	// Force all objects to render in their start state
	this.tick(force_update=true);
}

/*
 * Return the html ID of the provided co-ordinate.
 * Useful for linking stage co-ordinates to the co-responding html objects.
 */
Stage.prototype.getStageId = function(x,y) {
	return "stage_"+x+"_"+y;
}

/*
 * Add given actor to the stage. This updates both the stage actor list and the
 * actor map.
 */
Stage.prototype.addActor = function(actor) {
	// Add actor to list of stage actors
	this.actors.push(actor);

	// Add actor to direct access map
	var pos = actor.getPosition();
	this.actor_map.set(pos[0], pos[1], 0, actor);
}

/*
 * Removes the given actor from the stage and return the removed actor. This 
 * updates both the stage actor list and the actor map.
 */
Stage.prototype.removeActor = function(actor) {
	// Remove from direct access map
	var pos = actor.getPosition();
	this.actor_map.reset(pos[0], pos[1], 0);

	// Remove from list of actors
	var actor_index = this.actors.indexOf(actor);
	return this.actors.splice(actor_index, 1);
}

/*
 * Set the html src of the image at stage location (x,y) to the given src.
 */
Stage.prototype.setImage = function(x, y, src) {
	document.getElementById(this.getStageId(x,y)).src = src;
}

/* 
 * Take one step in the animation of the game. Only updates actor on screen when
 * they say they need an update by returning true on their tick function.
 * Can forcfully update the screen with actors on stage by supplying 
 * force_update=true as a parameter. Actors will be notified in their tick if 
 * they are forcefully being updated.
 */
Stage.prototype.tick = function(force_update=false) {
	if (!this.game_paused || force_update) {
		for(var i = 0; i < this.actors.length; i++){
			var actor_old_pos = this.actors[i].getPosition();
			var changed_visible_state = this.actors[i].tick(force_update); // inform actors they are being forcefully updated.
	
			if (changed_visible_state || force_update) {
				// Set old position to blank
				this.setImage(actor_old_pos[0], actor_old_pos[1], this.blankImageSrc);

				// Update new position with associated image			
				var actor_new_pos = this.actors[i].getPosition();
				this.setImage(actor_new_pos[0], actor_new_pos[1], this.actors[i].getImage());
			}
		}
	}
}

/*
 * Return actor at given co-ordinates, null otherwise. Uses the actor map for
 * direct access, ie. O(1) call.
 */
Stage.prototype.getActor = function(x, y) {
	return this.actor_map.get(x, y, 0);
}

/* TODO(sdsmith): BE MORE DESCRIPTIVE ie. immediateScreenUpdate
 * Updates the given actor on call, regardless of interval callback.
 */
Stage.prototype.immediateMoveUpdate = function(actor, old_x, old_y) {
	// Set old position to blank
	this.setImage(old_x, old_y, this.blankImageSrc);

	// Update new position with associated image			
	var actor_new_pos = actor.getPosition();
	this.setImage(actor_new_pos[0], actor_new_pos[1], actor.getImage());
}

/* TODO(sdsmith): BE MORE DESCRIPTIVE ie. updateActorMapPosition
 * Updates the actor map with the new actor position.
 */
Stage.prototype.updateActorPosition = function(actor, old_x, old_y) {
	this.actor_map.reset(old_x, old_y, 0);
	var pos = actor.getPosition();
	this.actor_map.set(pos[0], pos[1], 0, actor);
}

/*
 * Calls appropriate game action based on given keypdown event.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/Events/keydown
 */
Stage.prototype.processKeydown = function(event) {
	var keyCode = event.keyCode; // Supported by all broswers, but depricated
	// http://www.javascripter.net/faq/keycodes.htm

	// Check if game control key
	if (27 == keyCode) {
		// Escape key
		this.game_paused = !this.game_paused;
	}

	// Check if it is a player control key
	if (65 <= keyCode && keyCode <= 90) {
		this.player.handleKeydown(event);
	}
}
// END Class Stage






