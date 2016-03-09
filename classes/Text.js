/**
 * Text
 * @class
 */
function Text(text){
	this.text = text;
	this.position = new Position();

	this.font = "Arial";
	this.fontSize = "16px";
	this.color = "black";
}

Text.prototype = {

	setText: function(text){
		this.text = text;
	},

	appendText: function(textToAppend){
		this.text = this.text + textToAppend;
	},

	getSize: function(){
		var ctx = Game.getContext();
		ctx.font = this.fontSize + " " + this.font;

		var metrics = ctx.measureText(this.text);
		return {w: metrics.width, h: parseInt(this.fontSize.substring(0, this.fontSize.length-2))};
	},

	setPosition: function(x, y){
		this.position.setX(x);
		this.position.setY(y);
	},

	getPosition: function(){
		return this.position;
	},

	setFont: function(font){
		this.font = font;
	},

	setFontSize: function(fontSize){
		this.fontSize = fontSize+"px";
	},

	setColor: function(color){
		this.color = color;
	},

	draw: function(){
		var ctx = Game.getContext();
		ctx.font = this.fontSize+" "+this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.position.getX(), this.position.getY());
		ctx.fillStyle = "black";
	}

};