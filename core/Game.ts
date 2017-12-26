class Game {

	public static readonly VERSION : string = "0.30";
	
	
	private _width      : number  = 800;
	private _height	    : number  = 600;
	private _resolution : number  = 1;
	
	private _antialias   : boolean = true;
	
	private _isBooted   : boolean = false;
	private _isRunning  : boolean = false;
	private _paused     : boolean = false;

	private config        : GameConfig = {};
	private _scenes       : Scene[]    = [];
	private _currentScene : Scene;

	// Loop variables
	private _deltaTime       : number  = 0;
	private _quickstart      : boolean = true;
	private _lastLogicFrames : number  = 0;
	private _diffLogicFrames : number  = 0;
	

	private _cache     : Cache;
	private _canvas    : Canvas;
	private _debug     : Debug;
	private _device    : Device;
	private _graphics  : Graphics;
	private _input     : Input;
	private _loader    : Loader;
	private _loop      : GameLoop;
	private _plugins   : PluginManager;
	private _sound     : SoundManager;
	private _storage   : Storage;
	private _time      : Time;
	private _tweens    : TweenManager;

	private _onPreload : Signal = new Signal(true);
	private _onPause   : Signal = new Signal(true);
	private _onResume  : Signal = new Signal(true);


	public constructor(config?: GameConfig){
		this._device = new Device();


		if (config != undefined) {
			this.config = config;
			this._parseConfig(config);
		}

		this.device.whenReady(this.boot, this);
	}


	public get cache(): Cache{
		return this._cache;
	}
	public get canvas(): Canvas{
		return this._canvas;
	}
	public get currentScene(): Scene{
		return this._currentScene || Scene.EMPTY;
	}
	public get debug(): Debug{
		return this._debug;
	}
	public get device(): Device{
		return this._device;
	}
	public get graphics(): Graphics{
		return this._graphics;
	}
	public get input(): Input{
		return this._input;
	}
	public get loader(): Loader{
		return this._loader;
	}
	public get loop(): GameLoop{
		return this._loop;
	}
	public get plugins(): PluginManager{
		return this._plugins;
	}
	public get time(): Time{
		return this._time;
	}
	public get tweens(): TweenManager{
		return this._tweens;
	}

	
	public get debugModeActivated(): boolean{
		return this.debug != null;
	}
	public get isBooted(): boolean{
		return this._isBooted;
	}
	public get isLoaded(): boolean{
		return this.loader.gameLoaded;
	} 
	public get paused(): boolean{
		return this._paused;
	}
	public get scenes(): Scene[]{
		return this._scenes;
	}

	public get width(): number{
		return this._width;
	}
	public get height(): number{
		return this._height;
	}

	public get onPause(): Signal{
		return this._onPause;
	}
	public get onResume(): Signal{
		return this._onResume;
	}
	public get preload(): Signal{
		return this._onPreload;
	}

	public set currentScene(scene: Scene){
		this._currentScene = scene;
	}



	private _parseConfig(config?:GameConfig): void{
		if(config && typeof config["width"] !== 'undefined') {
			this._width = config.width;
		}

		if(config && typeof config["height"] !== 'undefined') {
			this._height = config.height;
		}

		if(config && config["debug"] === true) {
			this._debug = new Debug(this);
		}
	}
	private _showConsoleHeader(): void {
        if (this.device.browser == DeviceBrowser.CHROME) {
            
            var message1 = [
                '%c %c %c GameIndus v' + Game.VERSION + ' | Moteur Canvas %c %c %c https://gameindus.fr/',
                'background: #cbd0d3',
                'background: #3498db',
                'color: #ffffff; background: #2980b9;',
                'background: #3498db',
                'background: #cbd0d3',
                'background: #ffffff'
            ];
            console.log.apply(console, message1);

            if( this.debugModeActivated ) {
            	var message2 = [
	                '%c %c %c Mode développeur activé, pensez à le désactiver avant publication. %c %c %c',
	                'background: #cbd0d3',
	                'background: #f39c12',
	                'color: #ffffff; background: #e67e22;',
	                'background: #f39c12',
	                'background: #cbd0d3',
	                'background: #ffffff'
	            ];
            	
            	console.log.apply(console, message2);
            }

        } else if (window['console']) {

            console.log("GameIndus v" + Game.VERSION + " | Moteur Canvas | https://gameindus.fr");
       
        }
	}

	private boot(): void{
		let self = this;
		if(this.isBooted) return;

		this._isBooted = true;

		this._canvas = new Canvas(this);

		this._canvas.setup(this.width, this.height, this.config["canvasId"], this.config["parent"], this.config["autoFocus"]);

		this._cache    = new Cache(this);
		this._graphics = new Graphics(this);
		this._input    = new Input(this);
		this._loader   = new Loader(this, this.config["loader"]);
		this._plugins  = new PluginManager(this);
		this._sound    = new SoundManager(this);
		this._storage  = new Storage(this);
		this._time     = new Time(this);
		this._tweens   = new TweenManager(this);


		// Preload
		this._onPreload.dispatch(this);


		if (this._debug != null)
			this._debug.boot();


		this._time.boot();
		this._input.boot();

		if (this.config["forceSetTimeout"] != undefined )
			this._loop = new GameLoop(this, this.config["forceSetTimeout"]);
		else
			this._loop = new GameLoop(this, false);

		this._loader.start();
		this.loop.start();

		if(window["focus"]) window.focus();

		this._showConsoleHeader();
	}



	public createScene(name: string): Scene{
		// Check if this scene already exists
		let currentScene: Scene = this.getScene(name);
		if(currentScene != null) return currentScene;

		// Create a new scene and add it to the engine
		let scene: Scene = new Scene(this, name);

		this._scenes.push(scene);

		// Set this scene by default if needed
		if( this._currentScene == null )
			this._currentScene = scene;

		return scene;
	}
	public getScene(name: string): Scene{
		let scene: Scene;

		for (let _scene of this._scenes) {
			if(_scene.name == name){
				scene = _scene;
				break;
			}
		}

		return scene;
	}
	public getCurrentScene(): Scene{
		return this.currentScene;
	}
	public setCurrentScene(scene: Scene|string): void{
		if(typeof scene === "string") {

			this.currentScene = this.getScene(scene);

		} else if(scene instanceof Scene) {

			this.currentScene = scene;

		}
	}

	public tween(object: any): Tween{
		return this.tweens.add(new Tween(object));
	}


	public pause(): void{
		if(!this.paused){
			this._paused = true;

			this.time.gamePaused();

			this.onPause.dispatch();
		}
	}
	public resume(): void{
		if(this.paused){
			this._paused = false;

			this.time.gameResumed();

			this.onResume.dispatch();
		}
	}

	public update(time: number): void{
		let step        : number = 0;
		let updates     : number = 0;
		let logicFrames : number = 0;

		this._time.update(time);

		// Start stats if debug mode activated
		if( this.debugModeActivated && this.isLoaded ) 
			this.debug.stats.begin();


		if(this._quickstart) {

			// First update logic & render
			this.updateLogic();
			this.updateRender(this.time.fps);

			this._quickstart = false;

			return;

		}

		// Too many logic frames, only render game
		if( this._diffLogicFrames >= 2 ) {

			this._diffLogicFrames = 0;
			this._deltaTime       = 0;

			this.updateRender(this.time.fps);

		} else {

			step = 1000.0 / this.time.fps;

			this._deltaTime += Math.max(Math.min(step * 3, this.time.elapsed), 0);
			
			while ( this._deltaTime >= step ) {
				this._deltaTime -= step;

				logicFrames++;

				this.updateLogic();
				this.time.refresh();
			}

			// Too many logic frames 
			if(logicFrames > this._lastLogicFrames) {
				this._diffLogicFrames++;
			} else if(logicFrames < this._lastLogicFrames) {
				this._diffLogicFrames = 0;
			}

			this._lastLogicFrames = logicFrames;

			this.updateRender(this._deltaTime / step);

		}

		if( this.debugModeActivated && this.isLoaded ) 
			this.debug.stats.end();
	}
	private updateLogic(): void{
		if(this.paused) return;

		if( this.isLoaded && !this.loader.splash.inRendering ) {

			this.currentScene.update();

			this.tweens.update();
			this.input.update();

		} else {

			this.loader.splash.update();

		}
	}
	private updateRender(elapsedTime: number): void{
		this.canvas.clear();

		if( this.isLoaded && !this.loader.splash.inRendering ) {

			this.currentScene.render(elapsedTime);
			
		}
	}
	
}