var Ressources = function(){
	this.data;
	this.ressources      = {};
	this.eventDispatched = false;

	this.ressourcesLoaded = 0;
	this.ressourcesNum    = 0;
}

Ressources.prototype = {

	loadRessources:  function() {
		var that = this;
		this.ressourcesLoaded = 0;

		var nameSuffix = (Config.assetsDir.indexOf("?") == -1) ? '?v=' + Date.now() : '&v=' + Date.now();

		loadJSON(Config.assetsDir + '/ressources.json' + nameSuffix, function(data){
			that.data = data;
			var keys = Object.keys(data);
			that.ressourcesNum = keys.length;

			if(keys.length==0){
				if(!that.eventDispatched){
					that.eventDispatched = true;

					Game.events.dispatch("loadedRessources", {ressources: null, num: 0});
				}
				Game.events.dispatch("asyncLoadedRessources", {ressources: null, num: 0});

				return false;
			}

			for(var i=0;i<keys.length;i++)
				that.loadRessource(keys[i]);

		}, function(error){log(error, "error");});
	},

	refreshRessourcesFromData: function() {
		var keys = Object.keys(this.data);
		this.ressourcesNum = keys.length;

		for(var i=0;i<keys.length;i++)
			this.loadRessource(keys[i]);
	},

	loadRessource: function(name) {
		var that = this;
		var obj = this.data[name];

		if(obj.type=="img"){
			var img = new Image();
			img.src = Config.assetsDir+'/'+obj.src;
			img.onload = function(){
				obj.data = this;
				that.ressources[name] = obj;
				that.ressourcesLoaded++;

				if(that.ressourcesLoaded>=that.ressourcesNum){
					if(!that.eventDispatched){
						that.eventDispatched = true;
						Game.events.dispatch("loadedRessources", {ressources: that.ressources, num: that.ressourcesNum});
					}
					Game.events.dispatch("asyncLoadedRessources", {ressources: that.ressources, num: that.ressourcesNum});
				}
			}

			img.onerror = function(){
				Game.events.dispatch("errorLoadingRessource", {ressource: this.src});
			}
		}
	},

	getRessource: function(name) {
		if(this.ressources[name]!=null)
			return this.ressources[name].data;
		else
			return null;
	}

};