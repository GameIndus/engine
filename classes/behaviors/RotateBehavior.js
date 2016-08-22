function RotateBehavior(options){
	this.angleInterval = (options != null && options.interval != null) ? options.interval : 1;
	this.angleStep     = (options != null && options.step != null) ? options.step : 1;

	this.rotation          = 0;
	this.timeElapsed       = 0;
	this.rotationDivisions = 0;
}

RotateBehavior.prototype = {

	run: function(go){
		this.rotation  = go.angle;
	},

	loop: function(go){
		this.timeElapsed += Game.delta;

		var div = this.timeElapsed / this.angleInterval;

		if(div > this.rotationDivisions){
			this.rotationDivisions++;
			this.rotation += this.angleStep;

			go.rotate(this.rotation);
		}
	}

};