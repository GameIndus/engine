class Time {

    private static _timers: Timer[] = [];
    private game: Game;
    private _started: number;
    private timeExpected: number;
    private _now: number;
    private _lastTime: number;

    public constructor(game: Game) {
        this.game = game;
    }

    private _callTime: number = 0;

    public get callTime(): number {
        return this._callTime;
    }

    private _fps: number = 60;

    public get fps(): number {
        return this._fps;
    }

    private _time: number;

    public get time(): number {
        return this._time;
    }

    // For game update loop
    private _elapsed: number;

    public get elapsed(): number {
        return this._elapsed;
    }

    public get fpsFactor(): number {
        return 1.0 / this._fps;
    }

    public static createTimer(delay: number, callback: Function): Timer {
        let timer: Timer = new Timer(delay, callback);
        this._timers.push(timer);
        return timer;
    }

    public static createRepeatedTimer(delay: number, repeats: number, callback: Function): Timer {
        return Time.createTimer(delay, callback).repeat(repeats);
    }

    public static now(): number {
        if (window.performance !== undefined && window.performance.now !== undefined) {
            return window.performance.now.bind(window.performance)();
        } else if (Date.now !== undefined) {
            return Date.now();
        } else {
            return new Date().getTime();
        }
    }

    public boot(): void {
        this._started = Date.now();
        this._time = Date.now();
        this.timeExpected = this.time;
    }

    public gamePaused(): void {
        // Pause timers
        let i: number = Time._timers.length;
        while (i--) {
            Time._timers[i].pause();
        }
    }

    public gameResumed(): void {
        this._time = Date.now();

        // Resume timers
        let i: number = Time._timers.length;
        while (i--) {
            Time._timers[i].resume();
        }
    }

    public refresh(): void {
        this._time = Date.now();
    }

    public update(time: number): void {
        this._time = Date.now();

        // Update time for game update loop
        this._lastTime = this._now;
        this._now = time;
        this._elapsed = this._now - this._lastTime;

        if (this.game.loop.isSetTimeout) {
            this._callTime = Math.floor(Math.max(0, (1000.0 / this._fps) - (this.timeExpected - time)));

            this.timeExpected = time + this._callTime;
        }

        this.updateTimers();
    }

    public updateTimers(): void {
        let timers: Timer[] = Time._timers;
        let i: number = 0;

        let len: number = timers.length;

        while (i < len) {

            if (timers[i].update()) {
                i++;
            } else {
                // Timer needs to be removed
                Time._timers.splice(i, 1);
                len--;
            }

        }
    }

}