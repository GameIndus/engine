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

	this.delta  = 0;
	this.fps    = 0;
	this.maxFps = -1;
}


Game.prototype = {

	load: function(id){
		if(this.initialized) return false; 
		this.ressources.loadRessources();
		SoundsManager.loadSounds();

		if(id!==undefined)
			this.canvas.load(id);
		else
			this.canvas.load("canvas");
		this.canvas.setSize(Config.defaultSize.w, Config.defaultSize.h);

		loop();

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

var lastTime = 0;
var frames = 0;
var averageFps = 0;

function loop(){

	if(!Game.paused){
		var now = Date.now();
		var dt  = (now - lastTime) / 1000.0;

		// Get FPS
		frames++;
		if(frames>=45){
			Game.fps = Math.round(1/dt);
			if(averageFps==0) averageFps = Game.fps
			else averageFps = Math.round((averageFps+Game.fps)/2)
			frames = 0;
		}

		// Spectrometer
		if(Game.loader.isLoaded)
			Game.spectrometer.update();

		Game.delta = dt;
		Game.canvas.clear();

		if(Game.loader.isLoaded){
			if(!Game.errorView.enabled){
				if(Game.getCurrentScene()!=null){
					Game.getNetworkManager().updateNetwork();

					if(Game.getCurrentScene().camera!=null){
						Game.getCurrentScene().camera.begin();
						Game.getCurrentScene().camera.update();
					}
					
					Game.getCurrentScene().render(dt);

					if(Game.getCurrentScene().camera!=null)
						Game.getCurrentScene().camera.end();
				}

				Game.events.dispatch("gameRendered", {delta: dt, fps: Game.fps, averageFps: averageFps});
			}else{
				Game.errorView.render();
			}
			
		}else{
			Game.loader.update();
			Game.loader.render();
		}

		if(Game.loader.isLoaded)
			Game.spectrometer.render();

		if(window.lastTest){
			var lt = window.lastTest;

			var ctx = Game.getContext();
			ctx.fillStyle = "rgba(102,51,153,0.5)";

			for(var i = 0; i < lt.x.length; i++){
				for(var j = 0; j < lt.y.length; j++){
					var couple = [lt.x[i], lt.y[j]];
					
					ctx.fillRect(couple[0] * lt.cell[0], couple[1] * lt.cell[1], lt.cell[0], lt.cell[1]);
				}
			}
		}

		lastTime = now;
	}
	

	if(Game.maxFps==-1)
		requestAnimationFrame(loop);
	else
		setTimeout(loop, 1000/Game.maxFps);
}
