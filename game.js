/**
 * Game
 * @class
 */
var Game = function(){
	this.loader = new Loader();
	this.ressources = new Ressources();
	this.events = new eventListener();

	this.spectrometer = new Spectrometer();
	this.errorView = new ErrorView(this);

	this.collisionsManager = new CollisionsManager();
	this.networkManager = new NetworkManager();
	
	this.canvas = new Canvas();

	this.currentScene = null;
	this.scenes = {};

	this.paused       = false;
	this.initialized  = false;
	this.network      = false;
	this.standalone   = false;

	this.delta  = 0;
	this.fps    = 0;
	this.maxFps = -1;
}


Game.prototype = {

	load: function(id){
		if(this.initialized) return false; 
		
		if(!this.standalone){
			this.ressources.loadRessources();
			SoundsManager.loadSounds();
		}

		if(id!==undefined)
			this.canvas.load(id);
		else
			this.canvas.load("canvas");

		this.canvas.setSize(Config.get("defaultSize").w, Config.get("defaultSize").h);

		loop();
		update();

		log("Game engine ready.");
	},

	init: function(){
		if(this.initialized) return false; 

		this.loader.init();
		if(this.network) this.networkManager.load();

		if(Config.debugMode){
			// Load spectrometer
			this.spectrometer.setEnabled(true);
			this.spectrometer.init();

			log("Game engine initialized.");
		}

		this.initialized = true;
	},

	setCanvasSize: function(width, height){
		this.canvas.setSize(width, height);
	},

	setMaxFPS: function(maxFps){
		this.maxFps = maxFps;
	},

	setStandalone: function(standalone){
		this.standalone = standalone;
	},

	getCanvas: function(){
		return this.canvas;
	},

	getSize: function(){
		return this.canvas.getSize();
	},

	getEventsManager: function(){
		return this.events;
	},

	getContext: function(){
		return this.canvas.getContext();
	},

	getRessourcesManager: function(){
		return this.ressources;
	},
	getRessources: function(){
		return this.ressources;
	},

	/**
	 * Allow you to add a scene into the game
	 * @param {String} name  The scene name
	 * @param {Scene} scene The scene object
	 */
	addScene: function(name, scene){
		this.scenes[name] = scene;
	},

	/**
	 * Define the current scene
	 * @param {String} name The scene name
	 */
	setCurrentScene: function(name){
		if(typeof name === "string"){
			if(this.getScene(name) == null && Config.debugMode) log("Scene '" + name + "' is undefined.", "error");
			this.currentScene = this.getScene(name);
		}
		else
			this.currentScene = name;
	},

	/**
	 * Get a scene with its name
	 * @param  {String} name The scene name
	 * @return {Scene}      The scene returned (or null)
	 */
	getScene: function(name){
		return this.scenes[name];
	},

	getCurrentScene: function(){
		return this.currentScene;
	},

	getNetworkManager: function(){
		return this.networkManager;
	},

	getServer: function(){
		return this.getNetworkManager().getNetwork();
	}

};

var last = 0, logicFps = 60, frames = 0, averageFps = 0, updated = false;
var timers   = [], workerError = false, workerTimeoutCrash = null, w = undefined;

function loop(){
	if(!Game.paused && updated){
		var now = Date.now();
		var dt  = Math.min(1, (now - last) / 1000);

		// Get FPS
		frames++;
		if(frames >= 45){
			Game.fps = Math.round(1/dt);
			if(averageFps == 0) averageFps = Game.fps
			else averageFps = Math.round((averageFps + Game.fps) / 2)
			frames = 0;
		}

		Game.delta = dt;
		Game.canvas.clear();

		if(Game.loader.isLoaded){
			if(!Game.errorView.enabled){
				Game.events.dispatch("beforeGameRendering", {delta: dt, fps: Game.fps, averageFps: averageFps});

				if(Game.getCurrentScene() != null) Game.getCurrentScene().render(dt);

				Game.events.dispatch("gameRendered", {delta: dt, fps: Game.fps, averageFps: averageFps});
			}else{
				Game.errorView.render();
			}
			
		}else{
			Game.loader.render();
		}

		if(Game.debugMode && window.debugRpgCollisions != null){
			var lt = window.debugRpgCollisions;

			var ctx = Game.getContext();
			ctx.fillStyle = "rgba(102,51,153,0.5)";

			for(var i = 0; i < lt.x.length; i++){
				for(var j = 0; j < lt.y.length; j++){
					var couple = [lt.x[i], lt.y[j]];
					
					ctx.fillRect(couple[0] * lt.cell[0], couple[1] * lt.cell[1], lt.cell[0], lt.cell[1]);
				}
			}
		}

		if(Game.loader.isLoaded)
			Game.spectrometer.render();

		last    = now;
		updated = false;
	}

	if(Game.maxFps == -1)
		requestAnimationFrame(loop, Game.getCanvas().getCanvas());
	else
		setTimeout(loop, 1000/Game.maxFps);
}
function update(){
	if (typeof(Worker) !== "undefined" && !workerError) {
		if(w == undefined){
			w = new Worker("/Lab/GameIndus/engine/2D/classes/others/Worker.js");
			w.postMessage({event: "start", framespersecond: logicFps});
		}

		w.onerror = function(){
			workerError = true;
			update();
		}
		w.onmessage = function(event){
			doUpdate();

			if(workerTimeoutCrash != null) clearTimeout(workerTimeoutCrash);
			workerTimeoutCrash = setTimeout(function(){
				w.terminate();w = undefined;
				update();
			}, 100);
		}
		return false;
	}

	doUpdate();

	setTimeout(update, 1000/logicFps);
}
function doUpdate(){
	if(Game.loader.isLoaded){
		if(Game.getCanvas() != null) Game.getCanvas().rescale();
		if(Game.getCurrentScene() != null) Game.getCurrentScene().update();
		
		Game.spectrometer.update();
		Game.events.dispatch("gameUpdated");
	}else{
		Game.loader.update();
	}

	updated = true;
}