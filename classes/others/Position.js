function Position(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

Position.prototype = {

	set: function(x, y){
		if(x instanceof Position){
			x = this.hook(x);

			this.setX(x.getX());
			this.setY(x.getY());
			return this;
		}

		this.x = this.hook(x);
		this.y = this.hook(y, true);
		return this;
	},
	get: function(){
		return {x: this.x, y: this.y};
	},

	clone: function(){
		return new Position(this.x, this.y);
	},
	equals: function(pos){
		if(pos == null) return false;
		return this.getX() == pos.getX() && this.getY() == pos.getY();
	},


	setX: function(x){
		this.x = this.hook(x);
	},
	setY: function(y){
		this.y = this.hook(y, true);
	},
	getX: function(){
		return this.x;
	},
	getY: function(){
		return this.y;
	},


	add: function(position){
		position = this.hook(position);

		this.addX(position.getX());
		this.addY(position.getY());
		return this;
	},
	substract: function(position){
		return this.subtract(position);
	},
	subtract: function(position){
		position = this.hook(position);

		this.subtractX(position.getX());
		this.subtractY(position.getY());
		return this;
	},

	addX: function(x){
		this.x = this.hook(this.x + x);
		return this;
	},
	addY: function(y){
		this.y = this.hook(this.y + y, true);
		return this;
	},
	substractX: function(x){
		return this.subtractX(x);
	},
	substractY: function(y){
		return this.subtractY(y);
	},
	subtractX: function(x){
		this.x = this.hook(this.x - x);
		return this;
	},
	subtractY: function(y){
		this.y = this.hook(this.y - y, true);
		return this;
	},


	angleTo: function(pos){
		var piAngle = Math.atan2((this.getY() - pos.getY()), (this.getX() - pos.getX()));
		var deAngle = ((180 * piAngle / Math.PI) - 90) % 360;

		if(deAngle < 0) deAngle += 360;
		return deAngle;
	},
	nearAngleTo: function(pos){
		var angle = this.angleTo(pos);
		var near  = (angle <= 180);

		return (!near) ? -(360 - angle) : angle;
	},
	distanceTo: function(pos){
		var dX = pos.getX() - this.getX(), dY = pos.getY() - this.getY();
		return Math.sqrt(dX * dX  + dY * dY);
	},
	lerpTo: function(pos, factor){
		this.lerpPos    = pos;
		this.lerpFactor = factor;
	},


	// Hook -> allows functions to update the position before apply it
	applyHook: function(func){
		if(this.hooks == null) this.hooks = [];
		this.hooks.push(func);
	},
	hook: function(value, isY){
		if(this.hooks == null || this.hooks.length == 0) return value;
		var tempPos = (!(value instanceof Position)) ? new Position((isY)? this.getX() : value, (isY)? value : this.getY()) : value.clone();

		for(var i = 0; i < this.hooks.length; i++){
			var func = this.hooks[i](tempPos)
			tempPos  = (func != null) ? func : tempPos;
		}

		if(value instanceof Position) return tempPos;
		if(isY) return tempPos.getY();
		else return tempPos.getX();
	}

};