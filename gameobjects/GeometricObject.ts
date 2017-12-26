class GeometricObject extends GameObject {

    private _color: Color = Color.BLACK;

    private _shape: ShapeType = ShapeType.RECTANGLE;

    private _shapeData: any;

    private _fill: boolean = true;

    protected _animator: GeometricAnimator;

    constructor(game: Game, name?: string, shape?: ShapeType, position?: Position, size?: number | any, color?: Color, fill?: boolean, shapeData?: ComplexShape | Point[]) {
        super(game, name);

        if (size) {
            if (typeof(size) == "number")
                this.size = {width: size, height: size};
            else if (size instanceof Object)
                this.setSize(size.width, size.height);
        }

        if (shape) this._shape = shape;
        if (position) this.setPosition(position.x, position.y);
        if (color) this._color = color;
        if (fill) this._fill = fill;

        if (shapeData) this._shapeData = shapeData;
    }

    public get color(): Color {
        return this._color || Color.BLACK;
    }

    public get filled(): boolean {
        return this._fill;
    }

    public get shapeType(): ShapeType {
        return this._shape;
    }

    public get shape(): ComplexShape {
        if (!(this._shapeData instanceof Object))
            return this._shapeData;
    }

    public get points(): Point[] {
        if (this._shapeData instanceof Object)
            return this._shapeData;
    }

    public get animator(): GeometricAnimator {
        if (this._animator) return this._animator;
        this._animator = new GeometricAnimator(this._game, this);
        return this._animator;
    }

    public set color(color: Color) {
        this._color = color;
    }

    public set filled(fill: boolean) {
        this._fill = fill;
    }

    public set shapeType(shape: ShapeType) {
        this._shape = shape;
    }

    public render(graphics: Graphics, time: number): void {
        switch (this.shapeType) {
            case ShapeType.RECTANGLE:
                graphics.drawShape(
                    new Rectangle(
                        this.renderPosition.x, this.renderPosition.y,
                        this.renderSize.width, this.renderSize.height
                    ),
                    this.filled,
                    this.color
                );
                break;

            case ShapeType.CIRCLE:
                let minSize = Math.min(this.renderSize.width, this.renderSize.height);
                graphics.drawShape(new Circle(this.renderPosition.x, this.renderPosition.y, minSize), this.filled, this.color);
                break;

            case ShapeType.TRIANGLE:
                graphics.drawShape(new Triangle(), this.filled, this.color);
                break;

            // Custom shape
            case ShapeType.POLYGON:
                graphics.drawShape(new Polygon(this._shapeData), this.filled, this.color);
                break;

            // Complex shapes
            case ShapeType.COMPLEX:
                this._shapeData.calculatePoints(this.renderPosition, this.renderSize);

                graphics.drawShape(this._shapeData, this.filled, this.color);
                break;
        }
    }

    public update(): void {
    }

}