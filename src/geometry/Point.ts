import MathUtil from "../util/Math";

export default class Point {

    private _x: number;

    private _y: number;

    constructor(x?: number, y?: number) {
        this._x = x || 0;
        this._y = y || 0;
    }

    public get x(): number {
        return this._x;
    }

    public set x(x: number) {
        this._x = x;
    }

    public get y(): number {
        return this._y;
    }

    public set y(y: number) {
        this._y = y;
    }

    public add(x: number, y: number): Point {
        this.x += x;
        this.y += y;
        return this;
    }

    public clamp(min: number, max: number): Point {
        this.x = MathUtil.clamp(this.x, min, max);
        this.y = MathUtil.clamp(this.y, min, max);
        return this;
    }

    public clampX(min: number, max: number): Point {
        this.x = MathUtil.clamp(this.x, min, max);
        return this;
    }

    public clampY(min: number, max: number): Point {
        this.y = MathUtil.clamp(this.y, min, max);
        return this;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public copyFrom(point: Point): Point {
        return this.setTo(point.x, point.y);
    }

    public copyTo(point: Point): Point {
        point.x = this.x;
        point.y = this.y;
        return this;
    }

    public cross(point: Point): number {
        return ((this.x * point.y) - (this.y * point.x));
    }

    public dot(point: Point): number {
        return ((this.x * point.x) + (this.y * point.y));
    }

    public divide(x: number, y: number): Point {
        this.x /= x;
        this.y /= y;
        return this;
    }

    public equals(point: Point): boolean {
        return point.x === this.x && point.y === this.y;
    }

    public getMagnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public invert(): Point {
        return this.setTo(this.y, this.x);
    }

    public isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    public multiply(x: number, y: number): Point {
        this.x *= x;
        this.y *= y;
        return this;
    }

    public negative(): Point {
        return this.setTo(-this.x, -this.y);
    }

    public normalize(): Point {
        if (!this.isZero()) {
            const m: number = this.getMagnitude();
            this.x /= m;
            this.y /= m;
        }

        return this;
    }

    public round(): Point {
        return this.setTo(Math.round(this.x), Math.round(this.y));
    }

    public setTo(x: number, y?: number): Point {
        this.x = x;
        this.y = y || ((y !== 0) ? this.x : 0);

        return this;
    }

    public subtract(x: number, y: number): Point {
        return this.add(-x, -y);
    }

    public toString(): string {
        return "{Point (x=" + this.x + " y=" + this.y + ")}";
    }

}
