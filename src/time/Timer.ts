import Signal from '../core/Signal'

export default class Timer {
    private _delay: number

    private _delayed?: number

    private onComplete: Signal | null

    private _elapsed: number

    private _expired: boolean

    private _paused: boolean

    private _started: number

    private _repeats: number

    public constructor(delay: number, onComplete: () => boolean) {
        this._delay = delay
        this._elapsed = delay
        this._expired = false
        this._paused = true
        this._started = -1
        this._repeats = 0

        this.onComplete = new Signal(true)

        if (onComplete != null) {
            this.onComplete.add(onComplete)
        }
    }

    public get elapsed(): number {
        return this._elapsed
    }

    public set elapsed(elapsed: number) {
        this._elapsed = elapsed
    }

    private get expired(): boolean {
        return this._expired
    }

    private set expired(expired: boolean) {
        this._expired = expired
    }

    private get paused(): boolean {
        return this._paused
    }

    private set paused(paused: boolean) {
        this._paused = paused
    }

    private get started(): number {
        return this._started
    }

    private set started(started: number) {
        this._started = started
    }

    private get repeats(): number {
        return this._repeats
    }

    private set repeats(repeats: number) {
        this._repeats = repeats
    }

    public destroy(): void {
        this.expired = true
        this.onComplete = null
    }

    public pause(): Timer {
        if (!this.paused && this.started > 0) {
            this.elapsed -= Date.now() - this.started
        }

        console.log(this.elapsed)

        this.paused = true
        return this
    }

    public repeat(repeats: number): Timer {
        if (repeats >= 1) {
            this.repeats = repeats - 1
        }
        return this
    }

    public resume(): Timer {
        if (this.started === 0 || !this.paused || this.expired) {
            return this
        }

        this.started = Date.now()
        this.paused = false

        return this
    }

    public start(): Timer {
        if (!this.expired && this.paused) {
            this.started = Date.now()
            this.paused = false
        }

        return this
    }

    public startIn(delay: number): Timer {
        if (!this.expired && this.paused) {
            this.started = Date.now()
            this._delayed = delay
        }

        return this
    }

    public update(): boolean {
        if (this.expired) {
            return false
        }

        if (this.paused || this.started === 0) {
            if (this._delayed !== undefined) {
                const startDiff: number = this.started + this._delayed - Date.now()
                if (startDiff <= 0) {
                    this.start()
                }
            }
            return true
        }

        const diff: number = this.started + this.elapsed - Date.now()

        if (diff <= 0) {
            if (this.onComplete != null) {
                this.onComplete.dispatch()
            }

            if (this.repeats > 0) {
                this.repeats--
                this.elapsed = this._delay
                this.started = Date.now()
            } else {
                this.expired = true
            }
        }

        return true
    }
}
