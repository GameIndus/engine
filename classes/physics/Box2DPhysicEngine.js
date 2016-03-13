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
}

Box2DPhysicEngine.prototype = {

	setGameObject: function(gameobject){
		this.gameobject = gameobject;
		this.collideBounds = new Rectangle(0, 0, Game.getSize().getWidth(), Game.getSize().getHeight());
	},

	update: function(){
		if(this.gameobject == null) return false;

		if(!this.checkForCollisions()){
			// Gravity
			this.gameobject.getVelocity().addY(this.mass * this.gravity);
		}

		// Friction
		this.gameobject.getVelocity().setX(this.gameobject.getVelocity().getX() - this.gameobject.getVelocity().getX() * this.friction);
	},

	checkForCollisions: function(){
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
		// Check world collisions
		if(checkRectangleCollision(this.gameobject, this.collideBounds, this.checkCollision, this.bounce, this.elasticity)) return true;

		// Check others objects collisions
		// for(var i = 0; i < Game.getCurrentScene().gameobjects.length; i++){
		// 	var go = Game.getCurrentScene().gameobjects[i];
		// 	if(go.physicEngine == null) continue;
		// 	if(go.getID() == this.gameobject.getID()) continue;


		// }

		return false;
	},

	reinitVars: function(){
		
	},



	onCollides: function(callback){
		this.collidesEvents.push(callback);
	}

}