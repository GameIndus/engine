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
	},

	getCenter: function(){
		return new Position(this.getLeft() + this.getWidth() / 2, this.getTop() + this.getHeight() / 2);
	},


	overlap: function(rectangle){
		var xOverlap = inRange(this.getX(), rectangle.getX(), rectangle.getX() + rectangle.getWidth()) 
				|| inRange(rectangle.getX(), this.getX(), this.getX() + this.getWidth());
		var yOverlap = inRange(this.getY(), rectangle.getY(), rectangle.getY() + rectangle.getHeight()) 
				|| inRange(rectangle.getY(), this.getY(), this.getY() + this.getHeight());

		return xOverlap && yOverlap;
	},
	inside: function(position){
		if(position == null) return false;
		return inRange(position.getX(), this.getLeft(), this.getRight()) && inRange(position.getY(), this.getTop(), this.getBottom());
	},


	clone: function(){
		return new Rectangle(this.x, this.y, this.w, this.h);
	}

};