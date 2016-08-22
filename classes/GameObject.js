/**
 * GameObject
 * @class
 */
function GameObject(size){
	this.ID   = -1;
	this.name = null;

	this.position = new Position();
	this.size = size || [50, 50];

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
	this.life      = -1;
	this.jailed    = true;
	this.opacity   = 1;
	this.behaviors = [];

	// Custom events (only gameobject)
	this.events = {move: [], jump: [], hidden: []};

	this.updateFrame = 0;
}

GameObject.prototype = {

	getBorder: function(border){
		switch(border){
			case "top":
				return this.getPosition().getY();
			case "right":
				return this.getPosition().getX() + this.getSize().getWidth();
			case "bottom":
				return this.getPosition().getY() + this.getSize().getHeight();
			case "left":
				return this.getPosition().getX();
			default:
				return -1;
		}
	},
	getBordersRectangle: function(){
		return new Rectangle(this.getPosition().getX(), this.getPosition().getY(), this.getSize().getWidth(), this.getSize().getHeight());
	},
	getCenter: function(){
		return new Position(this.getPosition().getX() + this.getSize().w / 2, this.getPosition().getY() + this.getSize().h / 2);
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

		return {
			w: sizeW, 
			h: sizeH,

			getWidth: function(){
				return this.w;
			},
			getHeight: function(){
				return this.h;
			}

		};
	},
	getLayer: function(){
		return this.layer;
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
		else if(border !== undefined && (border == "topleft" || border == "lefttop")){
			x = Math.floor(this.position.getX() / ft.objSize[0]);
			y = Math.floor(this.position.getY() / ft.objSize[1]);
		}else if(border !== undefined && (border == "topright" || border == "righttop")){
			x = Math.floor((this.position.getX() + this.size[0]*this.scale) / ft.objSize[0]);
			y = Math.floor(this.position.getY() / ft.objSize[1]);
		}else if(border !== undefined && (border == "bottomright" || border == "rightbottom")){
			x = Math.floor((this.position.getX() + this.size[0]*this.scale) / ft.objSize[0]);
			y = Math.floor((this.position.getY() + this.size[1]*this.scale) / ft.objSize[1]);
		}else if(border !== undefined && (border == "bottomleft" || border == "leftbottom")){
			x = Math.floor(this.position.getX() / ft.objSize[0]);
			y = Math.floor((this.position.getY() + this.size[1]*this.scale) / ft.objSize[1]);
		}

		return {x: x, y: y};
	},
	getName: function(){
		return this.name;
	},
	getVelocity: function(){
		return this.velocity;
	},


	addBehavior: function(behavior){
		this.behaviors.push(behavior);
	},
	setBehavior: function(behavior){
		this.addBehavior(behavior);
	},
	getBehaviors: function(){
		return this.behaviors;
	},

	setJailed: function(jailed){
		this.jailed = jailed;
	},
	setLayer: function(layer){
		var maxLayers = Config.get("maxLayers");
		
		if(layer > maxLayers - 1){
			console.error("Layer " + layer + " is too high ! Max: " + (maxLayers - 1));
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
		physicEngine.setGameObject(this);
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

	update: function(scene){
		if(this.behaviors.length > 0){
			for(var i = 0; i < this.behaviors.length; i++){
				var b = this.behaviors[i];
				
				if(!b.runned){ b.run(this); b.runned = true; }
				b.loop(this);
			}
		}

		this.position.addX(this.velocity.getX());
		this.position.addY(this.velocity.getY());

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
	},

	clone: function(){
		var go = new GameObject([this.getSize().w / this.scale, this.getSize().h / this.scale]);

		go.getPosition().set(this.getPosition().clone());
		go.setLayer(this.layer + 0);
		go.setOpacity(this.opacity + 0);
		go.rotate(this.angle + 0);
		go.setScale(this.scale);
		go.setAnimated((this.isAnimated) ? true : false);
		go.animations = this.animations.clone();
		if(this.animation != null) go.setAnimation(this.animation.name + "");
		go.setVelocity(this.getVelocity().clone());

		for(var i = 0; i < this.getBehaviors().length; i++){
			var b = this.getBehaviors()[i];
			go.addBehavior(b);
		}

		if(this.renderer != null) go.setRenderer(this.renderer.clone());
		if(this.physicEngine != null) go.setPhysicEngine(this.physicEngine.clone());

		return go;
	}
	
};

// Temp Actor object for old projects & compilation
function Actor(size){GameObject.call(this, size);}
Actor.prototype = Object.create(GameObject.prototype, {});
Actor.prototype.constructor = Actor;