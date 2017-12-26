class Debug {

    private game: Game;

    public constructor(game: Game) {
        this.game = game;

        this._stats = new Stats(this.game);
    }

    private _stats: Stats;

    public get stats(): Stats {
        return this._stats;
    }

    private _activated: boolean = false;

    public get activated(): boolean {
        return this._activated;
    }

    public set activated(activated: boolean) {
        this._activated = activated;
    }

    public boot(): void {
        this._stats.boot();
    }


}