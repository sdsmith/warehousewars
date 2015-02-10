/* Keycode constants */
var key_Q = 81;
var key_W = 87;
var key_E = 69;
var key_A = 65;
var key_D = 68;
var key_Z = 90;
var key_X = 88;
var key_C = 67;
var key_space = 32;



/* START Class Player */
/*
 * Player constructor. Has a default image set. If image_source if set, it will
 * be used as the base image for the actor.
 */
function Player(stage_ref, team_id, hit_points, x, y, floor_num, image_source=null) {
	this._stage = stage_ref;

	// Set actor's image
	var default_image_source = "";
	if (image_source) {
		default_image_source = image_source;
	}
	this._actor = new Actor(stage_ref, team_id, hit_points, 0, 0, x, y, floor_num, image_source, 0);

	// Store value of meta keys
	this.key_shift_pressed = false; // Whether the shift key has been pressed

	// The current actor that is being grabbed
	this.actor_grabbed = null;

	// Player Statistics
	this.stats_steps = 0;
	this.stats_deaths = 0;

	// Sounds
	this._sound_hit = document.getElementById('wwHitSound');
}

/*
 * Return the number of steps taken during this game.
 */
Player.prototype.getStatisticsSteps = function() {
	return this.stats_steps;
}

/*
 * Return the number of deaths had in this game.
 */
Player.prototype.getStatisticsDeaths = function() {
	return this.stats_deaths;
}

Player.prototype.getTeamId = function() {
	return this._actor.getTeamId();
}

Player.prototype.setTeamId = function(team_id) {
	this._actor.setTeamId(team_id);
}

Player.prototype.getHitPoints = function() {
	return this._actor.getHitPoints();
}

Player.prototype.hit = function(attacker_actor, damage_amount) {
	var isDead = this._actor.hit(attacker_actor, damage_amount);
	this._stage.displayPlayerHealth();
	this._sound_hit.play();

	// If we died, end the game
	if (isDead) {
		this.stats_deaths += 1;
		this._stage.endGame();
	}
}

Player.prototype.heal = function(hit_points) {
	this._actor.heal(hit_points);
	this._stage.displayPlayerHealth();
}

/*
 * Return actor's position on the stage as an array [x,y,floor_num].
 */
Player.prototype.getPosition = function() {
	return this._actor.getPosition();
}

/*
 * Set actor's position to the give stage co-ordinates,
 */
Player.prototype.setPosition = function(x, y, floor_num, subclass_actor=this) {
	return this._actor.setPosition(x, y, floor_num, subclass_actor);
}

/*
 * Return actor's image.
 */
Player.prototype.getImage = function() {
	return this._actor.getImage();
}

/*
 * Set actor's image.
 */
Player.prototype.setImage = function(image_source) {
	return this._actor.setImage(image_source);
}

/*
 * Called by objects that want to move Player. The player cannot be moved, and
 * so always returns false.
 */
Player.prototype.move = function(dx, dy, floor_num, subclass_actor=this) {
	return false;
}

/*
 * Move the player dx by dy units relative to the current position immediately.
 * Because this is the player, they skip the normal update loop when moving.
 */
Player.prototype.immediateMove = function(dx, dy, floor_num) {
	var hasMoved = false;

	if (!this._stage.game_paused) {
		var old_pos = this.getPosition();

		if (this._actor.move(dx, dy, floor_num, this)) {
			this.stats_steps += 1;
			hasMoved = true;
			var new_pos = this.getPosition();


			// If shift key pressed and moved on the same floor, drag an object opposite the current move direction
			if (this.key_shift_pressed && old_pos[2] == new_pos[2]) {
				// Check to see if we are grabbing an actor already
				if (this.actor_grabbed) {
					var grabbedactor_pos = this.actor_grabbed.getPosition();
					var new_grabbedactor_pos_x = grabbedactor_pos[0] + dx;
					var new_grabbedactor_pos_y = grabbedactor_pos[1] + dy;

					var on_same_floor = grabbedactor_pos[2] == new_pos[2];
					var is_grabbed_infront = grabbedactor_pos[0] == new_pos[0]+dx && grabbedactor_pos[1] == new_pos[1]+dy && grabbedactor_pos[2] == new_pos[2];

					// Check if we are able to continue grabbing the object
					if (on_same_floor && (is_grabbed_infront || !this._stage.getActor(new_grabbedactor_pos_x, new_grabbedactor_pos_y, grabbedactor_pos[2]))) {
						if (!is_grabbed_infront) {
							// If it is in front of us, we already moved, so we have pushed it.
							this.actor_grabbed.setPosition(new_grabbedactor_pos_x, new_grabbedactor_pos_y, grabbedactor_pos[2], this.actor_grabbed);
							this._stage.immediateActorScreenUpdate(this.actor_grabbed, grabbedactor_pos[0], grabbedactor_pos[1], grabbedactor_pos[2]);
						}
					} else {
						// Grabbed actor can't move, let them go
						this.actor_grabbed = null;
					}
				} else {
					// Grab a new actor
					var actor_pos_x = old_pos[0] - dx;
					var actor_pos_y = old_pos[1] - dy;
					var actor_floor_num = new_pos[2];
					var actor = this._stage.getActor(actor_pos_x, actor_pos_y, actor_floor_num);

					// 'grab' the actor if they exist
					if (actor && actor.isGrabbable()) {
						this.actor_grabbed = actor;
						actor.setPosition(old_pos[0], old_pos[1], actor_floor_num);
						this._stage.immediateActorScreenUpdate(actor, actor_pos_x, actor_pos_y, actor_floor_num);
					}
				}
			}
		}
	}

	return hasMoved;
}

/*
 * Called every stage tick. Player's action is not limited to stage ticks
 * (it reacts instantly), and so performs no operation on stage tick.
 */
Player.prototype.tick = function() {
	return false;
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
	this.key_shift_pressed = event.shiftKey;
	if (!this.key_shift_pressed) {
		// release the actor when we release the shift key
		// TODO(sdsmith): probably want to do this on keypress up.
		this.actor_grabbed = false;
	}
	var pos = this.getPosition();

	switch (keyCode) {
		case key_Q:
			this.immediateMove(-1, -1, pos[2]);
			break;

		case key_W:
			this.immediateMove(-1, 0, pos[2]);
			break;

		case key_E:
			this.immediateMove(-1, 1, pos[2]);
			break;

		case key_A:
			this.immediateMove(0, -1, pos[2]);
			break;

		case key_D:
			this.immediateMove(0, 1, pos[2]);
			break;

		case key_Z:
			this.immediateMove(1, -1, pos[2]);
			break;

		case key_X:
			this.immediateMove(1, 0, pos[2]);
			break;

		case key_C:
			this.immediateMove(1, 1, pos[2]);
			break;

		case key_space:
			// Switch floors (NOTE(sdsmith): assuming there is only two!!!!!)
			var other_floor = (pos[2] + 1) % 2;
			if (this.immediateMove(0, 0, other_floor)) {
				this._stage.drawFloor(other_floor);
			}
	}

	
}
/* END Class Player */
