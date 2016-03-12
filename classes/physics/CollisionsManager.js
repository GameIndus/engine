function CollisionsManager(){

	this.lastCollisions = {};

}

CollisionsManager.prototype = {

	getLastObjectCollided: function(actor){
		return this.lastCollisions[actor];
	},

	getSidesCollided: function(actor){
		var sides = [];

		if(this.checkSideCollisions(actor, "bottom"))
			sides.push("bottom");
		if(this.checkSideCollisions(actor, "top"))
			sides.push("top");
		if(this.checkSideCollisions(actor, "left"))
			sides.push("left");
		if(this.checkSideCollisions(actor, "right"))
			sides.push("right");

		return sides;
	},
	checkSideCollisions: function(actor, side){
		var scene = Game.getCurrentScene();
		
		var checkTile   = this.checkForTile(actor, side);
		var checkObject = this.checkForObject(actor, side);

		// console.log(checkTile);

		return (checkTile||checkObject) ? true : false;
	},

	checkForTile: function(actor, direction){
		var scene   = Game.getCurrentScene();
		if(scene.getTileMap()==null) return false;
		var tilemap = scene.getTileMap();

		var pos = actor.getTilePositions(direction);
		lastCheck = pos;

		for(var i = 0; i < 10; i++){
			if(tilemap.hasCollisionAt(pos.x, pos.y, i)){
				// Fix actor position & return true
				var tileAt   = actor.getTilePositions();
   			 	var tileSize = tilemap.getFirstTile().size;
    
   				actor.setPosition(tileAt.x * tileSize[0], tileAt.y * tileSize[1]);
				return true;
			}
		}
		
		return false;
	},
	checkForObject: function(actor, direction){
		var scene = Game.getCurrentScene();
		var actorPos = actor.getCenter();

		if(actorPos==null) return false;

		var objectToCheck = null;
		if(direction=="bottom"){
			objectToCheck = scene.getObjectAt(actorPos.x, actor.getBorder("bottom") + 1, undefined, actor);

			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("left"), actor.getBorder("bottom") + 1, undefined, actor);
			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("right"), actor.getBorder("bottom") + 1, undefined, actor);

		}else if(direction=="left"){
			objectToCheck = scene.getObjectAt(actor.getBorder("left") - 1, actorPos.y, undefined, actor);

			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("left") - 1, actor.getBorder("top"), undefined, actor);
			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("left") - 1, actor.getBorder("bottom"), undefined, actor);

		}else if(direction=="top"){
			objectToCheck = scene.getObjectAt(actorPos.x, actor.getBorder("top") - 1, undefined, actor);

			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("left"), actor.getBorder("top") - 1, undefined, actor);
			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("right"), actor.getBorder("top") - 1, undefined, actor);

		}else if(direction=="right"){
			objectToCheck = scene.getObjectAt(actor.getBorder("right") + 1, actorPos.y, undefined, actor);

			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("right") + 1, actor.getBorder("top"), undefined, actor);
			if(objectToCheck === null) objectToCheck = scene.getObjectAt(actor.getBorder("right") + 1, actor.getBorder("bottom"), undefined, actor);

		}

		if(objectToCheck != null && objectToCheck.physicEngine != null){
			this.lastCollisions[actor] = objectToCheck;
			return true;
		}else{
			return false;
		}
	}

};