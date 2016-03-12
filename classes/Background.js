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

	this.ressource = (options!=null&&options.name!=null) ? options.name : "default";
	this.velocity = null;
	this.defaultImagePosition = new Position();
}

Background.prototype = {
	
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
		if(this.velocity==null) return false;
		var velocities = this.velocity.getVelocities();

		if(this.camera==null){
			if(velocities.vX!=0)
				this.imagePosition.x += velocities.vX * Game.delta * 2;
			if(velocities.vY!=0)
				this.imagePosition.y += velocities.vY * Game.delta * 2;
		}else{
			var playerMove = (this.camera.gameobject!=null&&!this.camera.gameobject.canMove);
			var objectDistanceCamera = this.camera.objectDistanceCamera;
			var veloToMultiply = {x: 0, y: 0};
			if((objectDistanceCamera.w>=1||objectDistanceCamera.w<=0)&&(this.camera.checkForMove()||!this.camera.hasBounds)) veloToMultiply.x = objectDistanceCamera.w;

			if(velocities.vX!=0)
				this.imagePosition.x += velocities.vX * Game.delta * 2 * veloToMultiply.x;
			if(velocities.vY!=0)
				this.imagePosition.y += velocities.vY * Game.delta * 2 * 0	
		}
	},

	render: function(){
		if(!this.color){
			if(Game.ressources.getRessource(this.ressource)==null) return false;

			var ressource  = Game.ressources.getRessource(this.ressource);
			var globalImageSize = {w: ressource.width, h: ressource.height};

			var width       = (this.size.w!=0) ? this.size.w : Game.canvas.getSize().x;
			var height      = (this.size.h!=0) ? this.size.h : Game.canvas.getSize().y;
			var imageWidth  = (this.imageSize.w!=0) ? this.imageSize.w : Game.canvas.getSize().x;
			var imageHeight = (this.imageSize.h!=0) ? this.imageSize.h : Game.canvas.getSize().y;

			Game.getContext().drawImage(ressource, this.imagePosition.x, this.imagePosition.y, 
				imageWidth, imageHeight, this.position.x, this.position.y, width, height);

			if(this.velocity!=null){
				if(this.velocity.getVelocities().vX<0){
					Game.getContext().drawImage(ressource, globalImageSize.w-Math.abs(this.imagePosition.x), this.imagePosition.y, 
						imageWidth, imageHeight, this.position.x, this.position.y, width, height);
				}else{
					Game.getContext().drawImage(ressource, -globalImageSize.w+Math.abs(this.imagePosition.x), this.imagePosition.y, 
						imageWidth, imageHeight, this.position.x, this.position.y, width, height);
				}

				if(this.velocity.getVelocities().vY<0){
					Game.getContext().drawImage(ressource, this.imagePosition.x, globalImageSize.h-Math.abs(this.imagePosition.y), 
						imageWidth, imageHeight, this.position.x, this.position.y, width, height);
				}else{
					Game.getContext().drawImage(ressource, this.imagePosition.x, -globalImageSize.h+Math.abs(this.imagePosition.y), 
						imageWidth, imageHeight, this.position.x, this.position.y, width, height);
				}

				if(Math.abs(this.imagePosition.x)>globalImageSize.w) this.imagePosition.x = this.defaultImagePosition.x;
				if(Math.abs(this.imagePosition.y)>globalImageSize.h) this.imagePosition.y = this.defaultImagePosition.y;
			}
		}else{
			var width = (this.size.w!=0) ? this.size.w : Game.canvas.getSize().x;
			var height = (this.size.h!=0) ? this.size.h : Game.canvas.getSize().y;

			Game.getContext().fillStyle = this.color;
			Game.getContext().fillRect(this.position.x, this.position.y, width, height);
			Game.getContext().fillStyle = "black";
		}
	}

};