class SpriteAnimation {

    public whenFinished: Signal = new Signal(true);
    private _sprite: Sprite;
    private _dir: string = "horizontal";
    private _loop: boolean = true;
    private _index: number = 0;
    private _lastFrame: number;

    public constructor(sprite: Sprite, name: string, frames: [number, number], speed?: number, loop?: boolean, dir?: string) {
        this._sprite = sprite;

        this._name = name;
        this._frames = frames;

        if (speed) this._speed = speed;
        if (loop) this._loop = loop;
        if (dir) this._dir = dir;
    }

    private _frames: [number, number] = [0, 0];

    public get frames(): [number, number] {
        return this._frames;
    }

    private _speed: number = 5;

    public get speed(): number {
        return this._speed;
    }

    private _name: string;

    public get name(): string {
        return this._name;
    }

    private _done: boolean = false;

    public get done(): boolean {
        return this._done;
    }

    public get direction(): string {
        return this._dir;
    }

    public get looped(): boolean {
        return this._loop;
    }

    public update(delta: number): void {
        let frame: number;
        let x, y: number;

        if (this._done) return;

        this._index += (this._speed / 1000) * delta;

        if (this.speed > 0 && this.frames[1] >= this.frames[0] && this._sprite.isAnimated) {

            let max = (this.frames[1] - this.frames[0]) + 1;
            let idx = Math.floor(this._index);

            frame = idx % max;

            if (!this.looped && frame >= max - 1) {
                this._done = true;
                this.whenFinished.dispatch(this, frame);
            }

        } else {
            frame = 0;
        }

        // Change the viewport only if its needed
        if (frame == this._lastFrame) return;
        this._lastFrame = frame;

        let pos = this.XYFromFrame(frame);

        this._sprite.viewport.x = pos[0] * this._sprite.size.width;
        this._sprite.viewport.y = pos[1] * this._sprite.size.height;
    }


    private XYFromFrame(frame: number): [number, number] {
        let x, y: number;

        if (this.direction == "horizontal") {
            let perLig = Math.round(this._sprite.texture.width / this._sprite.size.width);

            x = frame % perLig;
            y = Math.floor(frame / perLig);
        } else {
            let perCol = Math.round(this._sprite.texture.height / this._sprite.size.height);

            x = Math.floor(frame / perCol);
            y = frame % perCol;
        }

        return [x, y];
    }

}