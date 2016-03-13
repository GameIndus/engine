function Rectangle(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

Rectangle.prototype = {

	getX: function(){
		return this.x;
	},
	getY: function(){
		return this.y;
	},
	getWidth: function(){
		return this.w;
	},
	getHeight: function(){
		return this.h;
	},

	getTop: function(){
		return this.getY();
	},
	getRight: function(){
		return this.getX() + this.getWidth();
	},
	getBottom: function(){
		return this.getY() + this.getHeight();
	},
	getLeft: function(){
		return this.getX();
	}

};