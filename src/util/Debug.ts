import Game from '../core/Game'
import Stats from './debug/Stats'

export default class Debug {
    private readonly game: Game

    private readonly _stats: Stats

    private _activated: boolean

    public constructor(game: Game) {
        this.game = game
        this._stats = new Stats(this.game)
        this._activated = false
    }

    public get stats(): Stats {
        return this._stats
    }

    public get activated(): boolean {
        return this._activated
    }

    public set activated(activated: boolean) {
        this._activated = activated
    }

    public boot(): void {
        this._stats.boot()
    }
}
