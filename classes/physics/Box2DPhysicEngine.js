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

		console.log(this.collideBounds);
	},

	update: function(){
		if(this.gameobject == null) return false;

		if(!this.checkForCollisions()){
			// Gravity
			this.gameobject.getVelocity().addY(this.mass * this.gravity);
		}

		if(this.mass > 0) console.log(this.gameobject.getVelocity().getY());

		// Friction
		this.gameobject.getVelocity().setX(this.gameobject.getVelocity().getX() - this.gameobject.getVelocity().getX() * this.friction);
	},

	checkForCollisions: function(){
		// Check world collisions
		if(this.checkCollision.up && this.gameobject.getPosition().getY() <= this.collideBounds.getTop()){
			if(this.bounce){
				if(this.gameobject.getVelocity().getY() < 0)
					this.gameobject.getVelocity().setY(-this.gameobject.getVelocity().getY() * this.elasticity); 
			}else{
				this.gameobject.getVelocity().setY(0);
				this.gameobject.getPosition().setY(this.collideBounds.getTop());
			}

			return true;
		}
		if(this.checkCollision.right && this.gameobject.getPosition().getX() + this.gameobject.getSize().w >= this.collideBounds.getRight()){
			if(this.bounce){
				if(this.gameobject.getVelocity().getX() > 0) 
					this.gameobject.getVelocity().setX(-this.gameobject.getVelocity().getX() * this.elasticity);
			}else{
				this.gameobject.getVelocity().setX(0);
				this.gameobject.getPosition().setX(this.collideBounds.getRight() - this.gameobject.getSize().w);
			}

			return true;
		}
		if(this.checkCollision.down && this.gameobject.getPosition().getY() + this.gameobject.getSize().h >= this.collideBounds.getBottom()){
			if(this.bounce){
				if(this.gameobject.getVelocity().getY() > 0) 
					this.gameobject.getVelocity().setY(-this.gameobject.getVelocity().getY() * this.elasticity);
			}else{
				this.gameobject.getVelocity().setY(0);
				this.gameobject.getPosition().setY(this.collideBounds.getBottom() - this.gameobject.getSize().h);
			}

			return true;
		}
		if(this.checkCollision.left && this.gameobject.getPosition().getX() <= this.collideBounds.getLeft()){
			if(this.bounce){
				if(this.gameobject.getVelocity().getX() < 0) 
					this.gameobject.getVelocity().setX(-this.gameobject.getVelocity().getX() * this.elasticity);
			}else{
				this.gameobject.getVelocity().setX(0);
				this.gameobject.getPosition().setX(this.collideBounds.getLeft());
			}

			return true;
		}

		return false;
	},

	reinitVars: function(){
		
	},



	onCollides: function(callback){
		this.collidesEvents.push(callback);
	}

}