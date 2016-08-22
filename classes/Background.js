/**
 * Background
 * @class
 */
function Background(options){
	this.scene = null;
	this.camera = null;

	this.size = {w: 0, h: 0};
	this.imageSize = {w: 0, h: 0};
	this.position = new Position();
	this.imagePosition = new Position();

	this.color = (options!=null&&options.color!=null) ? options.color : false;
	this.repeat = (options != null && options.repeat != null) ? options.repeat : false;

	this.ressource = (options!=null&&options.name!=null) ? options.name : "default";
	this.velocity             = new Vector2();
	this.defaultImagePosition = new Position();
}

Background.prototype = {

	getPosition: function(){
		return this.position;
	},
	getSize: function(){
		return this.size;
	},
	
	setScene: function(scene){
		this.scene = scene;
	},

	setSize: function(width, height){
		this.size.w = width;
		this.size.h = height;
	},

	setImageSize: function(width, height){
		this.imageSize.w = width;
		this.imageSize.h = height;
	},

	setColor: function(color){
		this.color = color;
	},

	setPosition: function(x, y){
		this.position.set(x, y);
	},

	setImagePosition: function(x, y){
		this.imagePosition.set(x, y);

		this.defaultImagePosition = this.imagePosition.clone();
	},

	setVelocity: function(vector){
		vector.vX = -vector.vX;
		this.velocity = vector;
	},

	attachTo: function(camera){
		this.camera = camera;
	},



	update: function(){
		// TODO New update system
	},

	render: function(){
		var ctx = Game.getContext();
		if(ctx == null) return false;
		
		if(!this.color){
			if(Game.ressources.getRessource(this.ressource)==null) return false;

			var ressource  = Game.ressources.getRessource(this.ressource);
			var globalImageSize = {w: ressource.width, h: ressource.height};

			var width       = (this.size.w!=0) ? this.size.w : Game.canvas.getSize().x;
			var height      = (this.size.h!=0) ? this.size.h : Game.canvas.getSize().y;
			var imageWidth  = (this.imageSize.w!=0) ? this.imageSize.w : Game.canvas.getSize().x;
			var imageHeight = (this.imageSize.h!=0) ? this.imageSize.h : Game.canvas.getSize().y;

			if(this.repeat){
				var pattern = ctx.createPattern(ressource, "repeat");
				
				ctx.rect(this.position.getX(), this.position.getY(), width, height);
				ctx.fillStyle = pattern;
				ctx.fill();
			}else{
				ctx.drawImage(ressource, this.imagePosition.x, this.imagePosition.y, 
					imageWidth, imageHeight, this.position.x, this.position.y, width, height);
			}
		}else{
			var width = (this.size.w!=0) ? this.size.w : Game.canvas.getSize().x;
			var height = (this.size.h!=0) ? this.size.h : Game.canvas.getSize().y;

			ctx.fillStyle = this.color;
			ctx.fillRect(this.position.x, this.position.y, width, height);
			ctx.fillStyle = "black";
		}
	}

};