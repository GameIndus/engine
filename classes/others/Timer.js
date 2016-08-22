function Timer(){
	this.startTime = Date.now();

	this.paused         = false;
	this.startPauseTime = 0;
	this.totalPauseTime = 0;

	window.timers.push(this);
}

Timer.prototype = {

	getTimeElapsed: function(){
		return ((Date.now() - this.totalPauseTime) - this.startTime);
	},

	pause: function(){
		this.paused = true;
		this.startPauseTime = Date.now();
	},
	resume: function(){
		if(!this.paused) return false;
		this.paused = false;

		this.totalPauseTime += Date.now() - this.startPauseTime;
		this.startPauseTime = 0;
	}

};