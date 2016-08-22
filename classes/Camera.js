/**
 * Camera
 * @class
 */
function Camera(){
	this.scene      = null;
	this.gameobject = null;

	this.position = new Position();
	this.speed    = new Vector2();
	this.zoom     = 1;

	this.canMoveOn       = {x: true, y: true};
	this.moveEndPosition = null;
	this.hasBounds       = true;

	// Shake
	this.shakeDuration  = -1;
	this.shakeBeginTime = -1;
	this.shakeForce     = 10;
}

Camera.prototype = {

	/*
	*	Setters & Getters
	*/
	setScene: function(scene){
		this.scene = scene;
	},

	setPosition: function(x, y){
		this.position.set(x, y);
	},

	setBounds: function(bool){
		this.hasBounds = bool;
	},

	setMoveOn: function(axe, bool){
		if(axe =="X" || axe == "horizontal") this.canMoveOn.x = bool;
		else if(axe == "Y" || axe == "vertical") this.canMoveOn.y = bool;
	},

	setSpeed: function(vector){
		this.speed = vector;
	},

	setZoom: function(zoom){
		this.zoom = zoom;
	},

	getCenter: function(){
		var cs = Game.getSize();
		return new Position(this.position.getX() + cs.getWidth() / 2, this.position.getY() + cs.getHeight() / 2);
	},

	getBorders: function(){
		var cs = Game.getSize();

		return {left: (this.position.getX()), 
				top: (this.position.getY()),
				right: (this.position.getX() + parseInt(cs.getWidth())),
				bottom: (this.position.getY() + parseInt(cs.getHeight()))
		};
	},

	getPosition: function(){
		return this.position;
	},


	shake: function(force, time){
		this.shakeBeginTime = Date.now();
		this.shakeForce     = force;

		this.shakeDuration  = time * 1000;
	},
	moveTo: function(position){
		this.moveEndPosition = position;
	},

	/*
	*	Begin & End
 	*/
 	begin: function(){
 		var ctx = Game.getContext();

 		ctx.save();
 		ctx.translate(-this.position.getX(), -this.position.getY());

 		// Shake module
 		if(this.shakeDuration > 0){
 			var tl = (this.shakeBeginTime + this.shakeDuration) - Date.now();
 			if(tl < 0){
 				this.shakeDuration  = -1;
 				this.shakeBeginTime = -1;
 			}else{
 				var sx = Math.round(Math.random()) * 2 - 1;
 				var sy = Math.round(Math.random()) * 2 - 1;

 				var dx = (Math.random() * this.shakeForce) * sx;
				var dy = (Math.random() * this.shakeForce) * sy;
				ctx.translate(-this.position.getX() + dx, -this.position.getY() + dy);  
 			}
 		}
 		
 		ctx.scale(this.zoom, this.zoom);
 	},

 	end: function(){
 		Game.getContext().restore();
 	},

	/*
	* 	Others
	*/
	attachTo: function(gameobject){
		var that = this;
		this.gameobject = gameobject;
	},

	checkForMove: function(){
		var canvasMiddleWidth = Game.getCanvas().getSize().getWidth() / 2;
		if(this.gameobject.position.getX() >= canvasMiddleWidth){
			var limits = this.scene.getTileMap().getLimits();
			var pos    = this.gameobject.position;

			if(pos.getX() + canvasMiddleWidth <= limits.xRight) return true; 

		}else if(this.gameobject.getCenter().y<this.objectLastPosition.y){
			if(this.canMoveOn.y) return true;
		}

		return false;
	},

	update: function(){
		if(this.gameobject != null){
			this.updateFromGameobject();
			return false;
		}

		// Move camera to (x, y) with speed, etc...
		if(this.moveEndPosition != null){
			var posF = this.moveEndPosition;
		}
	},
	updateFromGameobject: function(){
		if(this.gameobject == null || this.scene == null || this.gameobject.getRenderer() == null) return false;

		var camCenter    = this.getCenter();
		var position     = this.gameobject.getCenter();
		var canvasSize   = Game.getCanvas().getSize();
		var middles      = {x: canvasSize.getWidth() / 2, y: canvasSize.getHeight() / 2};

		var lerpX = lerp(camCenter.getX(), position.getX(), this.speed.getX());
		var lerpY = lerp(camCenter.getY(), position.getY(), this.speed.getY());

		this.position.set(lerpX - middles.x, lerpY - middles.y);
	}

};