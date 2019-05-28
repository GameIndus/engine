import Game from "../core/Game";

export default abstract class GamePlugin {

    private _id: number;

    private _name: string;

    private _registered: boolean;

    private _game: Game | null;

    protected constructor(name: string) {
        this._id = -1;
        this._name = name;
        this._registered = false;
        this._game = null;
    }

    public get id(): number {
        return this._id;
    }

    protected get game(): Game | null {
        return this._game;
    }

    public abstract onEnable(): void;

    public abstract onDisable(): void;

    public onPreRender(): void {
        // Not implemented
    }

    public onRender(): void {
        // Not implemented
    }

    public onPostRender(): void {
        // Not implemented
    }

    public onPreUpdate(): void {
        // Not implemented
    }

    public onUpdate(): void {
        // Not implemented
    }

    public onPostUpdate(): void {
        // Not implemented
    }

    public register(game: Game, id: number): boolean {
        if (this._registered) {
            return false;
        }

        this._registered = true;
        this._game = game;
        this._id = id;

        this.onEnable();
        return true;
    }

    public unregister(): boolean {
        if (!this._registered) {
            return false;
        }

        this._registered = false;
        this._game = null;
        this._id = -1;

        this.onDisable();
        return true;
    }

}
