import Game from '../core/Game'
import Signal from '../core/Signal'
import GameObject from './GameObject'
import Graphics from './Graphics'

export default class Group extends GameObject {
    private readonly _onAddedToGroup: Signal

    private _children: GameObject[]

    public constructor(game: Game, name?: string) {
        super(game, name)
        this._onAddedToGroup = new Signal(true)
        this._children = []
    }

    public get onAddedToGroup(): Signal {
        return this._onAddedToGroup
    }

    public get children(): GameObject[] {
        return this.children
    }

    public add(object: GameObject, silent = false, index?: number): GameObject {
        if (object.parent === this) {
            return object
        }

        return object
    }

    public render(graphics: Graphics, time: number): void {
        // Not implemented
    }

    public update(): void {
        // Not implemented
    }

    // private addToGroup(gameobject, )
}
