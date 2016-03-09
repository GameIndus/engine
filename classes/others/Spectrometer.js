function Spectrometer(){
	this.enabled = false;

	this.lastsFPS = [];
	this.updateDelay = 60;

	// Others
	this.currentFrame = 0;
}

Spectrometer.prototype = {

	setEnabled: function(bool){
		this.enabled = bool;
	},

	init: function(){

	},

	update: function(){
		if(!this.enabled) return false;

		if(this.currentFrame % this.updateDelay == 0){
			if(this.lastsFPS.length>49)
				this.lastsFPS.splice(0, 1);

			this.lastsFPS.push(Game.fps);
		}

		this.currentFrame++;
	},

	render: function(){
		if(!this.enabled) return false;

		var ctx = Game.getContext();
		var currentFPS = this.lastsFPS[this.lastsFPS.length-1];

		// Draw context (rects + texts)
		ctx.font = "12px Helvetica";
		ctx.fillStyle = "#343838";
		ctx.fillRect(10, 10, 106, 50);
		ctx.fillStyle = "#ECECEC";
		ctx.fillText("FPS: ", 12, 22);

		ctx.fillStyle = "#ECECEC";
		if(currentFPS>100) currentFPS = 100;
		if(currentFPS == undefined) currentFPS = "--";

		if(new String(currentFPS).length < 3 && new String(currentFPS).length > 1)
			ctx.fillText(currentFPS, 98, 22);
		else if(new String(currentFPS).length < 2)
			ctx.fillText(currentFPS, 105, 22);
		else
			ctx.fillText(currentFPS, 91, 22);


		// Draw Spectrometer
		var posBegin = {x: 112, y: 28};
		var containerSize = {w: 100, h: 30};
		var size = {w: 2, h: 30};

		for(var i=0;i<this.lastsFPS.length;i++){
			ctx.fillStyle = "#DDD";
			var percent    = (this.lastsFPS[i] * size.h) / 100;
			var newHeight = size.h * (percent/100) * 3;

			if(newHeight>size.h) newHeight = size.h;

			ctx.fillRect(posBegin.x-(this.lastsFPS.length-i)*size.w, posBegin.y+(size.h-newHeight), size.w, newHeight);
		}


		ctx.fillStyle = "black";
	}

};