class Debug{
	
	private game  : Game;

	private _stats     : Stats;
	private _activated : boolean = false;


	public constructor(game: Game) {
		this.game = game;

		this._stats = new Stats(this.game);
	}

	public get stats(): Stats {
		return this._stats;
	}


	public set activated(activated: boolean) {
		this._activated = activated;
	}
	public get activated(): boolean {
		return this._activated;
	}


	public boot(): void {
		this._stats.boot();
	}


}