import Rectangle from '../../geometry/Rectangle'
import Gradient from '../../util/Gradient'
import Canvas from './Canvas'
import CanvasPool from './CanvasPool'

export default class CanvasBuffer extends Canvas {
    private _clipping: Rectangle

    private _repeatSource: boolean

    private readonly _source: HTMLImageElement | Gradient

    public constructor(source: HTMLImageElement | Gradient) {
        super()
        this._clipping = new Rectangle()
        this._repeatSource = false
        this._source = source
        this._canvas = CanvasPool.create(this, source.width, source.height)
    }

    public get source(): HTMLImageElement | Gradient {
        return this._source
    }

    public set repeatSource(repeat: boolean) {
        this._repeatSource = repeat
    }

    public clip(clippingRectangle: Rectangle): void {
        this._clipping = clippingRectangle.clone()
        this.redraw()
    }

    public resize(width: number, height: number): void {
        if (this.canvas && this._context) {
            this.canvas.width = width
            this.canvas.height = height

            this.redraw()
        }
    }

    public setup(width: number, height: number): void {
        const context = this.canvas.getContext('2d')
        if (context !== null) {
            this._context = context
        }

        // document.body.appendChild( this.canvas );
        this.resize(width, height)
    }

    public clear(): void {
        if (this.canvas && this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    public redraw(): void {
        this.clear()

        if (this.source && this.source instanceof HTMLImageElement) {
            if (!this._clipping) {
                this.context.drawImage(this.source, 0, 0, this.canvas.width, this.canvas.height)
            } else {
                this.context.drawImage(
                    this.source,
                    this._clipping.x,
                    this._clipping.y,
                    this._clipping.width,
                    this._clipping.height,
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height,
                )
            }
        } else {
            this.source.setup(this)
            this.context.fillStyle = this.source.gradient
            this.context.fillRect(0, 0, this.source.size.width, this.source.size.height)
        }
    }
}
