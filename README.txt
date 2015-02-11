=====FEATURES====
	- front-end MVC
	- direct access map
	- team based interaction resolution
	- gameplay statistics reporting
	- multiple floors (engine supports infinite!)
 	- audio (music, sound effect)
	- 3 working monsters
		- LoS, rand move, explosions
	- grabbing


=====ENGINE DOCUMENTATION=====
==ACTORS
All actors psuedo inherit from the Actor class, which has all the the basic information any actor would need to integrate into the engine. Infact it supplies many prebuilt methods that should never need to be overriden.


==MONSTERS
All monsters psuedo inherit from the Monster class, which has all the basic functionality any NPC would need to move around and apply damage to objects.


==PLAYER
The player is not leashed to the update interval, and moves whenever input is recieved through the engine.


==TEAM BASED INTERACTION
All actors belong to teams. Each team can have unqiue interactions with every other team as defined by the stage's hostileTeamInteraction function. It is possible to define interactions between team A and B that are unique than from team B to A. By default there is a neutral team that will always result in no hostile interaction.


==HEALTH (HIT POINT) SYSTEM
Damage is the engine is done through a hit point based system. All actor are able to apply damage to any other actor based on their team id. An actor is able to gain hit points through a .heal(1), or lose hit points through .hit(2). So see how damage is applied, see the 'damage structure' section.


==SCORE SYSTEM
Each actor has an associated score value that is defined at initialization. When that actor dies, the engine checks if it is an opposing team to the player's. If it is, the score is added to the player's score.


==MOVEMENT STRUCTURE
During an actor's tick or through user input, it may chose to move. When an actor moves, it checks if the desitnation location has an actor in it. If it contains an actor, that actor's .move(4) function is called. The function will return true if it can move, and false if it cannot.


==DIRECT MAPPING SYSTEM
To ensure that getting an actors position was O(1), a direct mapping system was built (ww_map.js). The engine tracks actors both in an array, and this direct map index by (x,y,floor_number). The map tracks a reference to any actor on the stage, and is auto updated when Stage.addActor and Stage.removeActor are called. Positions are updated on the 'actor map' (as we call it) through Stage.updateActorMapPosition(4) whenever they are moved.


==MULTIPLE FLOORS
An intended consequence of the direct mapping system is that floor data is fully stored in an efficient way. This allows the engine to be able to render many floors at the same time without having to have them drawn on the screen. All position are indexed by (x, y, floor_number), and all systems are based in the 3 axis system. Therefore, it allows us to have an infinite number of floors (the limiting factor being the processing time). In the current engine design, all floor are updated at all times, but could be easily extended to do rendering on a by floor basis, only rendering floors that are subscribed to an 'update queue'.


==GAME STEP (TICK) SYSTEM
When the game starts, an update interval is set to callback Stage.tick. Stage.tick goes through the array of all actors, and calls each of their .tick methods. It is up to each actor what they want to do on each .tick. Actor.tick returns a boolean, with is true if there has been any change to the object during the tick that would need to be rendered to the screen. It is up the the discretion of the actor to return the correct value based on the logic.

==GRABBING STRUCTURE
	Actor
		.isGrabbable()
		.move(dx, dy, floor_num, ...)
	
	Player
		.immediateMove(dx, dy, floor_num)

When the player moves and shift has been pressed, the actor in the opposite direction of the move is checked if it is grabbable through Actor.isGrabbable. If it is, the player keeps a reference to the actor and calls its .move with the same dx,dy as it was given. The Player keeps a reference to this actor and will continue to move it with itself until one of three conditions occurs:
	1	- The player moves and does not have shift held
	2	- The player moves to a different floor
	3	- When asked to move, the grabbed object cannot move to the given dx,dy position


==INPUT HANDLING
All keyboard input is directed to the stage, with then directs to any necessary parts of the system for processing. In the current design, the engine handles all global effects (pausing the game), and the player handles all of their own input.


==POSITION AND SCREEN DRAWING SYSTEM
When an actor moves, it is their responsability to inform the engine. This is done through Stage.updateActorMapPosition(4). Actors supply their old position, which is used to reset references to their old position (see 'direct mapping system'). Actors also supply a reference to themselves so that the engine can get their source image and new position to display on the screen. For consistency, an actor by default informs the engine about a position change through Actor.move (however their is no garantee if it is overridden; it is now YOUR responsibility to make sure it happens). The screen update is done after every actor's .tick has returned if and only if it returns true (see 'game step' system). Actors that move out of the .tick update (ie, when they are asked to move) must manually inform the engine to update. This was designed so that their was flexibility in the timing of the screen updating. Actors must call Stage.immediateActorScreenUpdate(4) when they wish to be updated on screen on a case by case basis. By doing it this way, it also allows for more speed in the rendering process, as we are only changing screen tiles when the need to be updated.

There is also a Stage.drawFloor(1) method. This will force the engine to visit each tile and render the appropriate image across the whole screen. This is slow, and so was not chosen as the primary way of rendering objects on the screen. This is used once after the initialization phase of the game, and again on all floor changes.


==VICTORY SYSTEM
The number of members of each team is tracked by the engine, updated when actors are added and removed. When the player dies, they call Stage.endgame(). This function checks the enemy team count; if it is 0, the player has killed all enemies and won. If not, the player lost. Either way, the current statistics for the game are send to the controller to be processed.


==DAMAGE STRUCTURE
	Actor
		- team_id
		.heal(hit_points)
		.hit(attacker_actor, damage_amount)
		.getDamage()
		.getTeamId()
		.setTeamId(team_id)

	Stage
		.hostileTeamInteraction(initiator, target)


	Proceedure is:
		- monster will call .move on target in the move path
		- monster will call resolveTeamInteraction(2)
		- if return is true, the interaction is hostile, monster will call hit(2) on target






