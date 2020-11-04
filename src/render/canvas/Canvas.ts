import { RectangleSize } from '../../geometry/Rectangle'

export default class Canvas {
    protected initialized: boolean

    protected _wrapper: HTMLElement

    protected _canvas: HTMLCanvasElement

    protected _context: CanvasRenderingContext2D

    public constructor() {
        this.initialized = false
        this._wrapper = HTMLElement.prototype
        this._canvas = HTMLCanvasElement.prototype
        this._context = CanvasRenderingContext2D.prototype
    }

    public get wrapper(): HTMLElement {
        return this._wrapper
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    public get context(): CanvasRenderingContext2D {
        return this._context
    }

    public get element(): HTMLCanvasElement {
        return this._canvas
    }

    public get size(): RectangleSize {
        if (!this.element) {
            return { width: 0, height: 0 }
        }

        return { width: this.element.width, height: this.element.height }
    }

    public setup(width: number, height: number, id?: string, parent?: HTMLElement, autoFocus?: boolean): void {
        if (this.initialized) {
            return
        }
        this.initialized = true

        this._canvas = document.createElement('canvas')

        if (id && id !== '') {
            this.canvas.id = id
        }

        this.canvas.style.display = 'block'
        this.canvas.width = width
        this.canvas.height = height

        this.canvas.tabIndex = 1000

        this.addToDOM(parent)

        if (autoFocus) {
            this.canvas.focus()
        }

        const context = this.canvas.getContext('2d')
        if (context !== null) {
            this._context = context
        }
    }

    public clear(): void {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    private addToDOM(parent?: HTMLElement): void {
        let target: HTMLElement
        const wrapper: HTMLElement = document.createElement('div')

        if (parent && parent.nodeType === 1) {
            target = parent
        } else {
            target = document.body
        }

        target.style.overflow = 'hidden'

        wrapper.className = 'gameindus-engine-wrapper'
        wrapper.style.display = 'block'
        wrapper.style.position = 'relative'
        wrapper.style.width = this.canvas.width + 'px'
        wrapper.style.height = this.canvas.height + 'px'

        this._wrapper = wrapper

        wrapper.appendChild(this.canvas)
        target.appendChild(wrapper)
    }

    private removeFromDOM(): void {
        if (this.initialized && this.canvas != null && this.canvas.parentNode != null) {
            this.canvas.parentNode.removeChild(this.canvas)
        }
    }
}
