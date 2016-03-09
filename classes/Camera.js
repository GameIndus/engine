/**
 * Camera
 * @class
 */
function Camera(){

	this.scene = null;
	this.gameobject = null;

	this.offset = {x: 0, y: 0};
	this.position = {x: 0, y: 0};
	this.speed = new Vector2();
	this.zoom = 1;

	this.objectLastPosition = {x: 0, y: 0};
	this.objectDistanceCamera = {w: 0, h: 0};
	this.toAdd = {x: 0, y: 0};

	this.canMoveOn = {x: true, y: false};
	this.hasBounds = true;

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
		this.position.x = x;
		this.position.y = y;

		if(this.canMoveOn.x) this.offset.x = -this.position.x;
		if(this.canMoveOn.y) this.offset.y = -this.position.y;
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

	getOffset: function(){
		return this.offset;
	},

	getCenter: function(){
		var cs = Game.getSize();
		return {x: -this.offset.x + cs.getWidth() / 2, y: -this.offset.y +  cs.getHeight() / 2};
	},

	getBorders: function(){
		var cs = Game.getSize();

		return {left: (-parseInt(this.offset.x)), 
				top: (-parseInt(this.offset.y)),
				right: (-parseInt(this.offset.x) + parseInt(cs.getWidth())),
				bottom: (-parseInt(this.offset.y) + parseInt(cs.getHeight()))
		};
	},


	shake: function(force, time){
		this.shakeBeginTime = Date.now();
		this.shakeForce     = force;

		this.shakeDuration  = time;
	},

	/*
	*	Begin & End
 	*/
 	begin: function(){
 		var ctx = Game.getContext();

 		ctx.save();
 		ctx.scale(this.zoom, this.zoom);

 		// Shake module
 		if(this.shakeDuration > 0){
 			var tl = (this.shakeBeginTime + this.shakeDuration) - Date.now();
 			if(tl < 0){
 				this.shakeDuration  = -1;
 				this.shakeBeginTime = -1;
 			}else{
 				var dx = Math.random() * this.shakeForce;
				var dy = Math.random() * this.shakeForce;
				ctx.translate(dx, dy);  
 			}
 		}
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

		if(this.canMoveOn.x) this.offset.x = -this.position.x;
		if(this.canMoveOn.y) this.offset.y = -this.position.y;

	},

	updateFromGameobject: function(){
		if(this.gameobject == null || this.scene == null || this.gameobject.getRenderer() == null) return false;

		var limits = {xLeft: 0, xRight: 10000, yBottom: 10000, yTop: 10000};
		if(this.scene.tilemap != null) limits = this.scene.tilemap.getLimits();

		var gameObjectPos = this.gameobject.getRenderer().getVeritableCenter();
		var canvasSize    = {w: Game.getCanvas().getSize().x, h: Game.getCanvas().getSize().y};
		var middles       = {x: canvasSize.w/2, y: canvasSize.h/2};

		// Speed system
		if(this.speed.x == 0) this.speed.x = 1;
		if(this.speed.y == 0) this.speed.y = 1;
		// TEMP
		if(this.hasBounds) this.speed.x = 1;

		if(this.speed.x > 1 || (this.speed.x >= 0 && this.speed.x != 1)){
			this.objectDistanceCamera.w = gameObjectPos.x - (-this.offset.x + middles.x);
			
			if(this.objectDistanceCamera.w > 1 || this.objectDistanceCamera.w < -1){
				if(this.objectDistanceCamera.w < 0)
					this.toAdd.x++;
				else
					this.toAdd.x--;
			}
		}

		if(this.speed.y > 1 || (this.speed.y >= 0 && this.speed.y != 1)){
			this.objectDistanceCamera.h = gameObjectPos.y - (-this.offset.y + middles.y);
			if(this.objectDistanceCamera.h>1||this.objectDistanceCamera.h<-1){
				if(this.objectDistanceCamera.h<0)
					this.toAdd.y++;
				else
					this.toAdd.y--;
			}
		}


		if(this.hasBounds && this.scene.tilemap != null){
			// Left & Right border
			// if((gameObjectPos.x-middles.x>limits.xLeft)&&(gameObjectPos.x+middles.x<limits.xRight)&&this.canMoveOn.x)
			// 	this.position.x = gameObjectPos.x-middles.x;
			// else
			// 	if(gameObjectPos.x<middles.x)
			// 		this.position.x = 0;

			// // Top & Bottom border
			// if((gameObjectPos.y-middles.y>limits.yTop)&&(gameObjectPos.y+middles.y<=limits.yBottom)&&this.canMoveOn.y)
			// 	this.position.y = gameObjectPos.y-middles.y;
			// else
			// 	if(gameObjectPos.y<middles.y)
			// 		this.position.y = 0;
					
			var currentPosX = gameObjectPos.x - middles.x;
			var currentPosY = gameObjectPos.y - middles.y;


			if(this.position.x <= -limits.xLeft){
				currentPosX = -limits.xLeft;
			}

			this.position.x = currentPosX;
			this.position.y = currentPosY;
		}else{
			this.position.x = gameObjectPos.x - middles.x;
			this.position.y = gameObjectPos.y - middles.y;
		}

		var borders = this.getBorders();

		// Update Camera offset
		var speedMovement = {x: this.toAdd.x * this.speed.x, y: this.toAdd.y * this.speed.y};

		this.offset.x = -this.position.x * this.speed.x + speedMovement.x;
		this.offset.y = -this.position.y * this.speed.y + speedMovement.y;

		this.objectLastPosition = this.gameobject.getCenter();
	}

};