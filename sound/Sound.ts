class Sound {
	
	private _game : Game;

	private _autoplay : boolean = false;
	private _loop     : boolean = false;
	private _key      : string;
	private _name     : string;

	private _startTime   : number = 0;
	private _currentTime : number = 0;
	private _duration    : number = 0;

	private _paused   : boolean = false;
	private _override : boolean = false; // Will always start playing from the beginning

}