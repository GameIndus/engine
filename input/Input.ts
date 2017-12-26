class Input{
	private game : Game;

	private _keyboard : Keyboard;
	private _mouse    : Mouse;


	public constructor(game: Game) {
		this.game = game;
	}


	public get keyboard(): Keyboard{
		return this._keyboard;
	}
	public get mouse(): Mouse{
		return this._mouse;
	}



	public boot(): void{
		this._keyboard = new Keyboard(this.game);
		this._mouse    = new Mouse(this.game);
	}

	public update(): void{
		this.keyboard.update();
	}
}