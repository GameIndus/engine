class CanvasBuffer extends Canvas {

    private _clipping: Rectangle;

    public constructor(source: HTMLImageElement | Gradient) {
        super(null);

        this._source = source;
        this._canvas = CanvasPool.create(this, this._source.width, this._source.height);
    }

    private _source: any;

    public get source(): HTMLImageElement {
        if (this._source instanceof Gradient) return null;
        return this._source;
    }

    private _repeatSource: boolean;

    public set repeatSource(repeat: boolean) {
        this._repeatSource = repeat;
    }

    public get gradient(): Gradient {
        if (this._source instanceof HTMLImageElement) return null;
        return this._source;
    }

    public clip(clippingRectangle: Rectangle): void {
        this._clipping = clippingRectangle.clone();
        this.redraw();
    }

    public resize(width: number, height: number): void {
        if (this.canvas != null && this._context != null) {
            this.canvas.width = width;
            this.canvas.height = height;

            this.redraw();
        }
    }

    public setup(width: number, height: number): void {
        this._context = this.canvas.getContext("2d");

        // document.body.appendChild( this.canvas );
        this.resize(width, height);
    }

    public clear(): void {
        if (!this.context) return;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public redraw(): void {
        this.clear();

        if (this.source != null) {

            if (!this._clipping) {
                this.context.drawImage(
                    this.source,
                    0, 0,
                    this.canvas.width, this.canvas.height
                );
            } else {
                this.context.drawImage(
                    this.source,
                    this._clipping.x, this._clipping.y,
                    this._clipping.width, this._clipping.height,
                    0, 0,
                    this.canvas.width, this.canvas.height
                );
            }

        } else if (this.gradient != null) {

            this.gradient.setup(this);

            this.context.fillStyle = this.gradient.gradient;
            this.context.fillRect(
                0, 0,
                this.gradient.size.width, this.gradient.size.height
            );

        }
    }

}