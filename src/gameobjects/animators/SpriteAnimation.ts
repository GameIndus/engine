import Signal from "../../core/Signal";
import {Sprite} from "../Sprite";

export default class SpriteAnimation {

    private _sprite: Sprite;

    private readonly _name: string;

    private readonly _frames: [number, number];

    private readonly _speed: number;

    private readonly _loop: boolean;

    private readonly _dir: string;

    private readonly _whenFinished: Signal;

    private _index: number = 0;

    private _lastFrame?: number;

    private _done: boolean;

    public constructor(sprite: Sprite, name: string, frames: [number, number],
                       speed?: number, loop?: boolean, dir?: string) {
        this._sprite = sprite;
        this._name = name;
        this._index = 0;
        this._frames = frames;
        this._speed = speed || 5;
        this._loop = loop || true;
        this._dir = dir || "horizontal";
        this._whenFinished = new Signal(true);
        this._done = false;
    }

    public get frames(): [number, number] {
        return this._frames;
    }

    public get speed(): number {
        return this._speed;
    }

    public get name(): string {
        return this._name;
    }

    public get done(): boolean {
        return this._done;
    }

    public get direction(): string {
        return this._dir;
    }

    public get looped(): boolean {
        return this._loop;
    }

    public get whenFinished(): Signal {
        return this._whenFinished;
    }

    public update(delta: number): void {
        let frame: number;

        if (this._done) {
            return;
        }

        this._index += (this._speed / 1000) * delta;

        if (this.speed > 0 && this.frames[1] >= this.frames[0] && this._sprite.isAnimated) {
            const max = (this.frames[1] - this.frames[0]) + 1;
            const idx = Math.floor(this._index);

            frame = idx % max;

            if (!this.looped && frame >= max - 1) {
                this._done = true;
                this._whenFinished.dispatch(this, frame);
            }
        } else {
            frame = 0;
        }

        // Change the viewport only if its needed
        if (frame !== this._lastFrame) {
            this._lastFrame = frame;

            const pos = this.XYFromFrame(frame);

            this._sprite.viewport.x = pos[0] * this._sprite.size.width;
            this._sprite.viewport.y = pos[1] * this._sprite.size.height;
        }
    }

    private XYFromFrame(frame: number): [number, number] {
        let x: number;
        let y: number;

        if (this.direction === "horizontal") {
            const perLig = Math.round(this._sprite.texture.width / this._sprite.size.width);

            x = frame % perLig;
            y = Math.floor(frame / perLig);
        } else {
            const perCol = Math.round(this._sprite.texture.height / this._sprite.size.height);

            x = Math.floor(frame / perCol);
            y = frame % perCol;
        }

        return [x, y];
    }

}
