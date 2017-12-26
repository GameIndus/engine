class Loader {
    public onLoadComplete: Signal = new Signal();
    public onFileComplete: Signal = new Signal(true);
    public onFileError: Signal = new Signal();
    private game: Game;
    private _loading: boolean;
    private _loadFinished: boolean;

    private _loadedFileCount: number = 0;
    private _totalFileCount: number = 0;

    private _queuedFiles: CacheFile[] = [];
    private _queueSize: number = 1;

    private _processingQueue: CacheFile[] = [];
    private _processingHead: number = 0;

    constructor(game: Game, config?: LoaderConfig) {
        this.game = game;
        if (config) this._config = config;

        this._splash = new SplashScreen(game, this);
    }

    private _splash: SplashScreen;

    public get splash(): SplashScreen {
        return this._splash;
    }

    private _base: string = "data/images/";

    public get base(): string {
        return this._base;
    }

    private _config: LoaderConfig;

    public get config(): LoaderConfig {
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
        let url: string = Util.urlFromPath(path, this.base);

        let cacheFile: CacheFile = {
            type: type,
            key: key,
            path: url,

            data: null,

            loading: false,
            loaded: false,
            error: false
        };


        this._queuedFiles.push(cacheFile);
        this._totalFileCount++;
    }

    public fileLoadingComplete(file: CacheFile): void {
        this.addFileToCache(file);

        file.loaded = true;
        file.error = false;

        this.onFileComplete.dispatch(file);
        this.processQueue();
    }

    public fileError(file: CacheFile): void {
        file.loaded = true;
        file.error = true;

        this.processQueue();
    }

    public finishedLoading(): void {
        if (this._loadFinished) return;

        this._loading = false;
        this._loadFinished = true;

        this.onLoadComplete.dispatch();
        this.reset();
    }

    public loadFile(file: CacheFile): void {
        let self: Loader = this;

        switch (file.type) {
            case "image":
                file.data = new Image();

                // Check before if image is already loaded
                if (file.data.complete && file.data.width) {
                    this.fileLoadingComplete(file);
                }

                file.data.onload = function () {
                    self.fileLoadingComplete(file);
                };

                file.data.onerror = function () {
                    self.fileError(file);
                }

                file.data.src = file.path;
                file.data.name = file.key;

                break;
        }
    }

    public processQueue(): void {
        let self: Loader = this;

        // Si le queue des ressources est vide, on arrête tout de suite le chargement.
        if (this._queuedFiles.length == 0) {
            this.finishedLoading();
            return;
        }

        /* Clear elements in the processing queue if there are loaded */
        this._processingQueue.forEach(function (file: CacheFile, index: number) {

            if (file.error || file.loaded) {

                self._processingQueue.splice(index, 1);

                if (file.error) {
                    self.onFileError.dispatch(file);
                }

                file.loading = false;
                self._loadedFileCount++;
            }

        });

        /* Process the next files */
        for (let i: number = this._processingHead; i < this._queuedFiles.length; i++) {
            let file: CacheFile = this._queuedFiles[i];

            if (file.error || file.loaded) {

                if (i === this._processingHead) {
                    this._processingHead = i + 1;
                }

            } else if (this._processingQueue.length < this._queueSize && !file.loading) {

                file.loading = true;

                this._processingQueue.push(file);
                this.loadFile(file);

            }

            if (this._processingQueue.length >= this._queueSize) break;
        }


        /* Check for finish */
        if (this._processingHead >= this._queuedFiles.length) {
            this.finishedLoading();
        }
    }

    public reset(): void {

    }

    public start(): void {
        if (this._loading) return;

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