import Point from './Point'
import Shape from './Shape'

export default class Circle implements Shape {
    private readonly _x: number

    private readonly _y: number

    private readonly _diameter: number

    public constructor(x?: number, y?: number, diameter?: number) {
        this._x = x || 0
        this._y = y || 0
        this._diameter = diameter || 0
    }

    public get x(): number {
        return this._x
    }

    public get y(): number {
        return this._y
    }

    public get diameter(): number {
        return this._diameter
    }

    public get points(): Point[] {
        return []
    }

    public get radius(): number {
        return this.diameter / 2
    }

    public area(): number {
        // tslint:disable-next-line:no-bitwise
        return Math.PI * ((this._diameter / 2) ^ 2)
    }

    public toString(): string {
        return '{Circle (x=' + this.x + ' y=' + this.y + ' diameter=' + this.diameter + ')}'
    }
}
