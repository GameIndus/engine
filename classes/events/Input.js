function Input(){

	this.keyDownFuncs = {};
	this.keyUpFuncs = {};
	this.keyPressFuncs = {};
	this.shiftKeyDownFuncs = {};
	this.shiftKeyUpFuncs = {};
	this.shiftKeyPressFuncs = {};

	this.clickFuncs = {};
	this.mouseUpFuncs = {};
	this.mouseDownFuncs = {};
	this.mouseMoveFuncs = {};

	this.touchStartFuncs = {};
	this.touchEndFuncs = {};
	this.touchCancelFuncs = {};
	this.touchMoveFuncs = {};

	this.wheelFuncs = {};

	this.keyDownsActives   = {};
	this.mouseDownsActives = {};

	this.loadEvents();
	this.loadIntervals();
}

Input.prototype = {

	loadEvents: function(){
		var that = this;
		window.addEventListener("keydown", function(e){
			if(Object.keys(that.keyDownsActives).indexOf(e.keyCode + "") == -1) 
				that.keyDownsActives[e.keyCode + ""] = e;

			that.dispatchEvent("keydown", e);
		});
		window.addEventListener("keyup", function(e){
			if(Object.keys(that.keyDownsActives).indexOf(e.keyCode + "") != -1) 
				delete that.keyDownsActives[e.keyCode + ""];

			that.dispatchEvent("keyup", e);
		});
		window.addEventListener("keypress", function(e){
			that.dispatchEvent("keypress", e);
		});
		window.addEventListener("click", function(e){
			that.dispatchEvent("click", e);
		});
		window.addEventListener("mouseup", function(e){
			var b = e.which || e.button;
			if(Object.keys(that.mouseDownsActives).indexOf(b + "") != -1) 
				delete that.mouseDownsActives[b + ""];

			that.dispatchEvent("mouseup", e);
		});
		window.addEventListener("mousedown", function(e){
			var b = e.which || e.button;
			if(Object.keys(that.mouseDownsActives).indexOf(b + "") == -1) 
				that.mouseDownsActives[b + ""] = e;

			that.dispatchEvent("mousedown", e);
		});
		window.addEventListener("mousemove", function(e){
			that.dispatchEvent("mousemove", e);
		});
		window.addEventListener("touchstart", function(e){
			that.dispatchEvent("touchstart", e);
		});
		window.addEventListener("touchend", function(e){
			that.dispatchEvent("touchend", e);
		});
		window.addEventListener("touchcancel", function(e){
			that.dispatchEvent("touchcancel", e);
		});
		window.addEventListener("touchmove", function(e){
			that.dispatchEvent("touchmove", e);
		});
		window.addEventListener("wheel", function(e){
			that.dispatchEvent("wheel", e);
		}, false);
	},
	loadIntervals: function(){
		var that = this;

		var intervalG = function(){
			for(var i = 0; i < Object.keys(that.keyDownsActives).length; i++){
				that.dispatchEvent("keydown", that.keyDownsActives[Object.keys(that.keyDownsActives)[i]], true);
			}
			for(var i = 0; i < Object.keys(that.mouseDownsActives).length; i++){
				that.dispatchEvent("mousedown", that.mouseDownsActives[Object.keys(that.mouseDownsActives)[i]], true);
			}

			requestAnimationFrame(intervalG);
		}

		intervalG();
	},

	dispatchEvent: function(name, event, auto){
		var funcs = null;

		// Cancel dispatching events if the game isn't loaded
		if(Game != null && Game.loader != null && !Game.loader.isLoaded) return false;

		if(!event.shiftKey){
			switch(name){
				case "keydown":
					funcs = this.keyDownFuncs; 
				break;
				case "keyup":
					funcs = this.keyUpFuncs; 
				break;
				case "keypress":
					funcs = this.keyPressFuncs; 
				break;
				case "click":
					funcs = this.clickFuncs; 
				break;
				case "mouseup":
					funcs = this.mouseUpFuncs; 
				break;
				case "mousedown":
					funcs = this.mouseDownFuncs; 
				break;
				case "mousemove":
					funcs = this.mouseMoveFuncs;
				break;
				case "touchstart":
					funcs = this.touchStartFuncs;
				break;
				case "touchend":
					funcs = this.touchEndFuncs;
				break;
				case "touchcancel":
					funcs = this.touchCancelFuncs;
				break;
				case "touchmove":
					funcs = this.touchMoveFuncs;
				break;
				case "wheel":
					funcs = this.wheelFuncs;
				break;
				default:
					return false;
			}
		}else{
			switch(name){
				case "keydown":
					funcs = this.shiftKeyDownFuncs; 
				break;
				case "keyup":
					funcs = this.shiftKeyUpFuncs; 
				break;
				case "keypress":
					funcs = this.shiftKeyPressFuncs; 
				break;
				default:
					return false;
			}
		}

		// Create fake getPosition function in event class
		event.getPosition = function(){
			return new Position(this.layerX, this.layerY);
		}

		var keys = Object.keys(funcs);
		for(var i=0;i<keys.length;i++){
			var obj  = funcs[keys[i]];
			var func = obj.func;

			if(obj.once && auto) continue;

			if(name == "keypress" || name == "keydown" || name == "keyup"){
				if(obj.key==event.keyCode||obj.key==keyCodeMap[event.keyCode])
					func(event);
			}else if(name == "wheel"){
				if((obj.dir == "top" && event.wheelDeltaY > 0) || (obj.dir == "bottom" && event.wheelDeltaY < 0))
					func(event);
			}else if(name == "mousemove" || name.indexOf("touch") > -1){
				func(event);
			}else{
				if(obj.key == event.which || obj.key == clickMap[event.which])
					func(event);
			}
		}
	},

	keyDown: function(key, func, once){
		this.keyDownFuncs[Object.keys(this.keyDownFuncs).length] = {key: key, func: func, once: once};
	},

	keyUp: function(key, func, once){
		this.keyUpFuncs[Object.keys(this.keyUpFuncs).length] = {key: key, func: func, once: once};
	},

	keyPress: function(key, func){
		this.keyPressFuncs[Object.keys(this.keyPressFuncs).length] = {key: key, func: func};
	},

	shiftKeyDown: function(key, func){
		this.shiftKeyDownFuncs[Object.keys(this.shiftKeyDownFuncs).length] = {key: key, func: func};
	},

	shiftKeyUp: function(key, func){
		this.shiftKeyUpFuncs[Object.keys(this.shiftKeyUpFuncs).length] = {key: key, func: func};
	},

	shiftKeyPress: function(key, func){
		this.shiftKeyPressFuncs[Object.keys(this.shiftKeyPressFuncs).length] = {key: key, func: func};
	},

	click: function(key, func){
		this.clickFuncs[Object.keys(this.clickFuncs).length] = {key: key, func: func};
	},

	mouseUp: function(key, func, once){
		this.mouseUpFuncs[Object.keys(this.mouseUpFuncs).length] = {key: key, func: func, once: once};
	},

	mouseDown: function(key, func, once){
		this.mouseDownFuncs[Object.keys(this.mouseDownFuncs).length] = {key: key, func: func, once: once};
	},

	mouseMove: function(func){
		this.mouseMoveFuncs[Object.keys(this.mouseMoveFuncs).length] = {func: func};
	},


	touchStart: function(func){
		this.touchStartFuncs[Object.keys(this.touchStartFuncs).length] = {func: func};
	},

	touchEnd: function(func){
		this.touchEndFuncs[Object.keys(this.touchEndFuncs).length] = {func: func};
	},

	touchCancel: function(func){
		this.touchCancelFuncs[Object.keys(this.touchCancelFuncs).length] = {func: func};
	},

	touchMove: function(func){
		this.touchMoveFuncs[Object.keys(this.touchMoveFuncs).length] = {func: func};
	},


	wheel: function(dir, func){
		this.wheelFuncs[Object.keys(this.wheelFuncs).length] = {dir: dir, func: func};
	},


	keyIsDown: function(key){
		if(this.keyDownsActives.length == 0) return false;

		for(var i = 0; i < Object.keys(this.keyDownsActives).length; i++){
			var kDa = Object.keys(this.keyDownsActives)[i];
			if(keyCodeMap[kDa] == key) return true;
		}

		return false;
	},
	mouseIsDown: function(key){
		if(this.mouseDownsActives.length == 0) return false;

		for(var i = 0; i < Object.keys(this.mouseDownsActives).length; i++){
			var kDa = Object.keys(this.mouseDownsActives)[i];
			if(clickMap[kDa] == key) return true;
		}

		return false;
	},


	reset: function(){
		this.keyDownFuncs = {};
		this.keyUpFuncs = {};
		this.keyPressFuncs = {};
		this.shiftKeyDownFuncs = {};
		this.shiftKeyUpFuncs = {};
		this.shiftKeyPressFuncs = {};

		this.clickFuncs = {};
		this.mouseUpFuncs = {};
		this.mouseDownFuncs = {};
		this.mouseMoveFuncs = {};

		this.touchStartFuncs = {};
		this.touchEndFuncs = {};
		this.touchCancelFuncs = {};
		this.touchMoveFuncs = {};

		this.wheelFuncs = {};

		this.keyDownsActives   = {};
		this.mouseDownsActives = {};
	}

};

var Input = new Input();

var keyCodeMap = {
    8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"ctrl", 18:"alt", 19:"pausebreak", 20:"capslock", 27:"escape", 32:"space", 33:"pageup",
    34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 43:"+", 44:"printscreen", 45:"insert", 46:"delete",
    48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
    61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
    77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
    96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9",
    106: "*", 107:"+", 109:"-", 110:".", 111: "/",
    112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
    144:"numlock", 145:"scrolllock", 186:";", 187:"=", 188:",", 189:"-", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"'"
};

var clickMap = {
	1: "left", 2: "middle", 3: "right"
};