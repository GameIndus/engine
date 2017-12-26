class Circle implements Shape {

    private _x: number;

    private _y: number;

    private _diameter: number;

    public constructor(x?: number, y?: number, diameter?: number) {
        this._x = x || 0;
        this._y = y || 0;
        this._diameter = diameter || 0;
    }

    public area(): number {
        return Math.PI * ((this._diameter / 2) ^ 2);
    }

    public get diameter(): number {
        return this._diameter;
    }

    public get points(): Point[] {
        return [];
    }

    public get radius(): number {
        return this.diameter / 2;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public toString(): string {
        return "{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + ")}";
    }

}