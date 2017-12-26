class ParticleEmitter extends GameObject {

    public onUpdate: Signal = new Signal(true);
    private _maxParticles: number = 500;
    private _spawnZone: Rectangle = null;
    private _particleSize: [number, number] = [15, 15];
    private _particleSharp: [number, number] = [0, 0];
    private _particleSpeed: [number, number] = [.2, .2];
    private _particleMass: number = 0;
    private _particleAutoAngle: boolean = false;
    private _particleType: ParticleType = ParticleType.CIRCULAR;
    private _particleColor: Color = Color.BLACK;
    private _particlePosRnd: Position = new Position(0, 0);
    private _lifeSpan: [number, number] = [2000, 2000];
    private _angle: [number, number] = [0, 360];
    //                        From ,   To
    private _animateScale: [number, number, Easing];
    private _animateColor: [Color, Color, Easing];
    private _emitCounter: number = 0;
    private _elapsedTime: number = 0;
    private _particleCount: number = 0;
    private _particleIndex: number = 0;

    public constructor(game: Game, name: string, config?: ParticleEmitterConfig) {
        super(game, name);

        this._emitCounter = 0;

        if (config)
            this.parseConfig(config);
    }

    private _particles: Particle[] = [];

    public get particles(): Particle[] {
        return this._particles;
    }

    private _active: boolean = true;

    public get active(): boolean {
        return this._active;
    }

    private _emissionRate: number = 50;

    public get emissionRate(): number {
        return this._emissionRate;
    }

    private _duration: number = -1;

    public get duration(): number {
        return this._duration;
    }

    public setAnimation(key: string, from: any, to: any, easing?: Easing): void {
        switch (key) {
            case "color":
                this._animateColor = [from, to, easing];
                break;
            case "scale":
                this._animateScale = [from, to, easing];
                break;
        }
    }

    public destroy(): void {
        this.stop();

        this._particleCount = 0;
        this._particles = [];

        console.log("destroy");
    }

    public stop(): void {
        this._active = false;
        this._elapsedTime = 0;
        this._emitCounter = 0;
    }

    public update(): void {
        let delta = 1 / this._game.time.elapsed;

        if (this.active && this.emissionRate > 0) {
            let rate = 1 / this.emissionRate;

            this._emitCounter += delta;

            while (this._particleCount < this._maxParticles && this._emitCounter > rate) {
                this.newParticle();
                this._emitCounter -= rate;
            }

            this._elapsedTime += delta;

            if (this.duration != -1 && this._elapsedTime > this.duration)
                this.stop();
        }

        this._particleIndex = 0;
        while (this._particleIndex < this._particleCount) {

            let p = this._particles[this._particleIndex];

            if (p.lifeTime > 0) {

                p.lifeTime -= 1 / delta;

                p._update();

                this._particleIndex++;
            } else {
                if (this._particleIndex != this._particleCount - 1) {
                    this._particles[this._particleIndex] = this._particles[this._particleCount - 1];
                }

                this._particleCount--;
            }

        }

        if (!this.onUpdate.isEmpty) this.onUpdate.dispatch(this);
    }

    public render(): void {
        if (!this.active) return;

        this._particleIndex = 0;
        while (this._particleIndex < this._particleCount) {
            this._particles[this._particleIndex].render();
            this._particleIndex++;
        }
    }


    private parseConfig(config: ParticleEmitterConfig): void {
        let pv = (v: any): [number, number] => {
            if (typeof (v) === "number") return [v, v];
            else return v;
        };

        if (config.maxParticles !== undefined) this._maxParticles = config.maxParticles;
        if (config.duration !== undefined) this._duration = config.duration;
        if (config.angle !== undefined) this._angle = pv(config.angle);
        if (config.spawnZone !== undefined) this._spawnZone = config.spawnZone;

        if (config.particleType !== undefined) this._particleType = config.particleType;
        if (config.particleColor !== undefined) this._particleColor = config.particleColor;
        if (config.particleSize !== undefined) this._particleSize = pv(config.particleSize);
        if (config.particleSharp !== undefined) this._particleSharp = pv(config.particleSharp);
        if (config.particleSpeed !== undefined) this._particleSpeed = pv(config.particleSpeed);
        if (config.particleLife !== undefined) this._lifeSpan = pv(config.particleLife);
        if (config.particleMass !== undefined) this._particleMass = config.particleMass;

        if (config.particleAutoAngle !== undefined)
            this._particleAutoAngle = config.particleAutoAngle;
    }

    private newParticle(): boolean {
        if (this._particleCount == this._maxParticles) return false;

        let p = new Particle(this._game, this);
        let rnd = (): number => {
            return Math.random() * 1
        };

        let angle = Maths.degrees2radian(this._angle[0] + Math.abs(this._angle[1] - this._angle[0]) * rnd());
        let vec = Vector2.fromAngle(angle);
        let vecSpeed = this._particleSpeed[0] + Math.abs(this._particleSpeed[1] - this._particleSpeed[0]) * rnd();


        p.type = this._particleType;
        p.color = this._particleColor;
        p.position = this.renderPosition.clone().add(new Position(this._particlePosRnd.x * rnd(), this._particlePosRnd.y * rnd())).round();
        p.velocity = vec.multiply(new Vector2(vecSpeed, vecSpeed));

        p.setSize(this._particleSize[0] + Math.abs(this._particleSize[1] - this._particleSize[0]) * rnd());

        p.lifeTime = this._lifeSpan[0] + Math.abs(this._lifeSpan[1] - this._lifeSpan[0]) * rnd();
        p.sharpness = this._particleSharp[0] + Math.abs(this._particleSharp[1] - this._particleSharp[0]) * rnd();
        p.mass = this._particleMass;

        // Spawn in zone if exists
        if (this._spawnZone) {
            p.position.setX(this._spawnZone.x + this._spawnZone.width * rnd());
            p.position.setY(this._spawnZone.y + this._spawnZone.height * rnd());

            // Check if the particle is really inside the zone after calculations
            if (p.position.x < this._spawnZone.x) p.position.x = this._spawnZone.x;
            if (p.position.y < this._spawnZone.y) p.position.y = this._spawnZone.y;

            if (p.position.x > this._spawnZone.x + this._spawnZone.width)
                p.position.x = this._spawnZone.x + this._spawnZone.width - p.size.width;
            if (p.position.y > this._spawnZone.y + this._spawnZone.height)
                p.position.y = this._spawnZone.y + this._spawnZone.height - p.size.height;
        }

        // AutoAngle if the spawn zone exists
        if (this._particleAutoAngle && this._spawnZone) {
            let center = this._spawnZone.getPoint(RectanglePosition.CENTER);

            angle = Math.atan2(center.y - p.position.y, center.x - p.position.x) + Math.PI;
            p.velocity = Vector2.fromAngle(angle).multiply(new Vector2(vecSpeed, vecSpeed));
        }


        if (p.size.width < 0) p.setSize(0);
        else p.setSize(Math.floor(p.size.width));

        if (p.sharpness > 100) p.sharpness = 100;
        else if (p.sharpness < 0) p.sharpness = 0;

        // Animations
        if (this._animateColor) {
            let rgba0 = this._animateColor[0].toRGBA();
            let rgba1 = this._animateColor[1].toRGBA();

            // If colors are random
            if (this._animateColor[0].isRandom) rgba0 = Color.RANDOM.toRGBA();
            if (this._animateColor[1].isRandom) rgba1 = Color.RANDOM.toRGBA();

            p.color = new Color(rgba0.r, rgba0.g, rgba0.b, rgba0.a);
            p.animator.color(new Color(rgba1.r, rgba1.g, rgba1.b, rgba1.a), p.lifeTime, this._animateColor[2]);
        }
        if (this._animateScale) {
            let minSize = Math.min(p.size.width, p.size.height);
            let beginSize = minSize * this._animateScale[0];
            let finishSize = minSize * this._animateScale[1];

            p.size.width = beginSize;
            p.size.height = beginSize;
            p.animator.size({width: finishSize, height: finishSize}, p.lifeTime, this._animateScale[2]);
        }


        p.spawn();


        this._particles[this._particleCount] = p;
        this._particleCount++;
        return true;
    }

}

interface ParticleEmitterConfig {
    maxParticles ?: number;
    duration     ?: number;
    angle        ?: [number, number] | number;
    spawnZone    ?: Rectangle;

    particleType      ?: ParticleType;
    particleColor     ?: Color;
    particleSize      ?: [number, number] | number;
    particleSharp     ?: [number, number] | number;
    particleSpeed     ?: [number, number] | number;
    particleLife      ?: [number, number] | number;
    particleMass      ?: number;
    particleAutoAngle ?: boolean;
}