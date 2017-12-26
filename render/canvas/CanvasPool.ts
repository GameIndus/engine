class CanvasPool {

    private static readonly MAX_LENGTH: number = 500;

    private static _pool: CanvasBuffer[] = [];

    public static get size(): number {
        return this._pool.length;
    }

    public static create(canvasBuf: CanvasBuffer, width: number, height: number): HTMLCanvasElement {
        let canvas = document.createElement("canvas");

        if (this._pool.length + 1 > this.MAX_LENGTH)
            this._pool.splice(0, 1);

        this._pool.push(canvasBuf);

        canvas.width = width;
        canvas.height = height;

        return canvas;
    }

    public static remove(canvas: CanvasBuffer): void {
        let index = this._pool.indexOf(canvas);

        if (index > -1) this._pool.splice(index, 1);
    }

}