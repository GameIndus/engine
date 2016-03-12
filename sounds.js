function SoundsManager(){
	this.sounds = [];

	this.soundsLoaded = 0;
	this.soundsNum    = 0;
}

SoundsManager.prototype = {

	loadSounds: function(){
		var that = this;

		loadJSON(Config.assetsDir + "/sounds.json", function(data){
			var keys = Object.keys(data);

			that.soundsNum = keys.length;
			that.loadSound(data);
		});
	},

	loadSound: function(soundsObj){
		var that = this;

		if(this.soundsLoaded>=this.soundsNum){
			if(Game!=null&&Game.events!=null)
				Game.events.dispatch("loadedSounds", {sounds: this.sounds, num: this.soundsNum});	
			return false;
		}

		var name = Object.keys(soundsObj)[this.soundsLoaded];
		var v = soundsObj[name];
		var sound = new Sound(Config.assetsDir + "/" + v);

		sound.audio.onloadeddata = function(){
			that.soundsLoaded++;
			sound.setName(name);
			that.registerSound(sound);

			that.loadSound(soundsObj);
		}
	},

	getSound: function(name){
		for(var i=0;i<this.sounds.length;i++){
			var sound = this.sounds[i];
			if(sound.getName() == name)
				return sound;
		}
	},

	registerSound: function(sound){
		this.sounds.push(sound);
	}

};

var SoundsManager = new SoundsManager();