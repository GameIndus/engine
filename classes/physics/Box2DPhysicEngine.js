/**
 * Box2DPhysicEngine
 * @class
 */
function Box2DPhysicEngine(options){
	if(options == null) options = {};
	this.gameobject = null;

	this.mass       = options.mass || 0;
	this.elasticity = options.elasticity || 0.6;
	this.friction   = options.friction || 0.008;

	this.gravity    = options.gravity || 0.2;
	this.bounce     = options.bounce || false;

	this.checkCollision = {left: true, right: true, up: true, down: true};
	this.collideBounds  = new Rectangle(0, 0, 0, 0);

	this.collideEvents          = [];
	this.lastGameobjectCollided = null;
}

Box2DPhysicEngine.prototype = {

	setGameObject: function(gameobject){
		this.gameobject = gameobject;
		this.collideBounds = new Rectangle(0, 0, Game.getSize().getWidth(), Game.getSize().getHeight());
	},

	update: function(){
		if(this.gameobject == null) return false;

		if(!this.checkWorldCollisions()){
			// Gravity
			this.gameobject.getVelocity().addY(this.mass * this.gravity);
		}

		// Friction
		this.gameobject.getVelocity().setX(this.gameobject.getVelocity().getX() - this.gameobject.getVelocity().getX() * this.friction);
	},

	checkWorldCollisions: function(){
		function checkRectangleCollision(gameobject, rectangle, checkCollision, bounce, elasticity){
			if(checkCollision.up && gameobject.getPosition().getY() <= rectangle.getTop()){
				if(bounce){
					if(gameobject.getVelocity().getY() < 0)
						gameobject.getVelocity().setY(-gameobject.getVelocity().getY() * elasticity); 
				}else{
					gameobject.getVelocity().setY(0);
					gameobject.getPosition().setY(rectangle.getTop());
				}

				return true;
			}
			if(checkCollision.right && gameobject.getPosition().getX() + gameobject.getSize().w >= rectangle.getRight()){
				if(bounce){
					if(gameobject.getVelocity().getX() > 0) 
						gameobject.getVelocity().setX(-gameobject.getVelocity().getX() * elasticity);
				}else{
					gameobject.getVelocity().setX(0);
					gameobject.getPosition().setX(rectangle.getRight() - gameobject.getSize().w);
				}

				return true;
			}
			if(checkCollision.down && gameobject.getPosition().getY() + gameobject.getSize().h >= rectangle.getBottom()){
				if(bounce){
					if(gameobject.getVelocity().getY() > 0) 
						gameobject.getVelocity().setY(-gameobject.getVelocity().getY() * elasticity);
				}else{
					gameobject.getVelocity().setY(0);
					gameobject.getPosition().setY(rectangle.getBottom() - gameobject.getSize().h);
				}

				return true;
			}
			if(checkCollision.left && gameobject.getPosition().getX() <= rectangle.getLeft()){
				if(bounce){
					if(gameobject.getVelocity().getX() < 0) 
						gameobject.getVelocity().setX(-gameobject.getVelocity().getX() * elasticity);
				}else{
					gameobject.getVelocity().setX(0);
					gameobject.getPosition().setX(rectangle.getLeft());
				}

				return true;
			}
		}

		var r = false;

		// Check world collisions
		if(checkRectangleCollision(this.gameobject, this.collideBounds, this.checkCollision, this.bounce, this.elasticity)) r = true;

		// Check others objects collisions
		if(this.isCollided()) r = true;
		
		if(r && this.lastGameobjectCollided != null){
			for(var i = 0; i < this.collideEvents.length; i++)
				this.collideEvents[i](this.gameobject, this.lastGameobjectCollided);
		}

		return r;
	},
	getCollisions: function(){
		var r = null;

		for(var i = 0; i < Game.getCurrentScene().gameobjects.length; i++){
			var go = Game.getCurrentScene().gameobjects[i];
			if(this.collidesWith(go)){
				if(!r) r = new Array();
				r.push(go);
			}
		}

		return r;
	},
	isCollided: function(){
		for(var i = 0; i < Game.getCurrentScene().gameobjects.length; i++){
			var go = Game.getCurrentScene().gameobjects[i];
			if(this.collidesWith(go)) return true;
		}

		return false;
	},
	collidesWith: function(gameobject){
		var checkRectangle = new Rectangle(this.gameobject.getPosition().getX(), this.gameobject.getPosition().getY(), this.gameobject.getSize().w, this.gameobject.getSize().h);
		
		if(gameobject.physicEngine == null) return false;
		if(gameobject.getID() == this.gameobject.getID()) return false;

		function circleCircleCollision(circle, circle2){
			var radius1 = circle.getSize().w / 2, radius2 = circle2.getSize().w / 2;
			return (circle.getPosition().distanceTo(circle2.getPosition()) < radius1 + radius2);
		}
		function circleRectCollision(rectangle, circle){
			var distX = Math.abs(circle.getCenter().getX() - rectangle.getPosition().getX() - rectangle.getSize().w / 2);
		    var distY = Math.abs(circle.getCenter().getY() - rectangle.getPosition().getY() - rectangle.getSize().h / 2);

		    var radius = circle.getSize().w / 2;

		    if (distX > (rectangle.getSize().w / 2 + radius)) return false;
		    if (distY > (rectangle.getSize().h / 2 + radius)) return false;

		    if (distX <= (rectangle.getSize().w / 2)) return true;
		    if (distY <= (rectangle.getSize().h / 2)) return true;

		    var dx = distX - rectangle.getSize().w / 2;
		    var dy = distY - rectangle.getSize().h / 2;
		    return (dx * dx + dy * dy <= (radius * radius));
		}

		var type1 = (gameobject.getRenderer() instanceof GeometricRenderer) ? gameobject.getRenderer().type : "rectangle";
		var type2 = (this.gameobject.getRenderer() instanceof GeometricRenderer) ? this.gameobject.getRenderer().type : "rectangle";

		// Custom shapes collisions
		if(type1 == "circle" && type2 == "circle") return circleCircleCollision(this.gameobject, gameobject);
		if(type1 == "circle" && type2 == "rectangle") return circleRectCollision(this.gameobject, gameobject);
		if(type1 == "rectangle" && type2 == "circle") return circleRectCollision(gameobject, this.gameobject);

		var rect = new Rectangle(gameobject.getPosition().getX(), gameobject.getPosition().getY(), gameobject.getSize().w, gameobject.getSize().h);
		if(checkRectangle.overlap(rect)) return true;
		return false;
	},

	onCollides: function(callback){
		this.collideEvents.push(callback);
	},


	clone: function(){
		var physic = new Box2DPhysicEngine({
			mass: this.mass,
			elasticity: this.elasticity,
			friction: this.friction,

			gravity: this.gravity,
			bounce: this.bounce
		});

		physic.checkCollision         = this.checkCollision;
		physic.collideBounds          = this.collideBounds;
		physic.collideEvents          = this.collideEvents;
		physic.lastGameobjectCollided = this.lastGameobjectCollided;

		if(this.gameobject != null) physic.gameobject = this.gameobject;
		return physic;
	}

}