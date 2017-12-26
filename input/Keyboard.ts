class Keyboard {
	private game      : Game;
	private _keysDown : Key[]  = [];

	public onKeyDown    : Signal = new Signal(true);
	public onKeyUp      : Signal = new Signal(true);
	public onKeyPressed : Signal = new Signal(true);


	public constructor(game: Game){
		this.game = game;

		this.bind();
	}

	public get keysDown(): Key[]{
		return this._keysDown;
	}


	private bind(): void{
		let canvas: HTMLCanvasElement = this.game.canvas.element;

		// Reset
		canvas.removeEventListener("keydown", this._onKeyDown.bind(this));
		canvas.removeEventListener("keyup", this._onKeyUp.bind(this));

		// Bind events
		canvas.addEventListener("keydown", this._onKeyDown.bind(this), false);
		canvas.addEventListener("keyup", this._onKeyUp.bind(this), false);
	}

	public update(): void{
		for(let key of this.keysDown){
			this.onKeyPressed.dispatch(key);
		}
	}



	private _onKeyDown(event: KeyboardEvent): boolean{
		let key: Key = Key.fromCode(event.keyCode);
		
		if(key == null) return true;
		event.preventDefault();

		if(!this.keyIsDown(key))
			this._keysDown.push(key);

		this.onKeyDown.dispatch(key);

		return false;
	}
	private _onKeyUp(event: KeyboardEvent): boolean{
		let key: Key = Key.fromCode(event.keyCode);
		
		if(key == null) return false;
		event.preventDefault();

		if(this.keyIsDown(key))
			Util.removeFrom(this._keysDown, key);

		this.onKeyUp.dispatch(key);

		return false;
	}

	public keyIsDown(key: Key): boolean{
		return this._keysDown.indexOf(key) > -1;
	}
	public getKeysDown(): Key[]{
		return this._keysDown;
	}
	public getKeysNamesDown(): string[]{
		let r: string[] = [];
		
		this.getKeysDown().forEach(function(key: Key){
			r.push(Key.toString(key));
		});

		return r;
	}

}