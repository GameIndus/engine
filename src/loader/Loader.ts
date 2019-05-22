import Game from "../core/Game";
import Signal from "../core/Signal";
import {LoaderConfig} from "../util/GameConfig";
import Util from "../util/Util";
import {CacheFile} from "./DataCache";
import SplashScreen from "./SplashScreen";

export default class Loader {

    private game: Game;

    private _loading: boolean;

    private _loadFinished: boolean;

    private _loadedFileCount: number;

    private _totalFileCount: number;

    private _queuedFiles: CacheFile[];

    private _queueSize: number;

    private _processingQueue: CacheFile[];

    private _processingHead: number;

    private readonly _onLoadComplete: Signal;

    private readonly _onFileComplete: Signal;

    private readonly _onFileError: Signal;

    private readonly _splash: SplashScreen;

    private readonly _base: string;

    private readonly _config?: LoaderConfig;

    constructor(game: Game, config?: LoaderConfig) {
        this.game = game;
        this._loading = false;
        this._loadFinished = false;
        this._loadedFileCount = 0;
        this._totalFileCount = 0;
        this._queuedFiles = [];
        this._queueSize = 1;
        this._processingQueue = [];
        this._processingHead = 0;
        this._onLoadComplete = new Signal();
        this._onFileComplete = new Signal(true);
        this._onFileError = new Signal();
        this._base = "data/images/";
        this._config = config;

        this._splash = new SplashScreen(game, this);
    }

    public get onLoadComplete(): Signal {
        return this._onLoadComplete;
    }

    public get onFileComplete(): Signal {
        return this._onFileComplete;
    }

    public get onFileError(): Signal {
        return this._onFileError;
    }

    public get splash(): SplashScreen {
        return this._splash;
    }

    public get base(): string {
        return this._base;
    }

    public get config(): LoaderConfig | undefined {
        return this._config;
    }

    public get gameLoaded(): boolean {
        return this._loadFinished;
    }

    public get progress(): number {
        return (this._loadedFileCount / this._totalFileCount) * 100 || 100;
    }

    public get roundProgress(): number {
        return Math.round(this.progress);
    }

    public addFileToCache(file: CacheFile): void {
        switch (file.type) {
            case "image":
                this.game.cache.addImage(file);
                break;
            case "sound":
                this.game.cache.addSound(file);
                break;
        }
    }

    public addFileToQueue(key: string, type: string, path: string): void {
        const url: string = Util.urlFromPath(path, this.base);

        const cacheFile: CacheFile = {
            data: null,
            error: false,
            key,
            loaded: false,
            loading: false,
            path: url,
            type,
        };

        this._queuedFiles.push(cacheFile);
        this._totalFileCount++;
    }

    public fileLoadingComplete(file: CacheFile): void {
        this.addFileToCache(file);

        file.loaded = true;
        file.error = false;

        this._onFileComplete.dispatch(file);
        this.processQueue();
    }

    public fileError(file: CacheFile): void {
        file.loaded = true;
        file.error = true;

        this.processQueue();
    }

    public finishedLoading(): void {
        if (this._loadFinished) {
            return;
        }

        this._loading = false;
        this._loadFinished = true;

        this._onLoadComplete.dispatch();
        this.reset();
    }

    public loadFile(file: CacheFile): void {
        const self: Loader = this;

        if (file.type === "image") {
            file.data = new Image();
            if (file.data.complete && file.data.width) {
                this.fileLoadingComplete(file);
            }
            file.data.onload = () => {
                self.fileLoadingComplete(file);
            };
            file.data.onerror = () => {
                self.fileError(file);
            };
            file.data.src = file.path;
            file.data.name = file.key;
        }
    }

    public processQueue(): void {
        const self: Loader = this;

        // Si le queue des ressources est vide, on arrête tout de suite le chargement.
        if (this._queuedFiles.length === 0) {
            this.finishedLoading();
            return;
        }

        /* Clear elements in the processing queue if there are loaded */
        this._processingQueue.forEach((file: CacheFile, index: number) => {
            if (file.error || file.loaded) {
                self._processingQueue.splice(index, 1);

                if (file.error) {
                    self._onFileError.dispatch(file);
                }

                file.loading = false;
                self._loadedFileCount++;
            }
        });

        /* Process the next files */
        for (let i: number = this._processingHead; i < this._queuedFiles.length; i++) {
            const file: CacheFile = this._queuedFiles[i];

            if (file.error || file.loaded) {
                if (i === this._processingHead) {
                    this._processingHead = i + 1;
                }
            } else if (this._processingQueue.length < this._queueSize && !file.loading) {
                file.loading = true;

                this._processingQueue.push(file);
                this.loadFile(file);
            }

            if (this._processingQueue.length >= this._queueSize) {
                break;
            }
        }

        /* Check for finish */
        if (this._processingHead >= this._queuedFiles.length) {
            this.finishedLoading();
        }
    }

    public reset(): void {
        // Not implemented
    }

    public start(): void {
        if (this._loading) {
            return;
        }

        this._loading = true;
        this._loadFinished = false;

        this.splash.boot();

        this.processQueue();
    }

    public image(name: string, path: string): void {
        this.addFileToQueue(name, "image", path);
    }

    public sound(name: string, path: string): void {
        this.addFileToQueue(name, "sound", path);
    }

    public video(name: string, path: string): void {
        this.addFileToQueue(name, "video", path);
    }

}
