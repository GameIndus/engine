import Game from '../../core/Game'
import { Size } from '../../geometry/Rectangle'
import Canvas from './Canvas'

export default class CanvasRenderer {
    private readonly game: Game

    private _canvas: Canvas

    private _currentContext: CanvasRenderingContext2D

    private _size: Size

    private _antialias: boolean

    constructor(game: Game) {
        this.game = game

        this._canvas = game.canvas
        this._currentContext = this._canvas.context
        this._size = { width: 0, height: 0 }
        this._antialias = game.config.antialias || true // change???

        this.init()
    }

    private init() {}

    public resize(width: number, height?: number) {
        this._size.width = width
        this._size.height = height || width
    }

    public onResize() {}
}
