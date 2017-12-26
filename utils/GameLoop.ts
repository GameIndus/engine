class GameLoop{

	private game           : Game;
	private _isRunning     : boolean;
	private forceTimeout   : boolean;
	private _isSetTimeout  : boolean;

	private animationFrame : Function;
	private onLoop         : FrameRequestCallback;
	private loopId         : number;


	public constructor(game: Game, forceTimeout ?: boolean) {
		this.game         = game;
		this.forceTimeout = forceTimeout || false;

		this._initialize();
	}


	public get isRunning(): boolean{
		return this._isRunning;
	}
	public get isSetTimeout(): boolean{
		return this._isSetTimeout;
	}


	private _initialize(): void{
		Util.getVendors().forEach(function(vendor){
			
			if(!window.requestAnimationFrame){
				window.requestAnimationFrame = window[ vendor + 'RequestAnimationFrame' ];
				window.cancelAnimationFrame  = window[ vendor + 'CancelAnimationFrame'  ];
			}

		});
	}
	public start(): void{
		let self: GameLoop = this;

		this._isRunning = true;

		if(window.requestAnimationFrame && !this.forceTimeout){

			this._isSetTimeout = false;

			this.onLoop = function(time) {
				return self.updateFromRAF(time);
			};

			this.loopId = window.requestAnimationFrame(this.onLoop); 

		} else {

			this._isSetTimeout = true;

			this.onLoop = function() {
				return self.updateFromTimeout();
			}

			this.loopId = window.setTimeout(this.onLoop, 0);

		}
	}

	private updateFromTimeout(): void{
		if(this.isRunning) {
			this.game.update(Date.now());

			this.loopId = window.setTimeout(this.onLoop, this.game.time.callTime);
		}
	}
	private updateFromRAF(time: number): void{
		if(this.isRunning) {
			this.game.update(Math.floor(time));

			this.loopId = window.requestAnimationFrame(this.onLoop);
		}
	}

	public stop(): void{
		if(this.isSetTimeout) {
			clearTimeout(this.loopId);
		} else {
			window.cancelAnimationFrame(this.loopId);
		}

		this._isRunning = false;
	}

}