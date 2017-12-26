class GameLoop {

    private game: Game;
    private forceTimeout: boolean;
    private animationFrame: Function;
    private onLoop: FrameRequestCallback;
    private loopId: number;

    public constructor(game: Game, forceTimeout ?: boolean) {
        this.game = game;
        this.forceTimeout = forceTimeout || false;

        this._initialize();
    }

    private _isRunning: boolean;

    public get isRunning(): boolean {
        return this._isRunning;
    }

    private _isSetTimeout: boolean;

    public get isSetTimeout(): boolean {
        return this._isSetTimeout;
    }

    public start(): void {
        let self: GameLoop = this;

        this._isRunning = true;

        if (window.requestAnimationFrame && !this.forceTimeout) {

            this._isSetTimeout = false;

            this.onLoop = function (time) {
                return self.updateFromRAF(time);
            };

            this.loopId = window.requestAnimationFrame(this.onLoop);

        } else {

            this._isSetTimeout = true;

            this.onLoop = function () {
                return self.updateFromTimeout();
            }

            this.loopId = window.setTimeout(this.onLoop, 0);

        }
    }

    public stop(): void {
        if (this.isSetTimeout) {
            clearTimeout(this.loopId);
        } else {
            window.cancelAnimationFrame(this.loopId);
        }

        this._isRunning = false;
    }

    private _initialize(): void {
        Util.getVendors().forEach(function (vendor) {

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'];
            }

        });
    }

    private updateFromTimeout(): void {
        if (this.isRunning) {
            this.game.update(Date.now());

            this.loopId = window.setTimeout(this.onLoop, this.game.time.callTime);
        }
    }

    private updateFromRAF(time: number): void {
        if (this.isRunning) {
            this.game.update(Math.floor(time));

            this.loopId = window.requestAnimationFrame(this.onLoop);
        }
    }

}