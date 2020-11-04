import Game from '../core/Game'
import Signal from '../core/Signal'
import Position from '../geometry/Position'
import Rectangle, { RectanglePosition } from '../geometry/Rectangle'
import Color from '../math/Color'
import Vector2 from '../math/Vector2'
import { Easing } from '../tween/Easing'
import MathUtil from '../util/Math'
import GameObject from './GameObject'
import Particle, { ParticleType } from './Particle'

export class ParticleEmitter extends GameObject {
    private readonly _onUpdate: Signal

    private _maxParticles = 500
    private _spawnZone: Rectangle
    private _particleSize: [number, number] = [15, 15]
    private _particleSharp: [number, number] = [0, 0]
    private _particleSpeed: [number, number] = [0.2, 0.2]
    private _particleMass = 0
    private _particleAutoAngle = false
    private _particleType: ParticleType = ParticleType.CIRCULAR
    private _particleColor: Color = Color.Black
    private _particlePosRnd: Position = new Position(0, 0)
    private _lifeSpan: [number, number] = [2000, 2000]
    private _angle: [number, number] = [0, 360]
    //                        From ,   To
    private _animateScale: [number, number, Easing]
    private _animateColor: [Color, Color, Easing]
    private _emitCounter = 0
    private _elapsedTime = 0
    private _particleCount = 0
    private _particleIndex = 0

    private _particles: Particle[] = []

    private _active = true

    private _emissionRate = 50

    private _duration = -1

    public constructor(game: Game, name: string, config?: ParticleEmitterConfig) {
        super(game, name)

        this._onUpdate = new Signal(true)
        this._spawnZone = new Rectangle()
        this._animateScale = [1, 1, Easing.LINEAR]
        this._animateColor = [Color.Black, Color.Black, Easing.LINEAR]
        this._emitCounter = 0

        if (config) {
            this.parseConfig(config)
        }
    }

    public get onUpdate(): Signal {
        return this._onUpdate
    }

    public get particles(): Particle[] {
        return this._particles
    }

    public get active(): boolean {
        return this._active
    }

    public get emissionRate(): number {
        return this._emissionRate
    }

    public get duration(): number {
        return this._duration
    }

    public setAnimation(key: string, from: any, to: any, easing?: Easing): void {
        switch (key) {
            case 'color':
                this._animateColor = [from, to, easing || Easing.LINEAR]
                break
            case 'scale':
                this._animateScale = [from, to, easing || Easing.LINEAR]
                break
        }
    }

    public destroy(): void {
        this.stop()

        this._particleCount = 0
        this._particles = []

        console.log('destroyed')
    }

    public stop(): void {
        this._active = false
        this._elapsedTime = 0
        this._emitCounter = 0
    }

    public update(): void {
        const delta = 1 / this.game.time.elapsed

        if (this.active && this.emissionRate > 0) {
            const rate = 1 / this.emissionRate

            this._emitCounter += delta

            while (this._particleCount < this._maxParticles && this._emitCounter > rate) {
                this.newParticle()
                this._emitCounter -= rate
            }

            this._elapsedTime += delta

            if (this.duration !== -1 && this._elapsedTime > this.duration) {
                this.stop()
            }
        }

        this._particleIndex = 0
        while (this._particleIndex < this._particleCount) {
            const p = this._particles[this._particleIndex]

            if (p.lifeTime > 0) {
                p.lifeTime -= 1 / delta

                p._update()

                this._particleIndex++
            } else {
                if (this._particleIndex !== this._particleCount - 1) {
                    this._particles[this._particleIndex] = this._particles[this._particleCount - 1]
                }

                this._particleCount--
            }
        }

        if (!this._onUpdate.isEmpty) {
            this._onUpdate.dispatch(this)
        }
    }

    public render(): void {
        if (this.active) {
            this._particleIndex = 0
            while (this._particleIndex < this._particleCount) {
                this._particles[this._particleIndex].render()
                this._particleIndex++
            }
        }
    }

    private parseConfig(config: ParticleEmitterConfig): void {
        const pv = (v: any): [number, number] => {
            return typeof v === 'number' ? [v, v] : v
        }

        if (config.maxParticles !== undefined) {
            this._maxParticles = config.maxParticles
        }
        if (config.duration !== undefined) {
            this._duration = config.duration
        }
        if (config.angle !== undefined) {
            this._angle = pv(config.angle)
        }
        if (config.spawnZone !== undefined) {
            this._spawnZone = config.spawnZone
        }

        if (config.particleType !== undefined) {
            this._particleType = config.particleType
        }
        if (config.particleColor !== undefined) {
            this._particleColor = config.particleColor
        }
        if (config.particleSize !== undefined) {
            this._particleSize = pv(config.particleSize)
        }
        if (config.particleSharp !== undefined) {
            this._particleSharp = pv(config.particleSharp)
        }
        if (config.particleSpeed !== undefined) {
            this._particleSpeed = pv(config.particleSpeed)
        }
        if (config.particleLife !== undefined) {
            this._lifeSpan = pv(config.particleLife)
        }
        if (config.particleMass !== undefined) {
            this._particleMass = config.particleMass
        }

        if (config.particleAutoAngle !== undefined) {
            this._particleAutoAngle = config.particleAutoAngle
        }
    }

