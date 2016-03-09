function Canvas(){
	this.canvas;
	this.ctx;

	this.size = {w: 0, h: 0};
}

Canvas.prototype = {

	load: function(id){
		if(typeof id === "string")
			this.canvas = document.getElementById(id);
		else
			this.canvas = id;
		this.ctx    = this.canvas.getContext('2d');
	},

	getCanvas: function(){
		return this.canvas;
	},

	getContext: function(){
		return this.ctx;
	},

	setSize: function(width, height){
		if(this.canvas == null) return false;
		if(width == "100%") width = window.innerWidth;
		if(height == "100%") height = window.innerHeight-4;

		this.size.w = width;
		this.size.h = height;
		this.canvas.width = this.size.w;
		this.canvas.height = this.size.h;

		if(window.devicePixelRatio == 2){
			this.size.w = width * 2;
			this.size.h = height * 2;
			this.canvas.width = this.size.w;
			this.canvas.height = this.size.h;
		}

		this.canvas.style.width = this.canvas.width + "px";
		this.canvas.style.height = this.canvas.height + "px";
	},

	getSize: function(){
		var size = this.size;

		var getSizeObj = {
			w: size.w, 
			h: size.h,

			getWidth: function(){
				return this.w;
			},
			getHeight: function(){
				return this.h;
			}

		};
		return getSizeObj;
	},

	clear: function(){
		this.ctx.clearRect(0, 0, this.size.w, this.size.h);
	}

};