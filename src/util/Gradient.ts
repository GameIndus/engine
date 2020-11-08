import { Size } from '../geometry/Rectangle'
import Color from '../math/Color'
import Canvas from '../renderer/canvas/Canvas'

export default class Gradient {
    public static createRadialGradient(size?: Size, centerRadius?: number, ...colors: Color[]): Gradient {
        const g = new Gradient(GradientType.RADIAL, size)
        g.colors = colors
        g._centerRadius = centerRadius || 5
        return g
    }

    private _canvas?: Canvas

    private _centerRadius: number

    private _gradient: CanvasGradient

    private _type: GradientType

    private _size: Size

    private _colors: Color[]

    public constructor(type?: GradientType, size?: Size, ...colors: Color[]) {
        this._centerRadius = 0
        this._gradient = CanvasGradient.prototype
        this._type = type || GradientType.LINEAR
        this._size = size || { width: 50, height: 50 }
        this._colors = colors || []
    }

    public get gradient(): CanvasGradient {
        return this._gradient
    }

    public get type(): GradientType {
        return this._type
    }

    public get size(): Size {
        return this._size
    }

    public set size(size: Size) {
        this._size = size
        this.generate()
    }

    public get colors(): Color[] {
        return this._colors
    }

    public set colors(colors: Color[]) {
        this._colors = colors
        this.generate()
    }

    public get width(): number {
        return this.size.width
    }

    public get height(): number {
        return this.size.height
    }

    public setup(canvas: Canvas): void {
        this._canvas = canvas
        this.generate()
    }

    public generate(): void {
        if (this._canvas == null) {
            return
        }

        if (this.type === GradientType.LINEAR) {
            this._gradient = this._canvas.context.createLinearGradient(0, 0, this.size.width, this.size.height)
        } else {
            const size = Math.min(this.size.width, this.size.height)
            const halfSize = size / 2

            this._gradient = this._canvas.context.createRadialGradient(
                halfSize,
                halfSize,
                this._centerRadius,
                halfSize,
                halfSize,
                halfSize,
            )
        }

        const nbColors = this.colors.length
        const stopStep = 1 / (nbColors - 1)

        for (let step = 0, i = 0; step <= 1; step += stopStep, i++) {
            this._gradient.addColorStop(step, this.colors[i].rgba)
        }
    }
}

enum GradientType {
    LINEAR,
    RADIAL,
}
