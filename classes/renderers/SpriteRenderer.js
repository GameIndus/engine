/**
 * Sprite Renderer
 * @param {Object} options All options
 * @class
 */
function SpriteRenderer(options){
	this.gameobject = null;

	this.name = options.name;
	this.pos = new Position();
	this.objPos = new Position();
	this.size = [];

	this.speed = 0;
	this.frames = [];
	this.dir = 'horizontal';

	this._index = 0;
	this.done   = false;

	this.animationFinishedEvents = [];
}

SpriteRenderer.prototype = {

	/**
	 * Define a gameobject to render
	 * @param {GameObject} gameobject The GameObject to render
	 */
	setGameObject: function(gameobject){
		this.objPos     = gameobject.position;
		this.gameobject = gameobject.ID;
		this.size       = gameobject.size;
	},

	/**
	 * Get center of the current gameobject
	 * @return {Object} X and Y positions in an object
	 */
	getCenter: function(){
		var offset = {x: 0, y: 0};
		var scene  = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);
		if(gameobject == null) return {x: -1, y: -1};

		var scale = gameobject.scale || 1;
		
		if(scene != null && scene.camera != null) offset = scene.camera.getOffset();

		var x = this.objPos.getX() + (this.size[0] * scale/2) + offset.x;
		var y = this.objPos.getY() + (this.size[1] * scale/2) + offset.y;

		return {x: x, y: y};
	},

	/**
	 * Get veritable center of the current gameobject without Camera offset
	 * @return {Object} X and Y positions in an object
	 */
	getVeritableCenter: function(){
		var scene      = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);
		var x = this.objPos.getX() + (this.size[0] * gameobject.scale / 2);
		var y = this.objPos.getY() + (this.size[1] * gameobject.scale / 2);

		return {x: x, y: y};
	},

	canBeRendered: function(){
		var scene      = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);
		if(gameobject == null) return false;

		var limits     = Game.getCanvas().getSize();
		var offset     = (scene.camera != null) ? scene.camera.offset : {x: 0, y: 0};

		// Check for camera
		if(scene.camera != null) limits = scene.camera.getBorders();

		if(gameobject.getBorder("left") > limits.right) return false;
		if(gameobject.getBorder("right") < limits.left) return false;
		if(gameobject.getBorder("bottom") < limits.top) return false;
		if(gameobject.getBorder("top") > limits.bottom) return false;
		
		return true;
	},

	/**
	 * Update rendered gameobject
	 * @param  {Float} dt Current delta time
	 * @return {void}    
	 */
	update: function(dt){
		var scene      = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);


		// Update gameobject before render it
		gameobject.update(scene);

		if(gameobject.isAnimated && !this.done)
			this._index += this.speed * dt;
	},

	/**
	 * Render the current gameobject
	 * @param  {Integer} dt Current delta time
	 * @return {boolean}    Can return a boolean
	 */
	render: function(dt){
		var scene      = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);

		if(gameobject == null) return false;
		this.update(dt);

		if(!this.canBeRendered()) return false;

		var frame;

		if(gameobject.animations != null
			&& gameobject.animation == null
			&& gameobject.isAnimated) gameobject.setAnimation(Object.keys(gameobject.getAnimations())[0]);
		if(gameobject.animation == null && gameobject.isAnimated) return ;

		if(this.speed > 0){
			var max = this.frames.length;
			var _id = Math.floor(this._index);
			frame   = this.frames[_id % max];

			if(this.once && (_id % max) >= (max - 1)){
				this.done = true;

				for(var i = 0;i < this.animationFinishedEvents.length; i++)
					this.animationFinishedEvents[i]({animation_id: _id, gameobject: this.gameobject});
			}
		}else{
			frame = 0;
		}

		var src = Game.ressources.getRessource(this.name);
		var x = this.pos.getX();
		var y = this.pos.getY();

		if(this.dir == 'horizontal')
			x += frame * this.size[0];
		else
			y += frame * this.size[1];

		if(this.dir == 'horizontal'){
			var numberOut = Math.floor(x/src.width);
			if(numberOut >= 0){ // On sort de l'image -> on rajoute du Y en fonction du nombre de fois que l'on a dépassé l'image
				x -= src.width * numberOut;
				y += this.size[1] * numberOut;
			}
		}


		var offset = {x: 0, y: 0};
		
		if(scene != null && scene.camera != null) offset = scene.camera.getOffset();
		if(Game.ressources.getRessource(this.name) == null) return false;

		var as  = gameobject.getSize();
		var ctx = Game.getCanvas().getContext();
		var pos = gameobject.getCenter();

		// Debug
		if(Config.debugMode){
			ctx.save();

			var rotationPoint = pos;
			ctx.translate(rotationPoint.x, rotationPoint.y);
			ctx.rotate(gameobject.angle * Math.PI / 180);
			ctx.translate(-rotationPoint.x, -rotationPoint.y);

			ctx.beginPath();
			ctx.moveTo(pos.x - as.w / 2, pos.y - as.h / 2);
			ctx.lineTo(pos.x + as.w / 2, pos.y - as.h / 2);
			ctx.lineTo(pos.x + as.w / 2, pos.y + as.h / 2);
			ctx.lineTo(pos.x - as.w / 2, pos.y + as.h / 2);
			ctx.lineTo(pos.x - as.w / 2, pos.y - as.h / 2);
			ctx.strokeStyle = "black";
			ctx.stroke();

			ctx.restore();
		}

		ctx.globalAlpha = gameobject.opacity;

		if(gameobject.animation != null && gameobject.animation.flipped){
			ctx.save();

			if(gameobject.angle != 0){
				var rotationPoint = pos;

				ctx.translate(rotationPoint.x, rotationPoint.y);
				ctx.scale(-1, 1);
				ctx.rotate(gameobject.angle * Math.PI / 180);
				ctx.translate(-rotationPoint.x, -rotationPoint.y);
			}else{
				ctx.translate(this.objPos.getX()+(this.size[0]*gameobject.scale/2)+offset.x, this.objPos.getY()+(this.size[1]*gameobject.scale/2)+offset.y);
				ctx.scale(-1, 1);
			}

			ctx.drawImage(src, x, y, this.size[0], this.size[1], -this.size[0]*gameobject.scale/2, -this.size[1]*gameobject.scale/2, this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
			ctx.restore();
		}else if(gameobject.angle != 0){
			var rotationPoint = pos;

			ctx.save();

			ctx.translate(rotationPoint.x, rotationPoint.y);
			ctx.rotate(gameobject.angle * Math.PI / 180);
			ctx.translate(-rotationPoint.x, -rotationPoint.y);

			ctx.drawImage(src, x, y, this.size[0], this.size[1], pos.x - (this.size[0] * gameobject.scale / 2), pos.y - (this.size[1] * gameobject.scale / 2), this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
			ctx.restore();
		}else{
			ctx.drawImage(src, x, y, this.size[0], this.size[1], this.objPos.getX() + offset.x, this.objPos.getY()+offset.y, this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
		}

		ctx.globalAlpha = 1;

	},



	onAnimationFinished: function(callback){
		this.animationFinishedEvents.push(callback);
	}

};

window.SpriteRenderer = SpriteRenderer;