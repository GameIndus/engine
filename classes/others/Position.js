function Position(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

Position.prototype = {

	set: function(x, y){
		this.x = x;
		this.y = y;
	},
	get: function(){
		return {x: this.x, y: this.y};
	},

	clone: function(){
		return new Position(this.x, this.y);
	},


	setX: function(x){
		this.x = x;
	},
	setY: function(y){
		this.y = y;
	},
	getX: function(){
		return this.x;
	},
	getY: function(){
		return this.y;
	},


	add: function(position){
		this.addX(position.getX());
		this.addY(position.getY());
	},
	substract: function(position){
		this.substractX(position.getX());
		this.substractY(position.getY());
	},

	addX: function(x){
		this.x += x;
	},
	addY: function(y){
		this.y += y;
	},
	substractX: function(x){
		this.x -= x;
	},
	substractY: function(y){
		this.y -= y;
	},


	distanceTo: function(pos){
		var dX = pos.getX() - this.getX(), dY = pos.getY() - this.getY();
		return Math.sqrt(dX * dX  + dY * dY);
	},
	lerpTo: function(pos, factor){
		this.lerpPos    = pos;
		this.lerpFactor = factor;
	}

};