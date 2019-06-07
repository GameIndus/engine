import Game from "../core/Game";
import Signal from "../core/Signal";
import {Key} from "./Key";

export default class Keyboard {

    private readonly _onKeyDown: Signal;

    private readonly _onKeyUp: Signal;

    private readonly _onKeyPressed: Signal;

    private readonly _keysDown: Key[];

    private readonly game: Game;

    public constructor(game: Game) {
        this.game = game;
        this._onKeyDown = new Signal(true);
        this._onKeyUp = new Signal(true);
        this._onKeyPressed = new Signal(true);
        this._keysDown = [];
        this.bind();
    }

    public get onKeyDown(): Signal {
        return this._onKeyDown;
    }

    public get onKeyUp(): Signal {
        return this._onKeyUp;
    }

    public get onKeyPressed(): Signal {
        return this._onKeyPressed;
    }

    public get keysDown(): Key[] {
        return this._keysDown;
    }

    public update(): void {
        for (const key of this.keysDown) {
            this._onKeyPressed.dispatch(key);
        }
    }

    public keyIsDown(key: Key): boolean {
        return this._keysDown.indexOf(key) > -1;
    }

    public getKeysDown(): Key[] {
        return this._keysDown;
    }

    public getKeysNamesDown(): string[] {
        const r: string[] = [];

        this.getKeysDown().forEach((key) => {
            r.push(Key.toString(key));
        });

        return r;
    }

    private bind(): void {
        const canvas: HTMLCanvasElement = this.game.canvas.element;

        // Reset
        canvas.removeEventListener("keydown", this.handleKeyDown.bind(this));
        canvas.removeEventListener("keyup", this.handleKeyUp.bind(this));

        // Bind events
        canvas.addEventListener("keydown", this.handleKeyDown.bind(this), false);
        canvas.addEventListener("keyup", this.handleKeyUp.bind(this), false);
    }

    private handleKeyDown(event: KeyboardEvent): boolean {
        const key = Key.fromCode(event.keyCode);

        if (key == null) {
            return true;
        }
        event.preventDefault();

        if (!this.keyIsDown(key)) {
            this._keysDown.push(key);
        }

        this._onKeyDown.dispatch(key);
        return false;
    }

    private handleKeyUp(event: KeyboardEvent): boolean {
        const key: Key = Key.fromCode(event.keyCode);

        if (key == null) {
            return true;
        }
        event.preventDefault();

        if (this.keyIsDown(key)) {
            this._keysDown.splice(this._keysDown.indexOf(key), 1);
        }

        this._onKeyUp.dispatch(key);

        return false;
    }

}
