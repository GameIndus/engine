import MathUtil from "../utils/Math";

export default class Vector2 {

    public static get ZERO(): Vector2 {
        return new Vector2().zero();
    }

    public static fromArray(arr: [number, number]): Vector2 {
        return new Vector2(arr[0] || 0, arr[1] || 0);
    }

    public static fromAngle(angle: number): Vector2 {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    public static fromObject(obj: Vector2Object): Vector2 {
        return new Vector2(obj.x, obj.y);
    }

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

    public abs(): Vector2 {
        if (this.x < 0) {
            this.x = -this.x;
        }
        if (this.y < 0) {
            this.y = -this.y;
        }

        return this;
    }

    public add(vector: Vector2): Vector2 {
        this.addX(vector.x);
        this.addY(vector.y);
        return this;
    }

    public addX(x: number): Vector2 {
        this.x += x;
        return this;
    }

    public addY(y: number): Vector2 {
        this.y += y;
        return this;
    }

    public angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public copyX(vector: Vector2): Vector2 {
        this.x = vector.x;
        return this;
    }

    public copyY(vector: Vector2): Vector2 {
        this.y = vector.y;
        return this;
    }

    public copy(vector: Vector2): Vector2 {
        this.copyX(vector);
        this.copyY(vector);
        return this;
    }

    public distance(vector: Vector2): number {
        const dx: number = this.x - vector.x;
        const dy: number = this.y - vector.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    public divide(vector: Vector2): Vector2 {
        this.divideX(vector.x);
        this.divideY(vector.y);
        return this;
    }

    public divideX(x: number): Vector2 {
        this.x /= x;
        return this;
    }

    public divideY(y: number): Vector2 {
        this.y /= y;
        return this;
    }

    public invertX(): Vector2 {
        this.x *= -1;
        return this;
    }

    public invertY(): Vector2 {
        this.y *= -1;
        return this;
    }

    public invert(): Vector2 {
        this.invertX();
        this.invertY();
        return this;
    }

    public isCollinearWith(vector: Vector2): boolean {
        return this.x * vector.y === this.y * vector.x;
    }

    public isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    public isEqualTo(vector: Vector2): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public mixX(vector: Vector2, amount: number = 0.5): Vector2 {
        this.x = (1 - amount) * this.x + amount * vector.x;
        return this;
    }

    public mixY(vector: Vector2, amount: number = 0.5): Vector2 {
        this.y = (1 - amount) * this.y + amount * vector.y;
        return this;
    }

    public mix(vector: Vector2, amount: number = 0.5): Vector2 {
        this.mixX(vector, amount);
        this.mixY(vector, amount);
        return this;
    }

    public multiply(vector: Vector2): Vector2 {
        this.multiplyX(vector.x);
        this.multiplyY(vector.y);
        return this;
    }

    public multiplyX(x: number): Vector2 {
        this.x *= x;
        return this;
    }

    public multiplyY(y: number): Vector2 {
        this.y *= y;
        return this;
    }

    public negative(): Vector2 {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    public normalize(): Vector2 {
        const d: number = this.length();

        if (!this.isZero()) {
            this.x /= d;
            this.y /= d;
        }

        return this;
    }

    public rotate(angle: number): Vector2 {
        const nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        const ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

        this.x = nx;
        this.y = ny;

        return this;
    }

    public rotateDeg(degreesRotation: number): Vector2 {
        return this.rotate(MathUtil.degrees2radian(degreesRotation));
    }

    public rotateBy(rotation: number): Vector2 {
        return this.rotate(this.angle() - rotation);
    }

    public rotateByDeg(degreesRotation: number): Vector2 {
        return this.rotateBy(MathUtil.degrees2radian(degreesRotation));
    }

    public rotateTo(rotation: number): Vector2 {
        return this.rotate(rotation - this.angle());
    }

    public rotateToDeg(degreesRotation: number): Vector2 {
        return this.rotateTo(MathUtil.degrees2radian(degreesRotation));
    }

    public subtract(vector: Vector2): Vector2 {
        this.subtractX(vector.x);
        this.subtractX(vector.y);
        return this;
    }

    public subtractX(x: number): Vector2 {
        this.x -= x;
        return this;
    }

    public subtractY(y: number): Vector2 {
        this.y -= y;
        return this;
    }

    public toArray(): [number, number] {
        return [this.x, this.y];
    }

    public toObject(): Vector2Object {
        return {x: this.x, y: this.y};
    }

    public toString(): string {
        return "{Vector2 (x=" + this.x + " y=" + this.y + ")}";
    }

    public zero(): Vector2 {
        this.x = this.y = 0;
        return this;
    }

}

export interface Vector2Object {
    x: number;
    y: number;
}
