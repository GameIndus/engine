/**
 * Sprite Renderer
 * @param {Object} options All options
 * @class
 */
function SpriteRenderer(options){
	this.gameobject = null;

	this.name   = options.name;
	this.pos    = new Position();
	this.objPos = new Position();
	this.size       = [];
	this.spriteSize = [];

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
		this.spriteSize = this.size;
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
		if(!this.canBeRendered()) return false;

		var frame = 0;

		if(gameobject.animations != null
			&& gameobject.animation == null
			&& gameobject.isAnimated) gameobject.setAnimation(Object.keys(gameobject.getAnimations())[0]);
		if(gameobject.animation == null && gameobject.isAnimated) return ;

		if(this.speed > 0 && gameobject.animation.frames.length > 1){
			var max = this.frames.length;
			var _id = Math.floor(this._index);
			frame   = this.frames[_id % max];

			if(this.once && (_id % max) >= (max - 1)){
				this.done = true;

				for(var i = 0; i < this.animationFinishedEvents.length; i++)
					this.animationFinishedEvents[i]({animation_id: _id, gameobject: this.gameobject});
			}
		}

		var src = Game.ressources.getRessource(this.name);
		var x   = this.pos.getX();
		var y   = this.pos.getY();

		var spriteSize = this.spriteSize;
		if((isNaN(spriteSize[0]) || spriteSize[0] == 0) && (isNaN(spriteSize[1]) || spriteSize[1] == 0))
			this.spriteSize = this.size;

		if(this.dir == 'horizontal')
			x += frame * spriteSize[0];
		else
			y += frame * spriteSize[1];

		if(this.dir == 'horizontal'){
			var numberOut = Math.floor(x/src.width);
			if(numberOut >= 0){ // On sort de l'image -> on rajoute du Y en fonction du nombre de fois que l'on a dépassé l'image
				x -= src.width * numberOut;
				y += spriteSize[1] * numberOut;
			}
		}

		if(src == null) return false;

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
				ctx.translate(this.objPos.getX()+(this.size[0]*gameobject.scale/2), this.objPos.getY()+(this.size[1]*gameobject.scale/2));
				ctx.scale(-1, 1);
			}

			ctx.drawImage(src, x, y, spriteSize[0], spriteSize[1], -this.size[0]*gameobject.scale/2, -this.size[1]*gameobject.scale/2, this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
			ctx.restore();
		}else if(gameobject.angle != 0){
			var rotationPoint = pos;

			ctx.save();

			ctx.translate(rotationPoint.x, rotationPoint.y);
			ctx.rotate(gameobject.angle * Math.PI / 180);
			ctx.translate(-rotationPoint.x, -rotationPoint.y);

			ctx.drawImage(src, x, y, spriteSize[0], spriteSize[1], pos.x - (this.size[0] * gameobject.scale / 2), pos.y - (this.size[1] * gameobject.scale / 2), this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
			ctx.restore();
		}else{
			ctx.drawImage(src, x, y, spriteSize[0], spriteSize[1], this.objPos.getX(), this.objPos.getY(), this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
		}

		ctx.globalAlpha = 1;
	},


	clone: function(){
		var renderer = new SpriteRenderer({name: this.name});

		renderer.pos        = this.pos.clone();
		renderer.objPos     = this.objPos.clone();
		renderer.size       = this.size;
		renderer.spriteSize = [0, 0];

		if(this.gameobject != null) renderer.gameobject = this.gameobject;

		return renderer;
	},



	onAnimationFinished: function(callback){
		this.animationFinishedEvents.push(callback);
	}

};

window.SpriteRenderer = SpriteRenderer;