class Input {
    private game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    private _keyboard: Keyboard;

    public get keyboard(): Keyboard {
        return this._keyboard;
    }

    private _mouse: Mouse;

    public get mouse(): Mouse {
        return this._mouse;
    }


    public boot(): void {
        this._keyboard = new Keyboard(this.game);
        this._mouse = new Mouse(this.game);
    }

    public update(): void {
        this.keyboard.update();
    }
}