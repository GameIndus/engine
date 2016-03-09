function SingleBehavior(o){
	this.obj = o || {};
}

SingleBehavior.prototype = {

	run: function(go){
		if(this.obj.run != null)
			this.obj.run(go);
	},

	loop: function(go){
		if(this.obj.loop != null)
			this.obj.loop(go);
	}

};