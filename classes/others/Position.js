function Position(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

Position.prototype = {

	set: function(x, y){
		this.x = x;
		this.y = y;
		return this;
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
		return this;
	},
	substract: function(position){
		this.substractX(position.getX());
		this.substractY(position.getY());
		return this;
	},

	addX: function(x){
		this.x += x;
		return this;
	},
	addY: function(y){
		this.y += y;
		return this;
	},
	substractX: function(x){
		this.x -= x;
		return this;
	},
	substractY: function(y){
		this.y -= y;
		return this;
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