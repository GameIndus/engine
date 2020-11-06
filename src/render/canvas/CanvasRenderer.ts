import Game from '../../core/Game'
import { Size } from '../../geometry/Rectangle'
import Canvas from './Canvas'

export default class CanvasRenderer {
    private readonly game: Game

    private _canvas: Canvas

    private _currentContext: CanvasRenderingContext2D

    // private _antialias

    // private _size: Size

    constructor(game: Game) {
        this.game = game

        this._canvas = game.canvas
        this._currentContext = this._canvas.context
    }
}
