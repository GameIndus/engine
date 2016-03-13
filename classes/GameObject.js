/**
 * GameObject
 * @class
 */
function GameObject(size){
	this.ID = -1;

	this.position = new Position();
	this.size = size;

	this.layer = 0;
	this.scale = 1;
	this.angle = 0;
	this.renderer = null;

	// Animation
	this.isAnimated = true;
	this.animations = {};
	this.animation = null;

	// Physics
	this.inAir = false;
	this.physicEngine = null;
	this.velocity = new Vector2();

	// Custom
	this.life     = -1;
	this.jailed   = true;
	this.opacity  = 1;
	this.behavior = null;

	// Custom events (only gameobject)
	this.events = {move: [], jump: [], hidden: []};

	this.updateFrame = 0;
}

GameObject.prototype = {

	getCenter: function(){
		return this.renderer.getCenter();
	},
	getID: function(){
		return this.ID;
	},
	getPosition: function(){
		return this.position;
	},
	getRenderer: function(){
		if(this.renderer == null)
			console.error("Renderer is not defined for gameobject #"+this.ID);
		return this.renderer;
	},
	getSize: function(){
		var sizeW = this.size[0] * this.scale;
		var sizeH = this.size[1] * this.scale;

		return {w: sizeW, h: sizeH};
	},
	getTilePositions: function(border){
		var scene = Game.getCurrentScene();
		if(scene.getTileMap()==null||scene.getTileMap().getFirstTile()==null) return null;

		var ft = scene.getTileMap().getFirstTile();

		var x = Math.floor((this.position.getX()+this.size[0]*this.scale/2)/ft.objSize[0]);
		var y = Math.floor((this.position.getY()+this.size[1]*this.scale/2)/ft.objSize[1]);	

		if(border !== undefined && border == "top")
			y = Math.floor(this.position.getY() / ft.objSize[1]);
		else if(border !== undefined && border == "right")
			x = Math.floor((this.position.getX() + this.size[0]*this.scale) / ft.objSize[0]);
		else if(border !== undefined && border == "bottom")
			y = Math.floor((this.position.getY() + this.size[1]*this.scale) / ft.objSize[1]);
		else if(border !== undefined && border == "left")
			x = Math.floor(this.position.getX() / ft.objSize[0]);

		return {x: x, y: y};
	},
	getVelocity: function(){
		return this.velocity;
	},


	setBehavior: function(behavior){
		this.behavior = behavior;
		
		if(this.behavior != null) this.behavior.run(this);
	},
	setJailed: function(jailed){
		this.jailed = jailed;
	},
	setLayer: function(layer){
		if(layer > Config.layers - 1){
			console.error("Layer "+layer+" is too high ! Max: "+(Config.layers-1));
			return false;
		}
		this.layer = layer;
	},
	setLife: function(life){
		this.life = life;
	},
	setOpacity: function(opacity){
		this.opacity = opacity;
	},
	setPhysicEngine: function(physicEngine){
		physicEngine.gameobject = this;
		this.physicEngine = physicEngine;
	},
	setPosition: function(x, y){
		this.position.set(x, y);

		if(this.renderer != null && this.renderer.objPos != null) this.renderer.objPos = this.position;
	},
	setRenderer: function(renderer){
		this.renderer = renderer;
		this.renderer.setGameObject(this);
	},
	setScale: function(scale){
		this.scale = scale;
	},
	setSize: function(w, h){
		this.size = [w, h];
		if(this.renderer!=null) this.renderer.size = [w, h];
	},
	setVelocity: function(vector){
		this.velocity = vector;
	},
	

	rotate: function(angle){
		this.angle = angle;
	},

	// Animations
	setAnimated: function(bool){
		this.isAnimated = bool;
	},
	defineAnimation: function(name, speed, pos, frames, flipped){
		this.animations[name] = {
			speed: speed,
			pos: pos,
			frames: frames,
			flipped: (flipped != undefined) ? flipped : false
		};
	},
	removeAnimation: function(name){
		delete this.animations[name];
	},
	getAnimations: function(){
		return this.animations;
	},
	setAnimation: function(name){
		if(this.animations[name]==null) return false;
		this.setAnimated(true);
		this.animation = this.animations[name];
		this.animation.name = name;

		this.frames = this.animation.frames;
		this.speed = this.animation.speed;

		if(this.renderer != null){
			this.renderer.speed = this.speed;
			this.renderer.pos.set(this.animation.pos[0], this.animation.pos[1]);
			this.renderer.frames = this.frames;
		}
	},


	/**
	 * Get a border position of gameobject
	 * @param {String} The border to get (top, right, bottom or left)
	 * @return {Float} Float with x or y position of the border
	 */
	getBorder: function(border){
		switch(border){
			case "top":
				return this.getPosition().getY();
			case "right":
				return this.getPosition().getX() + this.getSize().w;
			case "bottom":
				return this.getPosition().getY() + this.getSize().h;
			case "left":
				return this.getPosition().getX();
			default:
				return -1;
		}
	},

	update: function(scene){
		if(this.behavior != null)
			this.behavior.loop(this);

		this.position.addX(this.velocity.getX() * Game.delta * 2);
		this.position.addY(this.velocity.getY() * Game.delta * 2);

		// Check if the gameobject is hidden (or not)
		if(this.events["hidden"].length > 0){
			var s = Game.getSize();
			if(this.getBorder("left") < 0 ||
			   this.getBorder("right") > s.getWidth() ||
			   this.getBorder("top") < 0 ||
			   this.getBorder("bottom") > s.getHeight()) {
				
				for(var i = 0; i < this.events["hidden"].length; i++)
					this.events["hidden"][i](this);

			}
		}

		// Update lerp position
		var pos = this.getPosition();
		if(pos.lerpPos != null && pos.lerpFactor != null){
			this.getPosition().setX(lerp(pos.getX(), pos.lerpPos.getX(), pos.lerpFactor));
			this.getPosition().setY(lerp(pos.getY(), pos.lerpPos.getY(), pos.lerpFactor));

			// Lerp finish
			if(pos.distanceTo(pos.lerpPos) <= 0.001){
				delete pos.lerpPos;
				delete pos.lerpFactor;
			}
		}

		// Update life
		if(this.life != -1) this.life--;
		if(this.life == 0) scene.removeGameObject(this);
	},

	fixPosition: function(){
		var scene  = Game.getCurrentScene();

		if(scene.getTileMap()!==null){

			var pos    = this.getTilePositions();
			if(pos==null) return false;
			var bottomTile = scene.getTileMap().getTileAt(pos.x, pos.y+1);
			if(bottomTile==null) return false;

			var y      = this.getTopBorder().y;
			var fixedY = (bottomTile.objPos.y * bottomTile.objSize[1]) - (this.size[1] * this.scale);

			this.position.setY(fixedY - 0.5);

		}else{

			var scene = Game.getCurrentScene();
			var pos   = this.getCenter();
			var sides = Game.collisionsManager.getSidesCollided(this);

			for(var key in sides){
				var side = sides[key];

				if(side=="bottom"){
					var bottomObj = scene.getObjectAt(pos.x, this.getBottomBorder().y+1, undefined, this);
					if(bottomObj==null) continue ;
					this.position.setY(bottomObj.getCenter().y - bottomObj.size[1] / 2 - this.size[1]);
				}else if(side=="top"){
					var topObj = scene.getObjectAt(pos.x, this.getTopBorder().y-1, undefined, this);
					if(topObj==null) continue ;
					this.position.setY(topObj.getCenter().y + topObj.size[1] / 2);
				}
			}

		}
	},


	// Custom events (only gameobject)
	dispatchEvent: function(name, data){
		if(this.events[name]==null) return false;
		for(var i=0;i<this.events[name].length;i++)
			this.events[name][i](data);
	},

	onMove: function(callback){
		this.events["move"].push(callback);
	},

	onHidden: function(callback){
		this.events["hidden"].push(callback);
	}
	
};

// Temp Actor object for old projects which compile
function Actor(size){GameObject.call(this, size);}
Actor.prototype = Object.create(GameObject.prototype, {});
Actor.prototype.constructor = Actor;