function Config(){
	this.version   = 0.04;
	this.debugMode = false;

	this.assetsDir   = "assets";
	this.defaultSize = {w: 320, h: 320};

	this.sets = {
		assetsDir: "assets",

		windowMode: "centered",
		debugEnabled: false,
		defaultSize: {w: 320, h: 320},

		socketServerPath: "ws://localhost:8080/",
		version: 0.04,
		maxLayers: 10
	};

	this.readOnlyKeys = ["version", "defaultSize", "maxLayers"];
}

Config.prototype = {

	set: function(key, value){
		if(this.sets[key] == null) return false;
		if(this.readOnlyKeys.indexOf(key) > -1) return false;

		this.sets[key] = value;
	},

	get: function(key){
		return this.sets[key];
	}

};

var Config = new Config();