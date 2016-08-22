function Particle(options){
	this.scene    = null;
	
	this.size     = {w: 0, h: 0};
	this.position = {x: 0, y: 0};
	this.type     = (options!=null&&options.type!=null) ? options.type : ParticleType.CIRCLE;
	this.canGoOut = (options!=null&&options.canGoOut!=null) ? options.canGoOut : true;
	this.radius   = (options!=null&&options.radius!=null) ? options.radius : 5;
	this.color    = (options!=null&&options.color!=null) ? options.color : 'red';
	this.multicolor = (options!=null&&options.multicolor!=null) ? options.multicolor : false;

	// Don't change this
	this.vX = 0;
	this.vY = 0;
	this.r = 0;this.g = 0;this.b = 0;

	this.remaingingLife = 0.5;
	this.life = -1;
	this.opacity = 1;
}

Particle.prototype = {

	setPosition: function(x, y){
		this.position.x = x;
		this.position.y = y;
	},

	setSize: function(w, h){
		this.size.w = w;
		this.size.h = h;
	},

	setVelocity: function(x, y){
		this.vX = x;
		this.vY = y;
	},

	setLife: function(life){
		this.life = life;
		this.remaingingLife = life;
	},

	setRGBColor: function(r, g, b){
		this.r = r;
		this.g = g;
		this.b = b;
	},

	draw: function(){
		if(this.life>this.maxLife||this.died) return false;
		this.updateColor();
		// Game.getContext().globalCompositeOperation = "lighter";

		if(this.type=="circle"){
			if(this.r!=0&&this.g!=0&&this.b!=0){
				var gradient = Game.getContext().createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, this.radius);
				gradient.addColorStop(0, "rgba("+this.r+", "+this.g+", "+this.b+", "+this.opacity+")");
				gradient.addColorStop(0.5, "rgba("+this.r+", "+this.g+", "+this.b+", "+this.opacity+")");
				gradient.addColorStop(1, "rgba("+this.r+", "+this.g+", "+this.b+", 0)");
				
				Game.getContext().fillStyle = gradient;
			}else{
				var rgba = hexToRgb(this.color);
				if(rgba != null) // Hex
					Game.getContext().fillStyle = "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+this.opacity+")";
				else // String color
					Game.getContext().fillStyle = this.color;
			}

			Game.getContext().arc(this.position.x, this.position.y, this.radius, Math.PI*2, false);
			Game.getContext().fill();
		}

		this.position.x += this.vX;
		this.position.y += this.vY;
		
		// Update Life
		this.remaingingLife--;

		if((this.remaingingLife < 0 || this.radius < 0) && this.life != -1){
			if(this.scene.particles.indexOf(this) > -1)
				this.scene.particles.splice(this.scene.particles.indexOf(this), 1);

			this.died = true;
		}

		// Game.getContext().globalCompositeOperation = "source-over";

		Game.getContext().fillStyle = "black";
	},

	updateColor: function(){
		if(this.life!=0)
			this.opacity = Math.round(this.remaingingLife/this.life*100)/100;

		if(this.multicolor){
			this.r = Math.round(Math.random() * 255);
			this.g = Math.round(Math.random() * 255);
			this.b = Math.round(Math.random() * 255);
		}
	},

};

var ParticleType = function ParticleEffect(){}
ParticleType.CIRCLE = "circle";