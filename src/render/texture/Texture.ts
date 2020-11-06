import Game from '../../core/Game'
import Rectangle, { Size } from '../../geometry/Rectangle'
import Gradient from '../../util/Gradient'
import CanvasBuffer from '../canvas/CanvasBuffer'

export default class Texture {
    private _game: Game

    private readonly _crop: Rectangle

    private _hasFrame: boolean

    private _source: HTMLImageElement | Gradient | null

    private _buffer: CanvasBuffer

    private readonly _frame: Size

    private _repeat: boolean

    private _valid = false

    public constructor(game: Game, sourceName: string | null, frame?: Size, crop?: Rectangle, repeat?: boolean) {
        this._game = game

        this._source =
            game.cache && sourceName && game.cache.getImage(sourceName) ? game.cache.getImage(sourceName) : null
        this._buffer = CanvasBuffer.prototype
        this._hasFrame = false
        this._frame = frame || { width: 0, height: 0 }
        this._crop = crop || new Rectangle()
        this._repeat = repeat || false

        if (frame) {
            this._hasFrame = true
        }

        if (this._source && this._source.width && this._source.height) {
            this.initBuffer()
        } else {
            if (sourceName) {
                if (game.loader) {
                    this.checkForRessource(sourceName)
                } else {
                    game.preload.add(() => {
                        this.checkForRessource(sourceName)
                        return true
                    })
                }
            }
        }
    }

    public get source(): HTMLImageElement | Gradient | null {
        return this._source
    }

    public get buffer(): CanvasBuffer {
        return this._buffer
    }

    public get frame(): Size {
        return this._frame
    }

    public get repeat(): boolean {
        return this._repeat
    }

    public set repeat(repeat: boolean) {
        this._repeat = repeat

        if (this._buffer) {
            this._buffer.repeatSource = repeat
        }
    }

    public get valid(): boolean {
        return this._valid
    }

    public get cropFrame(): Rectangle {
        if (this._crop.width > 0 && this._crop.height > 0) {
            return this._crop
        }
        if (this.source) {
            return new Rectangle(0, 0, this.source.width, this.source.height)
        } else {
            return new Rectangle(0, 0, 0, 0)
        }
    }

    public get height(): number {
        return this._frame.height
    }

    public get width(): number {
        return this._frame.width
    }

    public setFrameTo(width: number, height: number): void {
        this.frame.width = width
        this.frame.height = height

        this._hasFrame = true

        this._buffer.resize(width, height)
    }

    public cropTo(x: number, y: number, width: number, height: number): void {
        this._crop.setTo(x, y, width, height)

        if (this._buffer) {
            this._buffer.clip(this._crop)
        }
    }

    protected initBuffer(): void {
        if (!this._source) {
            return
        }

        if (this.frame.width === 0 && this.frame.height === 0) {
            this.frame.width = this._source.width
            this.frame.height = this._source.height
        }

        this._buffer = new CanvasBuffer(this._source)

        this._buffer.setup(this.width, this.height)
        this._buffer.repeatSource = this._repeat

        if (this._crop.width === 0 && this._crop.height === 0) {
            this._crop.x = 0
            this._crop.y = 0
            this._crop.width = this.width
            this._crop.height = this.height
        } else {
            this._buffer.clip(this._crop)
        }

        this._valid = this.frame && this.width > 0 && this.height > 0
    }

    private checkForRessource(sourceName: string): void {
        const signal = this._game.loader.onFileComplete

        signal.add(file => {
            if (file.key === sourceName) {
                this._source = file.data
                this.initBuffer()

                signal.dispose()
            }
            return true
        })
    }
}
