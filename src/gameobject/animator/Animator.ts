import Game from '../../core/Game'
import { Size } from '../../geometry/Rectangle'
import { Easing } from '../../tween/Easing'
import Tween from '../../tween/Tween'
import GameObject from '../GameObject'

export default class Animator {
    protected _object: GameObject

    private readonly _game: Game

    private _positionTween?: Tween

    private _sizeTween?: Tween

    public constructor(game: Game, object: GameObject) {
        this._game = game
        this._object = object
    }

    protected get game(): Game {
        return this._game
    }

    protected get object(): GameObject {
        return this._object
    }

    public position(
        positionTo: Position,
        duration: number,
        easing?: Easing,
        delay?: number,
        repeats?: number,
        yoyo?: boolean,
    ): Tween {
        if (this._positionTween) {
            this._positionTween.destroy()
        }

        if (!easing) {
            easing = Easing.LINEAR
        }

        this._positionTween = this.game.tween(this.object.position).easing(easing).to(positionTo, duration)

        if (delay) {
            this._positionTween.delay(delay)
        }
        if (repeats) {
            this._positionTween.repeat(repeats)
        }
        if (yoyo) {
            this._positionTween.yoyo()
        }

        this._positionTween.start()
        return this._positionTween
    }

    public size(
        sizeTo: Size,
        duration: number,
        easing?: Easing,
        delay?: number,
        repeats?: number,
        yoyo?: boolean,
    ): Tween {
        if (this._sizeTween) {
            this._sizeTween.destroy()
        }

        if (!easing) {
            easing = Easing.LINEAR
        }

        this._sizeTween = this.game.tween(this.object.size).easing(easing).min(0).to(sizeTo, duration)

        if (delay) {
            this._sizeTween.delay(delay)
        }
        if (repeats) {
            this._sizeTween.repeat(repeats)
        }
        if (yoyo) {
            this._sizeTween.yoyo()
        }

        this._sizeTween.start()
        return this._sizeTween
    }
}
