import Game from '../core/Game'
import Circle from '../geometry/Circle'
import Star from '../geometry/complex/Star'
import Rectangle from '../geometry/Rectangle'
import Vector2 from '../math/Vector2'
import Texture from '../renderer/texture/Texture'
import GradientTexture from '../renderer/texture/TextureGradient'
import Gradient from '../util/Gradient'
import GeometricAnimator from './animator/GeometricAnimator'
import GeometricObject from './GeometricObject'
import { ParticleEmitter } from './ParticleEmitter'

// Inspired from www.mrspeaker.net/dev/parcycle/script/particle.js (Mr. Speaker)
export default class Particle extends GeometricObject {
    protected _animator: GeometricAnimator

    private _type: ParticleType

    private _texture: Texture

    private _lifeTime: number

    private _sharpness: number

    private _sizeCenter: number

    private _mass: number

    private _massFactor: number

    public constructor(game: Game, emitter: ParticleEmitter) {
        super(game)
        this._animator = new GeometricAnimator(game, this)
        this._type = ParticleType.CIRCULAR
        this._texture = Texture.prototype
        this._lifeTime = 0
        this._sharpness = 0
        this._sizeCenter = 0
        this._mass = 0
        this._massFactor = 0
    }

    public get type(): ParticleType {
        return this._type
    }

    public set type(type: ParticleType) {
        this._type = type
    }

    public get texture(): Texture {
        return this._texture
    }

    public get lifeTime(): number {
        return this._lifeTime
    }

    public set lifeTime(lifeTime: number) {
        this._lifeTime = lifeTime
    }

    public get sharpness(): number {
        return this._sharpness
    }

    public set sharpness(sharpness: number) {
        this._sharpness = sharpness
    }

    public get sizeCenter(): number {
        return this._sizeCenter
    }

    public set sizeCenter(sizeCenter: number) {
        this._sizeCenter = sizeCenter
    }

    public get mass(): number {
        return this._mass
    }

    public set mass(mass: number) {
        this._mass = mass
    }

    public spawn(): void {
        switch (this.type) {
            case ParticleType.GRADIENT:
                this._texture = new GradientTexture(
                    this.game,
                    Gradient.createRadialGradient(this.size, this.sizeCenter, this.color, this.color),
                )
                break
        }

        // console.log( this.animator._colorTween );
    }

    public update(): void {
        // Update mass
        if (this.mass > 0) {
            this._massFactor *= this.mass
            this.velocity.add(new Vector2(0, this._massFactor))
        }
    }

    public render(): void {
        switch (this.type) {
            case ParticleType.GRADIENT:
                if (this.texture != null) {
                    this.game.graphics.drawParticle(this.texture, this.renderPosition.x, this.renderPosition.y)
                }
                break

            case ParticleType.CIRCULAR:
                const min = Math.min(this.renderSize.width, this.renderSize.height)

                this.game.graphics.drawShape(
                    new Circle(this.renderPosition.x, this.renderPosition.y, min),
                    true,
                    this.color,
                )
                break

            case ParticleType.SQUARE:
                this.game.graphics.drawShape(
                    new Rectangle(
                        this.renderPosition.x,
                        this.renderPosition.y,
                        this.renderSize.width,
                        this.renderSize.height,
                    ),
                    true,
                    this.color,
                )
                break

            case ParticleType.STAR:
                const star = new Star(4)
                star.calculatePoints(this.renderPosition, this.renderSize)
                this.game.graphics.drawShape(star, true, this.color)
                break
        }
    }
}

export enum ParticleType {
    GRADIENT,
    CIRCULAR,
    SQUARE,
    STAR,
    TEXTURED,
}
