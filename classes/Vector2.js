/**
 * Vector2
 * @class
 */
function Vector2(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

Vector2.prototype = {

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

	addX: function(x){
		this.x += x;
	},
	addY: function(y){
		this.y += y;
	},

	setAngle: function(angle){
		var length = this.getLength();

		angle = (angle - 90) * Math.PI / 180;

		this.x = Math.cos(angle) * length;
		this.y = Math.sin(angle) * length;
	},
	getAngle: function(){
		return Math.atan2(this.y, this.x);
	},

	setLength: function(length){
		var angle = this.getAngle();

		this.x = Math.cos(angle) * length;
		this.y = Math.sin(angle) * length;
	},
	getLength: function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	add: function(v2){
		this.x += v2.getX();
		this.y += v2.getY();
	}

};