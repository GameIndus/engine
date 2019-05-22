import Game from "../core/Game";
import Signal from "../core/Signal";
import Color from "../util/Color";
import Loader from "./Loader";
import LoaderImages from "./LoaderImages";

export default class SplashScreen {

    private readonly _onSplashEnded: Signal;

    private game: Game;

    private loader: Loader;

    private _initialized: boolean;

    private _ended: boolean;

    private _lastPercent: number;

    private _lastProgressState: boolean;

    private _progressReady: boolean;

    private _loadingElement?: HTMLElement;

    private _progressElement?: HTMLElement;

    private _backgroundColor: Color;

    private _progressBarColor: Color;

    private _progressBackgroundColor: Color;

    private _madeByColor: Color;

    private _inRendering: boolean;

    constructor(game: Game, loader: Loader) {
        this._onSplashEnded = new Signal();

        this.game = game;
        this.loader = loader;

        this._initialized = false;
        this._ended = false;
        this._lastPercent = 0;
        this._lastProgressState = false;
        this._progressReady = false;

        this._backgroundColor = Color.fromHex("#F1F5F6") || Color.WHITE;
        this._progressBarColor = Color.fromHex("#2980b9") || Color.BLUE;
        this._progressBackgroundColor = Color.fromHex("#DDDDDD") || Color.GRAY;
        this._madeByColor = Color.fromHex("#1d1b1b") || Color.BLACK;
        this._inRendering = false;

        // Use the loader configuration to setup the splash screen
        if (loader.config && loader.config.backgroundColor) {
            this._backgroundColor = loader.config.backgroundColor;
        }
        if (loader.config && loader.config.progressBarColor) {
            this._progressBarColor = loader.config.progressBarColor;
        }
        if (loader.config && loader.config.progressBackgroundColor) {
            this._progressBackgroundColor = loader.config.progressBackgroundColor;
        }
        if (loader.config && loader.config.madeByColor) {
            this._madeByColor = loader.config.madeByColor;
        }
    }

    public get inRendering(): boolean {
        return this._inRendering;
    }

    public boot(): void {
        if (this._initialized) {
            return;
        }

        const self = this;
        let multiplier: number = 1000;
        let debugMode: boolean;

        this._initialized = true;
        this._inRendering = true;

        // Reduce loading time & animations when debugMode activated
        debugMode = this.game.debugModeActivated;
        multiplier = debugMode ? 1 : 1000;

        // Create all elements for the splash screen
        const wrapper: HTMLElement = this.game.canvas.wrapper;
        const loading: HTMLElement = document.createElement("div");
        const madeBy: HTMLElement = document.createElement("div");
        const progressC: HTMLElement = document.createElement("div");
        const progress: HTMLElement = document.createElement("div");
        const link: HTMLAnchorElement = document.createElement("a");
        const loaderLogo: HTMLElement = document.createElement("div");

        const encodedLogo: string = (!debugMode) ? LoaderImages.START_ANIMATION : LoaderImages.LOAD_ANIMATION;

        link.href = "https://gameindus.fr/?_st_=fE";
        link.target = "_BLANK";

        loading.style.width = "100%";
        loading.style.height = "100%";
        loading.style.zIndex = "10000";
        loading.style.backgroundColor = this._backgroundColor.toString("rgba");
        loading.style.display = "block";
        loading.style.position = "absolute";
        loading.style.left = "0";
        loading.style.right = "0";
        loading.style.top = "0";
        loading.style.bottom = "0";

        loaderLogo.style.display = "block";
        loaderLogo.style.position = "absolute";
        loaderLogo.style.width = "421px";
        loaderLogo.style.height = "82px";
        if (!debugMode) {
            loaderLogo.style.transition = "opacity ease-out .4s";
        }
        loaderLogo.style.left = "calc(50% - 210.5px)";
        loaderLogo.style.top = "calc(50% - 82px)";

        loaderLogo.style.background = "url(" + encodedLogo + ") no-repeat left top";
        loaderLogo.className = "logo";

        madeBy.style.position = "absolute";
        madeBy.style.width = "100%";
        madeBy.style.textAlign = "center";
        madeBy.style.top = "calc(50% - 30px)";
        madeBy.style.opacity = "0";
        if (!debugMode) {
            madeBy.style.transition = "ease-out .4s";
        }
        madeBy.style.fontFamily = "'Open Sans',Helvetica,Arial,sans-serif";
        madeBy.style.fontSize = "19px";
        madeBy.style.fontWeight = "300";
        madeBy.style.color = this._madeByColor.toString("rgba");
        madeBy.className = "made-by";

        progressC.style.display = "block";
        progressC.style.position = "absolute";
        progressC.style.width = "421px";
        progressC.style.height = "5px";
        progressC.style.opacity = "0";
        progressC.style.transition = "ease-out .3s";
        progressC.style.background = this._progressBackgroundColor.toString("rgba");
        progressC.style.left = "calc(50% - 210.5px)";
        progressC.style.top = "calc(50% + 40px)";

        progress.style.display = "block";
        progress.style.position = "absolute";
        progress.style.width = "0";
        progress.style.height = "5px";
        progress.style.opacity = "1";
        progress.style.transition = "ease-out .7s";
        progress.style.background = this._progressBarColor.toString("rgba");
        progress.style.left = "0";
        progress.style.top = "0";

        setTimeout(() => {
            madeBy.style.opacity = "1";
            madeBy.style.top = "calc(50% - 110px)";
        }, 0.1 * multiplier);
        setTimeout(() => {
            progressC.style.opacity = "1";

            setTimeout(() => {
                self._progressReady = true;
            }, multiplier);
        }, 2 * multiplier);

        madeBy.innerHTML = "créé avec";

        this._loadingElement = loading;
        this._progressElement = progress;

        link.appendChild(madeBy);
        link.appendChild(loaderLogo);

        progressC.appendChild(progress);

        loading.appendChild(link);
        loading.appendChild(progressC);

        wrapper.appendChild(loading);
    }

    public end(): void {
        const self: SplashScreen = this;

        if (this._progressElement && this._progressElement.parentElement) {
            this._progressElement.parentElement.style.opacity = "0";
        }

        if (this._loadingElement) {
            const logo: HTMLElement = this._loadingElement.querySelector("a .logo") as HTMLElement;
            const madeBy: HTMLElement = this._loadingElement.querySelector("a .made-by") as HTMLElement;

            madeBy.style.opacity = "0";
            logo.style.opacity = "0";

            setTimeout(() => {
                const el = self._loadingElement;

                self._inRendering = false;
                if (el) {
                    el.remove();
                }

                self._onSplashEnded.dispatch();
            }, 750);
        }
    }

    public update(): void {
        if (!this._initialized || !this.inRendering) {
            return;
        }

        if (this._lastPercent !== this.loader.progress ||
            this._lastProgressState !== this._progressReady ||
            this.game.debugModeActivated) {

            if (this._progressElement != null && this._progressReady) {
                this._progressElement.style.width = this.loader.roundProgress + "%";

                if (this.loader.progress >= 100 && !this._ended) {
                    const self = this;

                    this._ended = true;

                    setTimeout(() => {
                        self.end();
                    }, 700);
                }

                this._lastPercent = this.loader.progress;
                this._lastProgressState = this._progressReady;
            }
        }
    }

}
