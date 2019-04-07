import Game from "../core/Game";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";

export default class Input {

    private readonly _game: Game;

    private _keyboard: Keyboard;

    private _mouse: Mouse;

    public constructor(game: Game) {
        this._game = game;
        this._keyboard = Keyboard.prototype;
        this._mouse = Mouse.prototype;
    }

    public get keyboard(): Keyboard {
        return this._keyboard;
    }

    public get mouse(): Mouse {
        return this._mouse;
    }

    public boot(): void {
        this._keyboard = new Keyboard(this._game);
        this._mouse = new Mouse(this._game);
    }

    public update(): void {
        this.keyboard.update();
    }

}
