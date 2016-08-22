/**
 * ImageRenderer
 * @param {Object} options All options
 * @class
 */
function ImageRenderer(options){
	this.gameobject = null;

	this.name   = (options!=null&&options.name!=null) ? options.name : "default";
	this.pos    = new Position();
	this.objPos = new Position();
	this.size   = [];

	this.flipped     = (options!=null&&options.flipped!=null) ? options.flipped : false;
	this.customSized = (options!=null&&options.customSized!=null) ? options.customSized : false;
}

ImageRenderer.prototype = {

	/**
	 * Define a gameobject to render
	 * @param {GameObject} gameobject The GameObject to render
	 */
	setGameObject: function(gameobject){
		this.gameobject = gameobject.ID;
		this.objPos = gameobject.position;
		this.size = gameobject.size;
	},

	/**
	 * Get veritable center of the current gameobject without Camera offset
	 * @return {Object} X and Y positions in an object
	 */
	getVeritableCenter: function(){
		var scene  = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);

		var x = this.objPos.getX() + (this.size[0]*gameobject.scale/2);
		var y = this.objPos.getY() + (this.size[1]*gameobject.scale/2);

		return {x: x, y: y};
	},


	canBeRendered: function(){
		var scene      = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);
		if(gameobject==null) return false;
		var limits     = Game.getCanvas().getSize();

		// Check for camera
		if(scene.camera != null) limits = scene.camera.getBorders();

		if(gameobject.getBorder("left") > limits.right) return false;
		if(gameobject.getBorder("right") < limits.left) return false;
		if(gameobject.getBorder("bottom") < limits.top) return false;
		if(gameobject.getBorder("top") > limits.bottom) return false;
		
		return true;
	},


	/**
	 * Render the current gameobject
	 * @param  {Integer} dt Current delta time
	 * @return {boolean}    Can return a boolean
	 */
	render: function(dt){
		var scene  = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);
		if(gameobject==null || !this.canBeRendered()) return false;

		var x   = this.pos.getX();
		var y   = this.pos.getY();
		var src = Game.ressources.getRessource(this.name);

		if(src == null) return false;
		Game.getContext().globalAlpha = gameobject.opacity;

		var imgSize = (!this.customSized) ? {w: src.width - x, h: src.height - y} : {w: this.size[0], h: this.size[1]};

		if(this.flipped){
			Game.getContext().save();
			Game.getContext().translate(this.objPos.getX()+(this.size[0]*gameobject.scale/2), this.objPos.getY()+(this.size[1]*gameobject.scale/2));
			Game.getContext().scale(-1, 1);

			Game.getContext().drawImage(src, x, y, imgSize.w, imgSize.h, -this.size[0]*gameobject.scale/2, -this.size[1]*gameobject.scale/2, this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
			Game.getContext().restore();
		}else{
			Game.getContext().drawImage(src, x, y, imgSize.w, imgSize.h, this.objPos.getX(), this.objPos.getY(), this.size[0]*gameobject.scale, this.size[1]*gameobject.scale);
		}

		Game.getContext().globalAlpha = 1;

	}

};