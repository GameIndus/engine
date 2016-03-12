/**
 * Tile
 * @class
 */
function Tile(name, size, pos, objPos, objSize, betweens){
	this.scene = null;

	this.name = name;
	this.pos = pos;
	this.objPos = objPos;
	this.size = size;
	this.layer = 0;

	this.betweenX = (betweens!=undefined&&betweens[0]!=null) ? betweens[0] : 0;
	this.betweenY = (betweens!=undefined&&betweens[1]!=null) ? betweens[1] : 0;

	this.objSize = (objSize!=undefined&&objSize!=null) ? objSize : this.size;

	this.solid = false;
}

Tile.prototype = {

	setLayer: function(layer){
		this.layer = layer;
	},

	render: function(){
		var x = this.pos.x * this.size[0] + this.pos.x * this.betweenX;
		var y = this.pos.y * this.size[1] + this.pos.y * this.betweenY;

		if(!this.canBeRendered(x, y)) return false;

		var offset = {x: 0, y: 0};
		if(this.scene!=null&&this.scene.camera!=null) offset = this.scene.camera.getOffset();

		offset.x = Math.round(offset.x);
		offset.y = Math.round(offset.y);

		Game.getContext().drawImage(Game.ressources.getRessource(this.name), x, y, this.size[0], this.size[1], (this.objPos.x * this.objSize[0])+offset.x, (this.objPos.y * this.objSize[1])+offset.y, this.objSize[0], this.objSize[1]);
	},

	// Edit vars
	setPosition: function(x, y){
		this.pos.x = x;
		this.pos.y = y;
	},

	setSolid: function(bool){
		this.scene.tilemap.setCollisionMap(this.objPos.x, this.objPos.y, bool);
		this.solid = bool;
	},

	isSolid: function(){
		return this.solid;
	},


	getBorder: function(border){
		var offset = {x: 0, y: 0};
		if(this.scene != null && this.scene.camera != null) offset = this.scene.camera.getOffset();

		switch(border){
			case "top":
				return (this.objPos.y * this.objSize[1]) + offset.y;
			case "right":
				return (this.objPos.x * this.objSize[0]) + offset.x + this.objSize[0];
			case "bottom":
				return (this.objPos.y * this.objSize[1]) + offset.y + this.objSize[1];
			case "left":
				return (this.objPos.x * this.objSize[0]) + offset.x;
			default:
				return -1;
		}
	},

	canBeRendered: function(){
		if(this.scene==null) return false;
		var limits = Game.getCanvas().getSize();

		// Check for camera
		var camera = this.scene.camera;
		if(camera!=null) limits = camera.getBorders();

		var rightBorder  = (camera != null) ? this.getBorder("right") - camera.getOffset().x : this.getBorder("right");
		var leftBorder   = (camera != null) ? this.getBorder("left") - camera.getOffset().x : this.getBorder("left");
		var bottomBorder = (camera != null) ? this.getBorder("bottom") - camera.getOffset().y : this.getBorder("bottom");
		var topBorder    = (camera != null) ? this.getBorder("top") - camera.getOffset().y : this.getBorder("top");

		if(rightBorder <= limits.left) return false;
		if(leftBorder >= limits.right) return false;
		if(bottomBorder <= limits.top) return false;
		if(topBorder >= limits.bottom) return false;

		
		return true;
	}

};



window.Tile = Tile;