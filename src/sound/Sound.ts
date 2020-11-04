import Game from '../core/Game'

export default class Sound {
    private _game: Game

    private _autoplay = false
    private _loop = false
    private _key: string
    private _name: string

    private _startTime = 0
    private _currentTime = 0
    private _duration = 0

    private _paused = false
    private _override = false // Will always start playing from the beginning

    // TODO

    constructor(game: Game) {
        this._game = game
        this._key = 'TODO'
        this._name = 'TODO'
    }
}
