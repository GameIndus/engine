function RpgPhysicEngine(options){
	if(options == null) options = {};
	this.gameobject = null;

	this.lastPosition = new Position();	
	this.lastSidesCollided = [];

	this.direction = null;
}

RpgPhysicEngine.prototype = {

	setGameObject: function(gameobject){
		this.gameobject = gameobject;
	},

	update: function(){
		if(this.gameobject == null) return false;
		if(this.lastPosition.getX() == this.gameobject.getPosition().getX() && this.lastPosition.getY() == this.gameobject.getPosition().getY())
			return false;

		if(this.lastPosition.getX() < this.gameobject.getPosition().getX())
			this.direction = "right";
		else if(this.lastPosition.getX() > this.gameobject.getPosition().getX())
			this.direction = "left";
		else if(this.lastPosition.getY() > this.gameobject.getPosition().getY())
			this.direction = "up";
		else if(this.lastPosition.getY() < this.gameobject.getPosition().getY())
			this.direction = "down";


		this.checkForCollisions();

		this.lastPosition = this.gameobject.getPosition().clone();
	},

	checkForCollisions: function(){
		var tilemap = Game.getCurrentScene().getTileMap();
		if(tilemap == null) return false;

		var lt = this.gameobject.getTilePositions("lefttop");
		var rt = this.gameobject.getTilePositions("righttop");
		var lb = this.gameobject.getTilePositions("leftbottom");
		var cp = this.gameobject.getTilePositions();

		var xArr = [], yArr = [];
		var diffX = Math.abs(rt.x - lt.x) + 1, diffY = Math.abs(lb.y - lt.y) + 1;

		for(var i = 0; i < diffX; i++) xArr.push(lt.x + i);
		for(var i = 1; i < diffY; i++) yArr.push(lt.y + i);

		var coll = null;
		var cell = tilemap.getFirstTile().size;
		var sides = [];
		var tiles = [];

		for(var k = 0; k < 10; k++){
			if(coll == 1) break;
			for(var i = 0; i < xArr.length; i++){
				for(var j = 0; j < yArr.length; j++){ 
					var couple = [xArr[i], yArr[j]];
					coll = tilemap.hasCollisionAt(couple[0], couple[1], k);

					if(coll){
						tiles.push(couple);

						if(couple[0] > cp.x && sides.indexOf("right") == -1) sides.push("right");
						else if(couple[0] < cp.x && sides.indexOf("left") == -1) sides.push("left");

						if(couple[1] > cp.y && sides.indexOf("bottom") == -1) sides.push("bottom");
						else if(couple[1] < cp.y && sides.indexOf("top") == -1) sides.push("top");
					}
				}
			}
		}

		for(var i = 0; i < tiles.length; i++){
			var tile = tiles[i];
			
			if(this.gameobject.getBorder("top") < tile[1] * cell[1] + cell[1] && this.direction == "up" && sides.indexOf("left") > -1)
				this.gameobject.getPosition().setX(tile[0] * cell[0] + cell[0]);
			if(this.gameobject.getBorder("bottom") > tile[1] * cell[1] && this.direction == "down" && sides.indexOf("left") > -1)
				this.gameobject.getPosition().setX(tile[0] * cell[0] + cell[0]);
			if(this.gameobject.getBorder("top") < tile[1] * cell[1] + cell[1] && this.direction == "up" && sides.indexOf("right") > -1)
				this.gameobject.getPosition().setX(tile[0] * cell[0] - this.gameobject.getSize().w - 2);
			if(this.gameobject.getBorder("bottom") > tile[1] * cell[1] && this.direction == "down" && sides.indexOf("right") > -1)
				this.gameobject.getPosition().setX(tile[0] * cell[0] - this.gameobject.getSize().w - 2);

			if(this.gameobject.getBorder("left") < tile[0] * cell[0] + cell[0] && this.direction == "left"
			|| this.gameobject.getBorder("right") > tile[0] * cell[0] && this.direction == "right"){
				this.gameobject.getPosition().setX(this.lastPosition.getX());
			}

			if(this.gameobject.getBorder("bottom") > tile[1] * cell[1] && this.direction == "down"
			|| this.gameobject.getBorder("top") < tile[1] * cell[1] + cell[1] && this.direction == "up"){
				this.gameobject.getPosition().setY(this.lastPosition.getY());
			}

		}

		if(Game.debugMode) window.debugRpgCollisions = {x: xArr, y: yArr, cell: cell};
		this.lastSidesCollided = sides;
	},


	onCollides: function(callback){
		this.collidesEvents.push(callback);
	}

}