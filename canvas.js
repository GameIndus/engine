function Canvas(){
	this.canvas;
	this.ctx;

	this.size  = {w: 0, h: 0};
	this.ratio = 1;
}

Canvas.prototype = {

	load: function(id){
		if(typeof id === "string")
			this.canvas = document.getElementById(id);
		else
			this.canvas = id;

		// TODO Improve perf ?
		// 
		// if(this.canvas.style.msInterpolationMode !== undefined)
		// 	this.canvas.style.msInterpolationMode = "nearest-neighbor";
		// else if(this.canvas.style.getPropertyValue("image-rendering") != null)
		// 	this.canvas.style.setProperty("image-rendering", "optimizeSpeed", null);

		this.ctx    = this.canvas.getContext('2d');

		this.updateCanvasRatio();
	},

	updateCanvasRatio: function(){
		if(this.canvas == null || this.ctx == null) return false;
		var deviceRatio  = window.getDevicePixelRatio();
		var backingRatio = this.ctx.webkitBackingStorePixelRatio||this.ctx.mozBackingStorePixelRatio||this.ctx.msBackingStorePixelRatio||this.ctx.oBackingStorePixelRatio||this.ctx.backingStorePixelRatio||1;

		if(deviceRatio != backingRatio){
			this.ratio = deviceRatio / backingRatio;

			var oldWidth  = this.canvas.width;
			var oldHeight = this.canvas.height;

			this.canvas.width  = oldWidth * this.ratio;
			this.canvas.height = oldHeight * this.ratio;

			this.canvas.style.width  = this.canvas.width + "px";
			this.canvas.style.height = this.canvas.height + "px";
		}
	},
	rescale: function(){
		if(this.ctx == null) return false;
		this.getContext().scale(this.ratio, this.ratio);
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

		this.canvas.style.width = this.canvas.width + "px";
		this.canvas.style.height = this.canvas.height + "px";

		this.updateCanvasRatio();
	},

	getSize: function(){
		var size = this.size;

		var getSizeObj = {
			w: (isNaN(size.w)) ? size.w : parseFloat(size.w), 
			h: (isNaN(size.h)) ? size.h : parseFloat(size.h),

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