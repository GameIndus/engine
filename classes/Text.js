function Text(text){
	this.text 	  = text;
	this.position = new Position();

	this.font     = "Arial";
	this.fontSize = 16;
	this.color    = "black";
	this.opacity  = 1;

	this.behaviors = [];
}

Text.prototype = {

	appendText: function(text){
		this.text = this.text + text;
	},


	getOpacity: function(){
		return this.opacity;
	},
	getPosition: function(){
		return this.position;
	},
	getSize: function(){
		var ctx = Game.getContext();
		ctx.font = this.fontSize + "px " + this.font;

		var metrics = ctx.measureText(this.text);
		return {w: metrics.width, h: this.fontSize};
	},


	setColor: function(color){
		this.color = color;
	},
	setFont: function(font){
		this.font = font;
	},
	setFontSize: function(fontSize){
		this.fontSize = fontSize;
	},
	setOpacity: function(opacity){
		this.opacity = opacity;
	},
	setPosition: function(x, y){
		this.position.setX(x);
		this.position.setY(y);
	},
	setText: function(text){
		this.text = text;
	},

	
	draw: function(){
		var ctx = Game.getContext();

		ctx.globalAlpha = this.opacity;

		ctx.font = this.fontSize + "px " + this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.position.getX(), this.position.getY() + this.fontSize);
		ctx.fillStyle = "black";

		ctx.globalAlpha = 1;
	}

};