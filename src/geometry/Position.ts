export default class Position {
    private _x: number

    private _y: number

    private _hooks: Array<(position: Position) => any>

    private _lerpPos?: Position

    private _lerpFactor?: number

    constructor(x?: number, y?: number) {
        this._x = x || 0
        this._y = y || 0
        this._hooks = []
    }

    public get x(): number {
        return this._x
    }

    public set x(x: number) {
        this._x = x
    }

    public get y(): number {
        return this._y
    }

    public set y(y: number) {
        this._y = y
    }

    public add(position: Position): Position {
        this.addX(position.getX())
        this.addY(position.getY())
        return this
    }

    public addX(x: number): Position {
        this.x = this.hook(this.x + x)
        return this
    }

    public addY(y: number): Position {
        this.y = this.hook(this.y + y, true)
        return this
    }

    public angleTo(position: Position): number {
        const piAngle = Math.atan2(this.getY() - position.getY(), this.getX() - position.getX())
        return ((180 * piAngle) / Math.PI - 90) % 360
    }

    public clone(): Position {
        return new Position(this.x, this.y)
    }

    public distanceTo(position: Position): number {
        const dX = position.getX() - this.getX()
        const dY = position.getY() - this.getY()
        return Math.sqrt(dX * dX + dY * dY)
    }

    public equals(position?: Position): boolean {
        return position instanceof Position && position.x === this.x && position.y === this.y
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }

    public lerpTo(position: Position, factor: number) {
        this._lerpPos = position
        this._lerpFactor = factor
    }

    public round(): Position {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        return this
    }

    public set(x: number, y: number): Position {
        this.x = x
        this.y = y
        return this
    }

    public setX(x: number): Position {
        this.x = x
        return this
    }

    public setY(y: number): Position {
        this.y = y
        return this
    }

    public shortestAngleTo(position: Position): number {
        const angle: number = this.angleTo(position)
        return angle > 180 ? angle - 360 : angle
    }

    public subtract(position: Position): Position {
        position = this.hookPosition(position)
        this.subtractX(position.getX())
        this.subtractY(position.getY())

        return this
    }

    public subtractX(x: number): Position {
        this.x = this.hook(this.x - x)
        return this
    }

    public subtractY(y: number): Position {
        this.y = this.hook(this.y - y, true)
        return this
    }

    private applyHook(func: (position: Position) => void) {
        this._hooks.push(func)
    }

    private hook(n: number, isY = false): number {
        if (this._hooks.length === 0) {
            return n
        }

        let position: Position = new Position(isY ? this.getX() : n, isY ? n : this.getY())

        this._hooks.forEach(hook => {
            const back = hook(position)
            if (back != null) {
                position = back
            }
        })

        return isY ? position.getY() : position.getX()
    }

    private hookPosition(position: Position): Position {
        if (this._hooks.length === 0) {
            return position
        }

        position = position.clone()

        this._hooks.forEach(hook => {
            const back = hook(position)
            if (back != null) {
                position = back
            }
        })

        return position
    }
}
