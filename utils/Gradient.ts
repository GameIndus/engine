class Gradient {

    private _canvas: Canvas;
    private _centerRadius: number;

    public constructor(type?: GradientType, size?: RectangleSize, ...colors: Color[]) {
        this._type = type || GradientType.LINEAR;
        this._size = size || {width: 50, height: 50};
        this._colors = colors || [];
    }

    private _gradient: CanvasGradient;

    public get gradient(): CanvasGradient {
        return this._gradient;
    }

    private _type: GradientType;

    public get type(): GradientType {
        return this._type;
    }

    private _size: RectangleSize;

    public get size(): RectangleSize {
        return this._size;
    }

    public set size(size: RectangleSize) {
        this._size = size;
        this.generate();
    }

    private _colors: Color[];

    public get colors(): Color[] {
        return this._colors;
    }

    public set colors(colors: Color[]) {
        this._colors = colors;
        this.generate();
    }

    public get width(): number {
        return this.size.width;
    }

    public get height(): number {
        return this.size.height;
    }

    public static createRadialGradient(size?: RectangleSize, centerRadius?: number, ...colors: Color[]) {
        let g = new Gradient(GradientType.RADIAL, size);
        g.colors = colors;
        g._centerRadius = centerRadius || 5;
        return g;
    }

    public setup(canvas: Canvas): void {
        this._canvas = canvas;

        this.generate();
    }

    public generate(): void {
        if (this._canvas == null) return;

        if (this.type == GradientType.LINEAR) {

            this._gradient = this._canvas.context.createLinearGradient(
                0, 0, this.size.width, this.size.height
            );

        } else {

            let size = Math.min(this.size.width, this.size.height);
            let halfSize = size / 2;

            this._gradient = this._canvas.context.createRadialGradient(
                halfSize, halfSize,
                this._centerRadius,
                halfSize, halfSize,
                halfSize
            );

        }


        let nbColors = this.colors.length;
        let stopStep = 1 / (nbColors - 1);

        for (let step = 0, i = 0; step <= 1; step += stopStep, i++) {
            this._gradient.addColorStop(step, this.colors[i].toString("rgba"));
        }
    }

}

enum GradientType {
    LINEAR,
    RADIAL
}