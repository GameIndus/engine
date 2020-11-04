import Game from "../core/Game";
import Util from "./Util";

export default class GameLoop {

    private game: Game;

    private forceTimeout: boolean;

    private onLoop?: FrameRequestCallback;

    private loopId?: number;

    private _running: boolean;

    private _setTimeout: boolean;

    public constructor(game: Game, forceTimeout ?: boolean) {
        this.game = game;
        this.forceTimeout = forceTimeout || false;
        this._running = false;
        this._setTimeout = false;

        this._initialize();
    }

    public get running(): boolean {
        return this._running;
    }

    public get setTimeout(): boolean {
        return this._setTimeout;
    }

    public start(): void {
        const self: GameLoop = this;

        this._running = true;

        if (window.requestAnimationFrame && !this.forceTimeout) {
            this._setTimeout = false;
            this.onLoop = (time) => {
                return self.updateFromRAF(time);
            };
            this.loopId = window.requestAnimationFrame(this.onLoop);
        } else {
            this._setTimeout = true;
            this.onLoop = () => {
                return self.updateFromTimeout();
            };
            this.loopId = window.setTimeout(this.onLoop, 0);
        }
    }

    public stop(): void {
        if (this.setTimeout) {
            clearTimeout(this.loopId);
        } else {
            if (this.loopId) {
                window.cancelAnimationFrame(this.loopId);
            }
        }
        this._running = false;
    }

    private _initialize(): void {
        Util.getVendors().forEach((vendor) => {
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = (window as any)[vendor + "RequestAnimationFrame"];
                window.cancelAnimationFrame = (window as any)[vendor + "CancelAnimationFrame"];
            }
        });
    }

    private updateFromTimeout(): void {
        if (this.running && this.onLoop) {
            this.game.update(Date.now());
            this.loopId = window.setTimeout(this.onLoop, this.game.time.callTime);

            // this.game.currentScene.camera.begin();
            // this.game.currentScene.camera._update();

            // if (this.game.currentScene.camera.)
        }
    }

    private updateFromRAF(time: number): void {
        if (this.running && this.onLoop) {
            this.game.update(Math.floor(time));
            this.loopId = window.requestAnimationFrame(this.onLoop);
        }
    }

}
