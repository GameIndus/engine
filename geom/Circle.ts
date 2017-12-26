class Circle implements Shape {

    public constructor(x?: number, y?: number, diameter?: number) {
        this._x = x || 0;
        this._y = y || 0;
        this._diameter = diameter || 0;
    }

    private _x: number;

    public get x(): number {
        return this._x;
    }

    private _y: number;

    public get y(): number {
        return this._y;
    }

    private _diameter: number;

    public get diameter(): number {
        return this._diameter;
    }

    public get points(): Point[] {
        return [];
    }

    public get radius(): number {
        return this.diameter / 2;
    }

    public area(): number {
        return Math.PI * ((this._diameter / 2) ^ 2);
    }

    public toString(): string {
        return "{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + ")}";
    }

}