/**
 * Box2DPhysicEngine
 * @class
 */
function Box2DPhysicEngine(options){
	this.gameobject = null;

	// Bouncing
	this.posBeforeFall = null;
	this.bouncing      = false;
	this.bounceVy      = 100;
	this.bounceAy      = 50;

	// Quotas
	this.maxaY = 1;

	// Fix position
	this.fixedPosition = false;
	this.lastCollision = null;

	this.mass    = options.mass || 0;
	this.reverse = options.reverse || false;
	this.bounce  = options.bounce || false;

	this.aX = 0;
	this.aY = 0;

	this.vX = 0;
	this.vY = 0;

	this.pX = 0;
	this.pY = 0;

	// Events
	this.collidesEvents = [];
}

Box2DPhysicEngine.prototype = {

	updateObject: function(delta){
		// Update acceleration
		this.aY += 0.5;
		if(this.aY>this.maxaY) this.aY = this.maxaY;

		// Update Velocity
		this.vX += this.aX * delta;
		this.vY += this.aY * delta;

		// Update position
		if(!this.reverse){
			this.pX += this.vX * delta * this.mass;
			this.pY += this.vY * delta * this.mass;
		}else{
			this.pX -= this.vX * delta * this.mass;
			this.pY -= this.vY * delta * this.mass;
		}
	},

	update: function(delta){
		this.checkCollisions();

		if(this.mass==0||this.bouncing) return false;
		if(this.gameobject==null) return false;
		if(this.gameobject instanceof Actor && !this.gameobject.canJump) return false;

		if(this.posBeforeFall==null) this.posBeforeFall = this.gameobject.getCenter();

		var collision = false;
		var sidesCollided = Game.collisionsManager.getSidesCollided(this.gameobject);
		if(sidesCollided.length > 0) console.log(sidesCollided);

		// if(!this.reverse) collision = Game.collisionsManager.checkSideCollisions(this.gameobject, "bottom");
		// else collision = Game.collisionsManager.checkSideCollisions(this.gameobject, "top");

		if(!collision){
			this.fixedPosition = false;

			this.updateObject(delta);

			this.gameobject.position.addX(this.pX);
			this.gameobject.position.addY(this.pY);
			this.gameobject.inAir = true;

			if(this.gameobject.behavior!=null){
				this.gameobject.behavior.lastMoveSpeed = {x: 0, y: this.pY};
			}

			this.gameobject.dispatchEvent("move", {actor: this.gameobject});
		}else{
			if(!this.fixedPosition){
				this.gameobject.fixPosition();
					
				// Bounce gameobject
				if(this.bounce&&!this.bouncing){
					var that = this;
					var yToReich = this.posBeforeFall.y+this.mass;

					this.bouncing = true;
					this.bounceVy = this.mass;

					var bi = setInterval(function(){
						if(yToReich>that.gameobject.position[1]){
							that.bouncing = false;that.reinitVars();clearInterval(bi);return false;
						}

						that.bounceAy -= 0.5;
						if(that.bounceAy<0) that.bounceAy = 0;
						that.bounceVy -= that.bounceAy * delta;

						var pY = (that.bounceVy * delta * 2) * that.mass / yToReich * 12;
						if(yToReich>that.gameobject.position[1]) pY /= 16;

						that.gameobject.position[1] -= pY;

						if(that.gameobject.onMoveEvent!=null) that.gameobject.onMoveEvent({actor: that.gameobject});

						that.gameobject.dispatchEvent("move", {actor: that.gameobject});
					}, 1);
				}else{
					this.reinitVars();
				}
			}
		}

		if(collision&&this.lastCollision!=null&&!this.lastCollision){
			this.fixedPosition = true;
		}

		this.lastCollision = collision;
	},

	checkCollisions: function(){
		var cm = Game.collisionsManager;
		var sidesCollided = cm.getSidesCollided(this.gameobject);

		if(sidesCollided.length > 0 && this.collidesEvents.length > 0){
			var lCo = cm.getLastObjectCollided(this.gameobject);

			for(var i = 0; i < this.collidesEvents.length; i++)
				this.collidesEvents[i](this.gameobject, lCo, sidesCollided, lCo.getPosition().clone());
		}
	},


	reinitVars: function(){
		this.aX = 0;
		this.aY = 0;
		this.vX = 0;
		this.vY = 0;
		this.pX = 0;
		this.pY = 2;

		this.gameobject.inAir = false;
		this.posBeforeFall = this.gameobject.getCenter();
	},



	onCollides: function(callback){
		this.collidesEvents.push(callback);
	}

}