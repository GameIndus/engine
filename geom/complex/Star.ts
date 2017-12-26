class Star implements ComplexShape {

    private static readonly MAX_SPIKES = 5000;
    private _radiusFraction: number = 0.5;
    private _lastPosition: Position;
    private _lastSize: RectangleSize = {width: 0, height: 0};

    public constructor(spikes?: number, radiusFraction?: number) {
        if (spikes) this._spikes = spikes;
        if (radiusFraction) this._radiusFraction = radiusFraction;

        // On modifie le nombre de sommets pour éviter les crashs.
        // (et pour que la forme s'affiche correctement)
        if (spikes < 2) spikes = 2;
        if (spikes > Star.MAX_SPIKES) spikes = Star.MAX_SPIKES;
    }

    private _points: Point[] = [];

    public get points(): Point[] {
        return this._points;
    }

    private _spikes: number = 5;

    private _lastSpikes: number = this._spikes;

    public get spikes(): number {
        return this._spikes;
    }

    public set spikes(spikes: number) {
        this._spikes = spikes;
    }


    public calculatePoints(position: Position, size: RectangleSize): Point[] {
        if (position.equals(this._lastPosition)
            && size.width == this._lastSize.width && size.height == this._lastSize.height
            && this.spikes == this._lastSpikes)
            return this._points;

        let points: Point[] = [];

        let rect: Rectangle = new Rectangle(position.x, position.y, size.width, size.height);
        let center: Point = rect.getPoint(RectanglePosition.CENTER);

        let len: number = Math.min(size.width, size.height);
        let rot: number = Math.PI / 2 * 3;
        let step: number = Math.PI / this.spikes;

        for (let i = 0; i < this.spikes; i++) {

            // Outer spike point
            points.push(new Point(position.x + Math.cos(rot) * len, position.y + Math.sin(rot) * len));
            rot += step;

            // Inner spike point
            points.push(new Point(position.x + Math.cos(rot) * len * this._radiusFraction, position.y + Math.sin(rot) * len * this._radiusFraction));
            rot += step;

        }

        // Temp variables
        this._lastPosition = position.clone();
        this._lastSize.width = size.width;
        this._lastSize.height = size.height;
        this._lastSpikes = this.spikes;

        this._points = points;
        return points;
    }


}