    private newParticle(): boolean {
        if (this._particleCount === this._maxParticles) {
            return false
        }

        const p = new Particle(this.game, this)
        const rnd = (): number => {
            return Math.random()
        }

        let angle = MathUtil.degrees2radian(this._angle[0] + Math.abs(this._angle[1] - this._angle[0]) * rnd())
        const vec = Vector2.fromAngle(angle)
        const vecSpeed = this._particleSpeed[0] + Math.abs(this._particleSpeed[1] - this._particleSpeed[0]) * rnd()

        p.type = this._particleType
        p.color = this._particleColor
        p.position = this.renderPosition
            .clone()
            .add(new Position(this._particlePosRnd.x * rnd(), this._particlePosRnd.y * rnd()))
            .round()
        p.velocity = vec.multiply(new Vector2(vecSpeed, vecSpeed))

        p.setSize(this._particleSize[0] + Math.abs(this._particleSize[1] - this._particleSize[0]) * rnd())

        p.lifeTime = this._lifeSpan[0] + Math.abs(this._lifeSpan[1] - this._lifeSpan[0]) * rnd()
        p.sharpness = this._particleSharp[0] + Math.abs(this._particleSharp[1] - this._particleSharp[0]) * rnd()
        p.mass = this._particleMass

        // Spawn in zone if exists
        if (this._spawnZone) {
            p.position.setX(this._spawnZone.x + this._spawnZone.width * rnd())
            p.position.setY(this._spawnZone.y + this._spawnZone.height * rnd())

            // Check if the particle is really inside the zone after calculations
            if (p.position.x < this._spawnZone.x) {
                p.position.x = this._spawnZone.x
            }
            if (p.position.y < this._spawnZone.y) {
                p.position.y = this._spawnZone.y
            }

            if (p.position.x > this._spawnZone.x + this._spawnZone.width) {
                p.position.x = this._spawnZone.x + this._spawnZone.width - p.size.width
            }
            if (p.position.y > this._spawnZone.y + this._spawnZone.height) {
                p.position.y = this._spawnZone.y + this._spawnZone.height - p.size.height
            }
        }

        // AutoAngle if the spawn zone exists
        if (this._particleAutoAngle && this._spawnZone) {
            const center = this._spawnZone.getPoint(RectanglePosition.CENTER)

            angle = Math.atan2(center.y - p.position.y, center.x - p.position.x) + Math.PI
            p.velocity = Vector2.fromAngle(angle).multiply(new Vector2(vecSpeed, vecSpeed))
        }

        p.setSize(p.size.width > 0 ? Math.floor(p.size.width) : 0)
        p.sharpness = MathUtil.clamp(p.sharpness, 0, 100)

        // Animations
        if (this._animateColor[0] !== this._animateColor[1]) {
            const color1 = this._animateColor[0]
            const color2 = this._animateColor[1]

            // If colors are random
            // TODO need a rewrite: prefer using Color.Random at each iteration if random mode activated.
            /*if (this._animateColor[0].isRandom) {
                rgba0 = Color.Random.toRGBA();
            }
            if (this._animateColor[1].isRandom) {
                rgba1 = Color.Random.toRGBA();
            }*/

            p.color = new Color(color1.r, color1.g, color1.b, color1.a)
            p.animator.color(new Color(color2.r, color2.g, color2.b, color2.a), p.lifeTime, this._animateColor[2])
        }
        if (this._animateScale[0] !== this._animateScale[1]) {
            const minSize = Math.min(p.size.width, p.size.height)
            const beginSize = minSize * this._animateScale[0]
            const finishSize = minSize * this._animateScale[1]

            p.size.width = beginSize
            p.size.height = beginSize
            p.animator.size({ width: finishSize, height: finishSize }, p.lifeTime, this._animateScale[2])
        }

        p.spawn()

        this._particles[this._particleCount] = p
        this._particleCount++
        return true
    }
}

export interface ParticleEmitterConfig {
    maxParticles?: number
    duration?: number
    angle?: [number, number] | number
    spawnZone?: Rectangle

    particleType?: ParticleType
    particleColor?: Color
    particleSize?: [number, number] | number
    particleSharp?: [number, number] | number
    particleSpeed?: [number, number] | number
    particleLife?: [number, number] | number
    particleMass?: number
    particleAutoAngle?: boolean
}
